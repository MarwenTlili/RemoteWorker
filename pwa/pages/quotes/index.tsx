import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/quote/List";
import { PagedCollection } from "../../types/collection";
import { Quote } from "../../types/Quote";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getQuotes = async () =>
  await fetch<PagedCollection<Quote>>("/api/quotes");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: quotes, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Quote>> | undefined
  >("api/quotes", getQuotes);
  const collection = useMercure(quotes, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Quote List</title>
        </Head>
      </div>
      <List quotes={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/quotes", getQuotes);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
