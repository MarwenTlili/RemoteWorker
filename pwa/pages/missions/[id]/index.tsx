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

import { Show } from "../../../components/mission/Show";
import { PagedCollection } from "../../../types/collection";
import { Mission } from "../../../types/Mission";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getMission = async (id: string | string[] | undefined) =>
  id ? await fetch<Mission>(`/api/missions/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: mission, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Mission> | undefined>(["mission", id], () =>
      getMission(id)
    );
  const missionData = useMercure(mission, hubURL);

  if (!missionData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Mission ${missionData["@id"]}`}</title>
        </Head>
      </div>
      <Show mission={missionData} text={text} />
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
  const paths = await getPaths(response, "api/missions", "/missions/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
