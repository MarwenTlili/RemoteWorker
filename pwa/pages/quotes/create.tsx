import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/quote/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Quote</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
