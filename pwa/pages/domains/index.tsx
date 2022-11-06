import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/domain/List";
import { PagedCollection } from "../../types/collection";
import { Domain } from "../../types/Domain";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getDomains = async () =>
  await fetch<PagedCollection<Domain>>("/api/domains");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: domains, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Domain>> | undefined
  >("api/domains", getDomains);
  const collection = useMercure(domains, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Domain List</title>
        </Head>
      </div>
      <List domains={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/domains", getDomains);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
