import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { fetch, getPath } from "../../utils/dataAccess";
import { User } from "../../types/User";

interface Props {
  user: User;
  text: string;
}

export const Show: FunctionComponent<Props> = ({ user, text }) => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (!user["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await fetch(user["@id"], { method: "DELETE" });
      router.push("/users");
    } catch (error) {
      setError("Error when deleting the resource.");
      console.error(error);
    }
  };

  return (
    <div>
      <Head>
        <title>{`Show User ${user["@id"]}`}</title>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      </Head>
      <h1>{`Show User ${user["@id"]}`}</h1>
      <table className="table table-responsive table-striped table-hover">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">email</th>
            <td>{user["email"]}</td>
          </tr>
          <tr>
            <th scope="row">username</th>
            <td>{user["username"]}</td>
          </tr>
          <tr>
            <th scope="row">roles</th>
            <td>{user["roles"]}</td>
          </tr>
          <tr>
            <th scope="row">password</th>
            <td>{user["password"]}</td>
          </tr>
          <tr>
            <th scope="row">userIdentifier</th>
            <td>{user["userIdentifier"]}</td>
          </tr>
        </tbody>
      </table>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <Link href="/users">
        <a className="btn btn-primary">Back to list</a>
      </Link>{" "}
      <Link href={getPath(user["@id"], "/users/[id]/edit")}>
        <a className="btn btn-warning">Edit</a>
      </Link>
      <button className="btn btn-danger" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};
