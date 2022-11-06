import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { SubDomain } from "../../types/SubDomain";

interface Props {
  subdomain: SubDomain;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ subdomain, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!subdomain["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(subdomain["@id"], { method: "DELETE" });
      router.push("/subdomains");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show SubDomain ${subdomain["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show SubDomain ${subdomain["@id"]}`}</h1>
      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">title</th>
            <td>{subdomain["title"]}</td>
          </tr>
          <tr>
            <th scope="row">domain</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(subdomain["domain"], "/domains/[id]"),
                  name: subdomain["domain"],
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">missionSubdomain</th>
            <td>
              <ReferenceLinks
                items={subdomain["missionSubdomain"].map((ref: any) => ({
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
      <Link href="/subdomains">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(subdomain["@id"], "/subdomains/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
