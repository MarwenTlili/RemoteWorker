import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/study/List";
import { PagedCollection } from "../../types/collection";
import { Study } from "../../types/Study";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getStudys = async () =>
  await fetch<PagedCollection<Study>>("/api/studies");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: studys, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Study>> | undefined
  >("api/studies", getStudys);
  const collection = useMercure(studys, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Study List</title>
        </Head>
      </div>
      <List studys={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/studies", getStudys);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
