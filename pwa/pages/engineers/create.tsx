import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/engineer/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Engineer</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
