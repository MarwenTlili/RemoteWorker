import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Experience } from "../../types/Experience";

interface Props {
  experience: Experience;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ experience, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!experience["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(experience["@id"], { method: "DELETE" });
      router.push("/experiences");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Experience ${experience["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Experience ${experience["@id"]}`}</h1>
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
            <td>{experience["title"]}</td>
          </tr>
          <tr>
            <th scope="row">companyName</th>
            <td>{experience["companyName"]}</td>
          </tr>
          <tr>
            <th scope="row">startDate</th>
            <td>{experience["startDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">endDate</th>
            <td>{experience["endDate"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">current</th>
            <td>{experience["current"]}</td>
          </tr>
          <tr>
            <th scope="row">engineer</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(experience["engineer"], "/engineers/[id]"),
                  name: experience["engineer"],
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
      <Link href="/experiences">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(experience["@id"], "/experiences/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
