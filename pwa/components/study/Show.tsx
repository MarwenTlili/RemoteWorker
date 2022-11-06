import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Study } from "../../types/Study";

interface Props {
  study: Study;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ study, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!study["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(study["@id"], { method: "DELETE" });
      router.push("/studys");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Study ${study["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Study ${study["@id"]}`}</h1>
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
            <td>{study["title"]}</td>
          </tr>
          <tr>
            <th scope="row">university</th>
            <td>{study["university"]}</td>
          </tr>
          <tr>
            <th scope="row">startDate</th>
            <td>{study["startDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">endDate</th>
            <td>{study["endDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">current</th>
            <td>{study["current"]}</td>
          </tr>
          <tr>
            <th scope="row">engineer</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(study["engineer"], "/engineers/[id]"),
                  name: study["engineer"],
                }}
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
      <Link href="/studys">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(study["@id"], "/studys/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
