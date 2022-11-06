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

import { Show } from "../../../components/subdomain/Show";
import { PagedCollection } from "../../../types/collection";
import { SubDomain } from "../../../types/SubDomain";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getSubDomain = async (id: string | string[] | undefined) =>
  id
    ? await fetch<SubDomain>(`/api/sub_domains/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: subdomain, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<SubDomain> | undefined>(["subdomain", id], () =>
    getSubDomain(id)
  );
  const subdomainData = useMercure(subdomain, hubURL);

  if (!subdomainData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show SubDomain ${subdomainData["@id"]}`}</title>
        </Head>
      </div>
      <Show subdomain={subdomainData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["subdomain", id], () => getSubDomain(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<SubDomain>>("/api/sub_domains");
  const paths = await getPaths(response, "api/sub_domains", "/subdomains/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
