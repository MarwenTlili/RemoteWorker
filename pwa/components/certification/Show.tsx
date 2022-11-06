import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Certification } from "../../types/Certification";

interface Props {
  certification: Certification;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ certification, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!certification["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(certification["@id"], { method: "DELETE" });
      router.push("/certifications");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Certification ${certification["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Certification ${certification["@id"]}`}</h1>
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
            <td>{certification["title"]}</td>
          </tr>
          <tr>
            <th scope="row">companyName</th>
            <td>{certification["companyName"]}</td>
          </tr>
          <tr>
            <th scope="row">startDate</th>
            <td>{certification["startDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">endDate</th>
            <td>{certification["endDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">current</th>
            <td>{certification["current"]}</td>
          </tr>
          <tr>
            <th scope="row">engineer</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(certification["engineer"], "/engineers/[id]"),
                  name: certification["engineer"],
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
      <Link href="/certifications">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(certification["@id"], "/certifications/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
