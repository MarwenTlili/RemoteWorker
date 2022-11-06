import { GetServerSideProps, NextComponentType, NextPageContext } from "next";
import Head from "next/head";
import { dehydrate, QueryClient, useQuery } from "react-query";

import Pagination from "../../components/common/Pagination";
import { List } from "../../components/user/List";
import { PagedCollection } from "../../types/collection";
import { User } from "../../types/User";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

const getUsers = async () => await fetch<PagedCollection<User>>("/api/users");

const Page: NextComponentType<NextPageContext> = () => {
  const { data: { data: users, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<User>> | undefined
  >("api/users", getUsers);
  const collection = useMercure(users, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>User List</title>
        </Head>
      </div>
      <List users={collection["hydra:member"]} />
      <Pagination collection={collection} />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery("api/users", getUsers);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Page;
