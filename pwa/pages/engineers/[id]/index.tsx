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

import { Show } from "../../../components/engineer/Show";
import { PagedCollection } from "../../../types/collection";
import { Engineer } from "../../../types/Engineer";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getEngineer = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Engineer>(`/api/engineers/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: engineer, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Engineer> | undefined>(["engineer", id], () =>
    getEngineer(id)
  );
  const engineerData = useMercure(engineer, hubURL);

  if (!engineerData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Engineer ${engineerData["@id"]}`}</title>
        </Head>
      </div>
      <Show engineer={engineerData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["engineer", id], () => getEngineer(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Engineer>>("/api/engineers");
  const paths = await getPaths(response, "api/engineers", "/engineers/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
