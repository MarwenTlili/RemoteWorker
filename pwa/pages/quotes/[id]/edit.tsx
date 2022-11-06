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

import { Form } from "../../../components/quote/Form";
import { PagedCollection } from "../../../types/collection";
import { Quote } from "../../../types/Quote";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";

const getQuote = async (id: string | string[] | undefined) =>
  id ? await fetch<Quote>(`/api/quotes/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: quote } = {} } = useQuery<
    FetchResponse<Quote> | undefined
  >(["quote", id], () => getQuote(id));

  if (!quote) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{quote && `Edit Quote ${quote["@id"]}`}</title>
        </Head>
      </div>
      <Form quote={quote} />
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
  const paths = await getPaths(response, "api/quotes", "/quotes/[id]/edit");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
