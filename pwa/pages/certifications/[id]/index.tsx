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

import { Show } from "../../../components/certification/Show";
import { PagedCollection } from "../../../types/collection";
import { Certification } from "../../../types/Certification";
import { fetch, FetchResponse, getPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getCertification = async (id: string | string[] | undefined) =>
  id
    ? await fetch<Certification>(`/api/certifications/${id}`)
    : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: { data: certification, hubURL, text } = { hubURL: null, text: "" },
  } = useQuery<FetchResponse<Certification> | undefined>(
    ["certification", id],
    () => getCertification(id)
  );
  const certificationData = useMercure(certification, hubURL);

  if (!certificationData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Certification ${certificationData["@id"]}`}</title>
        </Head>
      </div>
      <Show certification={certificationData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["certification", id], () =>
    getCertification(id)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Certification>>(
    "/api/certifications"
  );
  const paths = await getPaths(
    response,
    "api/certifications",
    "/certifications/[id]"
  );

  return {
    paths,
    fallback: true,
  };
};

export default Page;
