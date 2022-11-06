import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/mission/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Mission</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
