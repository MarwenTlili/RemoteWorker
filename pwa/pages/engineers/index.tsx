import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/engineer/List";
import { PagedCollection } from "../../types/collection";
import { Engineer } from "../../types/Engineer";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getEngineers = async () =>
  await fetch<PagedCollection<Engineer>>("/api/engineers");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: engineers, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Engineer>> | undefined
  >("api/engineers", getEngineers);
  const collection = useMercure(engineers, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Engineer List</title>
        </Head>
      </div>
      <List engineers={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/engineers", getEngineers);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
