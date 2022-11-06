import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/certification/List";
import { PagedCollection } from "../../types/collection";
import { Certification } from "../../types/Certification";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getCertifications = async () =>
  await fetch<PagedCollection<Certification>>("/api/certifications");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: certifications, hubURL } = { hubURL: null } } =
    useQuery<FetchResponse<PagedCollection<Certification>> | undefined>(
      "api/certifications",
      getCertifications
    );
  const collection = useMercure(certifications, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Certification List</title>
        </Head>
      </div>
      <List certifications={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/certifications", getCertifications);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
