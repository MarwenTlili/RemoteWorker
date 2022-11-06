import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/client/List";
import { PagedCollection } from "../../types/collection";
import { Client } from "../../types/Client";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getClients = async () =>
  await fetch<PagedCollection<Client>>("/api/clients");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: clients, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Client>> | undefined
  >("api/clients", getClients);
  const collection = useMercure(clients, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Client List</title>
        </Head>
      </div>
      <List clients={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/clients", getClients);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
