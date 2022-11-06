import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/experience/List";
import { PagedCollection } from "../../types/collection";
import { Experience } from "../../types/Experience";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getExperiences = async () =>
  await fetch<PagedCollection<Experience>>("/api/experiences");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: experiences, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Experience>> | undefined
  >("api/experiences", getExperiences);
  const collection = useMercure(experiences, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Experience List</title>
        </Head>
      </div>
      <List experiences={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/experiences", getExperiences);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
