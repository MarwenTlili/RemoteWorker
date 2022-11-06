import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Quote } from "../../types/Quote";

interface Props {
  quote: Quote;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ quote, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!quote["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(quote["@id"], { method: "DELETE" });
      router.push("/quotes");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Quote ${quote["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Quote ${quote["@id"]}`}</h1>
      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">proposedPrice</th>
            <td>{quote["proposedPrice"]}</td>
          </tr>
          <tr>
            <th scope="row">numberOfDays</th>
            <td>{quote["numberOfDays"]}</td>
          </tr>
          <tr>
            <th scope="row">startAt</th>
            <td>{quote["startAt"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">date</th>
            <td>{quote["date"]?.toLocaleString()}</td>
          </tr>
          <tr>
            <th scope="row">confirmed</th>
            <td>{quote["confirmed"]}</td>
          </tr>
          <tr>
            <th scope="row">engineer</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(quote["engineer"], "/engineers/[id]"),
                  name: quote["engineer"],
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">mission</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(quote["mission"], "/missions/[id]"),
                  name: quote["mission"],
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
      <Link href="/quotes">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(quote["@id"], "/quotes/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
