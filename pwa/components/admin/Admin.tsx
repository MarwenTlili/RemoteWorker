import Head from "next/head";
import { SetStateAction, useContext, useState} from "react";
import {
  Layout,
  LayoutProps,
  localStorageStore,
  Login,
  LoginClasses,
  Resource,
} from "react-admin";
import {
  fetchHydra as baseFetchHydra,
  HydraAdmin,
  hydraDataProvider as baseHydraDataProvider,
  OpenApiAdmin,
  ResourceGuesser,
} from "@api-platform/admin";
import {parseHydraDocumentation} from "@api-platform/api-doc-parser";
import AppBar from "./AppBar";
import {LoginForm} from "./LoginForm";
import DocContext from "./DocContext";
import authProvider from "../../utils/authProvider";
import {ENTRYPOINT} from "../../config/entrypoint";
import users from "./users";

const getHeaders = () => localStorage.getItem("token") ? {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
} : {};
const fetchHydra = (url: URL, options = {}) =>
  baseFetchHydra(url, {
    ...options,
    // @ts-ignore
    headers: getHeaders,
  });

const apiDocumentationParser = (setRedirectToLogin: (arg0: boolean) => void) => async () => {
  try {
    setRedirectToLogin(false);

    // @ts-ignore
    return await parseHydraDocumentation(ENTRYPOINT, {headers: getHeaders});
  } catch (result) {
    // @ts-ignore
    const {api, response, status} = result;
    if (status !== 401 || !response) {
      throw result;
    }

    // Prevent infinite loop if the token is expired
    localStorage.removeItem("token");

    setRedirectToLogin(true);

    return {
      api,
      response,
      status,
    };
  }
};
const dataProvider = (setRedirectToLogin: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => baseHydraDataProvider({
  useEmbedded: false,
  // @ts-ignore
  entrypoint: ENTRYPOINT,
  httpClient: fetchHydra,
  apiDocumentationParser: apiDocumentationParser(setRedirectToLogin),
});

const LoginPage = () => (
  <Login
    sx={{
      backgroundImage:
        'radial-gradient(circle at 50% 14em, #90dfe7 0%, #288690 60%, #288690 100%)',
      [`& .${LoginClasses.icon}`]: {
        backgroundColor: 'secondary.main',
      },
    }}>
    <LoginForm/>
  </Login>
);

const CustomLayout = (props: JSX.IntrinsicAttributes & LayoutProps) => <Layout
  {...props}
  appBar={AppBar}
/>;

const AdminUI = () => {
  const { docType } = useContext(DocContext);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  return docType === 'hydra' ? (
    <HydraAdmin
      dataProvider={dataProvider(setRedirectToLogin)}
      authProvider={authProvider}
      entrypoint={window.origin}
      layout={CustomLayout}
      loginPage={LoginPage}>
      <Resource name={"api/users"} {...users}/>
      <ResourceGuesser name={"api/certifications"} />
      <ResourceGuesser name={"api/clients"} />
      <ResourceGuesser name={"api/domains"} />
      <ResourceGuesser name={"api/engineers"} />
      <ResourceGuesser name={"api/experiences"} />
      <ResourceGuesser name={"api/missions"} />
      <ResourceGuesser name={"api/quotes"} />
      <ResourceGuesser name={"api/studies"} />
      <ResourceGuesser name={"api/sub_domains"} />
    </HydraAdmin>
  ) : (
    <OpenApiAdmin
      authProvider={authProvider}
      entrypoint={window.origin}
      docEntrypoint={`${window.origin}/docs.json`}
      layout={CustomLayout}
      loginPage={LoginPage}
    />
  );
};

const store = localStorageStore();

const AdminWithContext = () => {
  const [docType, setDocType] = useState(
    store.getItem<string>('docType', 'hydra'),
  );

  return (
    <DocContext.Provider
      value={{
        docType,
        setDocType,
      }}>
      <AdminUI />
    </DocContext.Provider>
  );
};

const AdminApp = () => (
  <>
    <Head>
      <title>API Platform Admin</title>
    </Head>
    <AdminWithContext />
  </>
)

export default AdminApp;
