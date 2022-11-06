import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import ReferenceLinks from "../common/ReferenceLinks";
import { fetch, getPath } from "../../utils/dataAccess";
import { Engineer } from "../../types/Engineer";

interface Props {
  engineer: Engineer;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ engineer, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!engineer["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(engineer["@id"], { method: "DELETE" });
      router.push("/engineers");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show Engineer ${engineer["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show Engineer ${engineer["@id"]}`}</h1>
      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">firstName</th>
            <td>{engineer["firstName"]}</td>
          </tr>
          <tr>
            <th scope="row">lastName</th>
            <td>{engineer["lastName"]}</td>
          </tr>
          <tr>
            <th scope="row">experience</th>
            <td>{engineer["experience"]}</td>
          </tr>
          <tr>
            <th scope="row">dayRate</th>
            <td>{engineer["dayRate"]}</td>
          </tr>
          <tr>
            <th scope="row">presentation</th>
            <td>{engineer["presentation"]}</td>
          </tr>
          <tr>
            <th scope="row">country</th>
            <td>{engineer["country"]}</td>
          </tr>
          <tr>
            <th scope="row">city</th>
            <td>{engineer["city"]}</td>
          </tr>
          <tr>
            <th scope="row">phone</th>
            <td>{engineer["phone"]}</td>
          </tr>
          <tr>
            <th scope="row">photo</th>
            <td>{engineer["photo"]}</td>
          </tr>
          <tr>
            <th scope="row">gender</th>
            <td>{engineer["gender"]}</td>
          </tr>
          <tr>
            <th scope="row">userRef</th>
            <td>
              <ReferenceLinks
                items={{
                  href: getPath(engineer["userRef"], "/users/[id]"),
                  name: engineer["userRef"],
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">studies</th>
            <td>
              <ReferenceLinks
                items={engineer["studies"].map((ref: any) => ({
                  href: getPath(ref, "/studys/[id]"),
                  name: ref,
                }))}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">certifications</th>
            <td>
              <ReferenceLinks
                items={engineer["certifications"].map((ref: any) => ({
                  href: getPath(ref, "/certifications/[id]"),
                  name: ref,
                }))}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">experiences</th>
            <td>
              <ReferenceLinks
                items={engineer["experiences"].map((ref: any) => ({
                  href: getPath(ref, "/experiences/[id]"),
                  name: ref,
                }))}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">quotes</th>
            <td>
              <ReferenceLinks
                items={engineer["quotes"].map((ref: any) => ({
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
      <Link href="/engineers">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(engineer["@id"], "/engineers/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
