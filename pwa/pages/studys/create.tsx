import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/study/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Study</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
