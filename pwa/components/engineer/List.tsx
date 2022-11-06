import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Engineer } from "../../types/Engineer";

interface Props {
  engineers: Engineer[];
}

export const List: FunctionComponent<Props> = ({ engineers }) => (
  <div>
    <h1>Engineer List</h1>
    <Link href="/engineers/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>firstName</th>
          <th>lastName</th>
          <th>experience</th>
          <th>dayRate</th>
          <th>presentation</th>
          <th>country</th>
          <th>city</th>
          <th>phone</th>
          <th>photo</th>
          <th>gender</th>
          <th>userRef</th>
          <th>studies</th>
          <th>certifications</th>
          <th>experiences</th>
          <th>quotes</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {engineers &&
          engineers.length !== 0 &&
          engineers.map(
            (engineer) =>
              engineer["@id"] && (
                <tr key={engineer["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(engineer["@id"], "/engineers/[id]"),
                        name: engineer["@id"],
                      }}
                    />
                  </th>
                  <td>{engineer["firstName"]}</td>
                  <td>{engineer["lastName"]}</td>
                  <td>{engineer["experience"]}</td>
                  <td>{engineer["dayRate"]}</td>
                  <td>{engineer["presentation"]}</td>
                  <td>{engineer["country"]}</td>
                  <td>{engineer["city"]}</td>
                  <td>{engineer["phone"]}</td>
                  <td>{engineer["photo"]}</td>
                  <td>{engineer["gender"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(engineer["userRef"], "/users/[id]"),
                        name: engineer["userRef"],
                      }}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={engineer["studies"].map((ref: any) => ({
                        href: getPath(ref, "/studys/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={engineer["certifications"].map((ref: any) => ({
                        href: getPath(ref, "/certifications/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={engineer["experiences"].map((ref: any) => ({
                        href: getPath(ref, "/experiences/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={engineer["quotes"].map((ref: any) => ({
                        href: getPath(ref, "/quotes/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <Link href={getPath(engineer["@id"], "/engineers/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={getPath(engineer["@id"], "/engineers/[id]/edit")}
                    >
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
