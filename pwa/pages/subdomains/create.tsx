import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/subdomain/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create SubDomain</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
