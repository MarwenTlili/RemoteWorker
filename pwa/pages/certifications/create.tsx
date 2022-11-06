import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/certification/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Certification</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
