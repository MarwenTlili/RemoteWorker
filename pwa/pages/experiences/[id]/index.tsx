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

import { Show } from "../../../components/experience/Show";
import { PagedCollection } from "../../../types/collection";
import { Experience } from "../../../types/Experience";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getExperience = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Experience>(`/api/experiences/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: experience, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Experience> | undefined>(["experience", id], () =>
    getExperience(id)
  );
  const experienceData = useMercure(experience, hubURL);

  if (!experienceData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Experience ${experienceData["@id"]}`}</title>
        </Head>
      </div>
      <Show experience={experienceData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["experience", id], () => getExperience(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Experience>>("/api/experiences");
  const paths = await getPaths(
    response,
    "api/experiences",
    "/experiences/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
