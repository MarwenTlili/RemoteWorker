import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { User } from "../../types/User";

interface Props {
  users: User[];
}

export const List: FunctionComponent<Props> = ({ users }) => (
  <div>
    <h1>User List</h1>
    <Link href="/users/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>email</th>
          <th>username</th>
          {/* <th>roles</th> */}
          <th>password</th>
          <th>userIdentifier</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users &&
          users.length !== 0 &&
          users.map(
            (user) =>
              user["@id"] && (
                <tr key={user["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(user["@id"], "/users/[id]"),
                        name: user["@id"],
                      }}
                    />
                  </th>
                  <td>{user["email"]}</td>
                  <td>{user["username"]}</td>
                  <td>{user["roles"]}</td>
                  <td>{user["password"]}</td>
                  <td>{user["userIdentifier"]}</td>
                  <td>
                    <Link href={getPath(user["@id"], "/users/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={getPath(user["@id"], "/users/[id]/edit")}>
                      <a>
                        <i className="bi bi-pen" aria-hidden="true" />
                        <span className="sr-only">Edit</span>
                      </a>
                    </Link>
                  </td>
                </tr>
              )
          )}
      </tbody>
    </table>
  </div>
);
