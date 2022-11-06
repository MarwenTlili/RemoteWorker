import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/domain/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Domain</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
