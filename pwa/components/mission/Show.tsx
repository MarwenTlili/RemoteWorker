import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Mission } from "../../types/Mission";

interface Props {
  mission: Mission;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ mission, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!mission["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(mission["@id"], { method: "DELETE" });
      router.push("/missions");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Mission ${mission["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Mission ${mission["@id"]}`}</h1>
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
            <td>{mission["title"]}</td>
          </tr>
          <tr>
            <th scope="row">description</th>
            <td>{mission["description"]}</td>
          </tr>
          <tr>
            <th scope="row">budget</th>
            <td>{mission["budget"]}</td>
          </tr>
          <tr>
            <th scope="row">startDate</th>
            <td>{mission["startDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">endDate</th>
            <td>{mission["endDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">affected</th>
            <td>{mission["affected"]}</td>
          </tr>
          <tr>
            <th scope="row">client</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(mission["client"], "/clients/[id]"),
                  name: mission["client"],
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">subDomains</th>
            <td>
              <ReferenceLinks
                items={mission["subDomains"].map((ref: any) => ({
                  href: getPath(ref, "/subdomains/[id]"),
                  name: ref,
                }))}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">quotes</th>
            <td>
              <ReferenceLinks
                items={mission["quotes"].map((ref: any) => ({
                  href: getPath(ref, "/quotes/[id]"),
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
      <Link href="/missions">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(mission["@id"], "/missions/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
