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

import { Show } from "../../../components/quote/Show";
import { PagedCollection } from "../../../types/collection";
import { Quote } from "../../../types/Quote";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getQuote = async (id: string | string[] | undefined) =>
  id ? await fetch<Quote>(`/api/quotes/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: quote, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Quote> | undefined>(["quote", id], () =>
      getQuote(id)
    );
  const quoteData = useMercure(quote, hubURL);

  if (!quoteData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Quote ${quoteData["@id"]}`}</title>
        </Head>
      </div>
      <Show quote={quoteData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["quote", id], () => getQuote(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Quote>>("/api/quotes");
  const paths = await getPaths(response, "api/quotes", "/quotes/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
