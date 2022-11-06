import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Client } from "../../types/Client";

interface Props {
  clients: Client[];
}

export const List: FunctionComponent<Props> = ({ clients }) => (
  <div>
    <h1>Client List</h1>
    <Link href="/clients/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>address</th>
          <th>presentation</th>
          <th>country</th>
          <th>city</th>
          <th>phone</th>
          <th>userRef</th>
          <th>missions</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {clients &&
          clients.length !== 0 &&
          clients.map(
            (client) =>
              client["@id"] && (
                <tr key={client["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(client["@id"], "/clients/[id]"),
                        name: client["@id"],
                      }}
                    />
                  </th>
                  <td>{client["name"]}</td>
                  <td>{client["address"]}</td>
                  <td>{client["presentation"]}</td>
                  <td>{client["country"]}</td>
                  <td>{client["city"]}</td>
                  <td>{client["phone"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(client["userRef"], "/users/[id]"),
                        name: client["userRef"],
                      }}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={client["missions"].map((ref: any) => ({
                        href: getPath(ref, "/missions/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <Link href={getPath(client["@id"], "/clients/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={getPath(client["@id"], "/clients/[id]/edit")}>
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
