import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/mission/List";
import { PagedCollection } from "../../types/collection";
import { Mission } from "../../types/Mission";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getMissions = async () =>
  await fetch<PagedCollection<Mission>>("/api/missions");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: missions, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Mission>> | undefined
  >("api/missions", getMissions);
  const collection = useMercure(missions, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Mission List</title>
        </Head>
      </div>
      <List missions={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/missions", getMissions);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
