import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/subdomain/List";
import { PagedCollection } from "../../types/collection";
import { SubDomain } from "../../types/SubDomain";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getSubDomains = async () =>
  await fetch<PagedCollection<SubDomain>>("/api/sub_domains");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: subdomains, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<SubDomain>> | undefined
  >("api/sub_domains", getSubDomains);
  const collection = useMercure(subdomains, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>SubDomain List</title>
        </Head>
      </div>
      <List subdomains={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/sub_domains", getSubDomains);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
