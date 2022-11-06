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

import { Show } from "../../../components/client/Show";
import { PagedCollection } from "../../../types/collection";
import { Client } from "../../../types/Client";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getClient = async (id: string | string[] | undefined) =>
  id ? await fetch<Client>(`/api/clients/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: client, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Client> | undefined>(["client", id], () =>
      getClient(id)
    );
  const clientData = useMercure(client, hubURL);

  if (!clientData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Client ${clientData["@id"]}`}</title>
        </Head>
      </div>
      <Show client={clientData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["client", id], () => getClient(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Client>>("/api/clients");
  const paths = await getPaths(response, "api/clients", "/clients/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
