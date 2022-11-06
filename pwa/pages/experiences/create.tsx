import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/experience/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Experience</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
