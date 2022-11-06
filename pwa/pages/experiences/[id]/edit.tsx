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

import { Form } from "../../../components/experience/Form";
import { PagedCollection } from "../../../types/collection";
import { Experience } from "../../../types/Experience";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";

const getExperience = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Experience>(`/api/experiences/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: experience } = {} } = useQuery<
    FetchResponse<Experience> | undefined
  >(["experience", id], () => getExperience(id));

  if (!experience) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{experience && `Edit Experience ${experience["@id"]}`}</title>
        </Head>
      </div>
      <Form experience={experience} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["experience", id], () => getExperience(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Experience>>("/api/experiences");
  const paths = await getPaths(
    response,
    "api/experiences",
    "/experiences/[id]/edit"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
