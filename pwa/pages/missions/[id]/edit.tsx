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

import { Form } from "../../../components/mission/Form";
import { PagedCollection } from "../../../types/collection";
import { Mission } from "../../../types/Mission";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";

const getMission = async (id: string | string[] | undefined) =>
  id ? await fetch<Mission>(`/api/missions/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: mission } = {} } = useQuery<
    FetchResponse<Mission> | undefined
  >(["mission", id], () => getMission(id));

  if (!mission) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{mission && `Edit Mission ${mission["@id"]}`}</title>
        </Head>
      </div>
      <Form mission={mission} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["mission", id], () => getMission(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Mission>>("/api/missions");
  const paths = await getPaths(response, "api/missions", "/missions/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
