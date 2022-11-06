import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/client/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Client</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
