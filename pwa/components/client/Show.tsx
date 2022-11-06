import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Client } from "../../types/Client";

interface Props {
  client: Client;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ client, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!client["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(client["@id"], { method: "DELETE" });
      router.push("/clients");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Client ${client["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Client ${client["@id"]}`}</h1>
      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">name</th>
            <td>{client["name"]}</td>
          </tr>
          <tr>
            <th scope="row">address</th>
            <td>{client["address"]}</td>
          </tr>
          <tr>
            <th scope="row">presentation</th>
            <td>{client["presentation"]}</td>
          </tr>
          <tr>
            <th scope="row">country</th>
            <td>{client["country"]}</td>
          </tr>
          <tr>
            <th scope="row">city</th>
            <td>{client["city"]}</td>
          </tr>
          <tr>
            <th scope="row">phone</th>
            <td>{client["phone"]}</td>
          </tr>
          <tr>
            <th scope="row">userRef</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(client["userRef"], "/users/[id]"),
                  name: client["userRef"],
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">missions</th>
            <td>
              <ReferenceLinks
                items={client["missions"].map((ref: any) => ({
                  href: getPath(ref, "/missions/[id]"),
                  name: ref,
                }))}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Link href="/clients">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(client["@id"], "/clients/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
