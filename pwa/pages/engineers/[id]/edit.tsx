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

import { Form } from "../../../components/engineer/Form";
import { PagedCollection } from "../../../types/collection";
import { Engineer } from "../../../types/Engineer";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";

const getEngineer = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Engineer>(`/api/engineers/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: engineer } = {} } = useQuery<
    FetchResponse<Engineer> | undefined
  >(["engineer", id], () => getEngineer(id));

  if (!engineer) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{engineer && `Edit Engineer ${engineer["@id"]}`}</title>
        </Head>
      </div>
      <Form engineer={engineer} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["engineer", id], () => getEngineer(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Engineer>>("/api/engineers");
  const paths = await getPaths(
    response,
    "api/engineers",
    "/engineers/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
