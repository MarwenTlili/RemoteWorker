import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Form } from "../../../components/study/Form";
import { PagedCollection } from "../../../types/collection";
import { Study } from "../../../types/Study";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";

const getStudy = async (id: string | string[] | undefined) =>
  id ? await fetch<Study>(`/api/studies/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: study } = {} } = useQuery<
    FetchResponse<Study> | undefined
  >(["study", id], () => getStudy(id));

  if (!study) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{study && `Edit Study ${study["@id"]}`}</title>
        </Head>
      </div>
      <Form study={study} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["study", id], () => getStudy(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Study>>("/api/studies");
  const paths = await getPaths(response, "api/studies", "/studys/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
