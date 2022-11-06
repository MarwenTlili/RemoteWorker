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

import { Show } from "../../../components/domain/Show";
import { PagedCollection } from "../../../types/collection";
import { Domain } from "../../../types/Domain";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getDomain = async (id: string | string[] | undefined) =>
  id ? await fetch<Domain>(`/api/domains/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: domain, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Domain> | undefined>(["domain", id], () =>
      getDomain(id)
    );
  const domainData = useMercure(domain, hubURL);

  if (!domainData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Domain ${domainData["@id"]}`}</title>
        </Head>
      </div>
      <Show domain={domainData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["domain", id], () => getDomain(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Domain>>("/api/domains");
  const paths = await getPaths(response, "api/domains", "/domains/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
