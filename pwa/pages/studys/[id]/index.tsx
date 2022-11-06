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

import { Show } from "../../../components/study/Show";
import { PagedCollection } from "../../../types/collection";
import { Study } from "../../../types/Study";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getStudy = async (id: string | string[] | undefined) =>
  id ? await fetch<Study>(`/api/studies/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: study, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Study> | undefined>(["study", id], () =>
      getStudy(id)
    );
  const studyData = useMercure(study, hubURL);

  if (!studyData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Study ${studyData["@id"]}`}</title>
        </Head>
      </div>
      <Show study={studyData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["study", id], () => getStudy(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Study>>("/api/studies");
  const paths = await getPaths(response, "api/studies", "/studys/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
