import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Mission } from "../../types/Mission";

interface Props {
  missions: Mission[];
}

export const List: FunctionComponent<Props> = ({ missions }) => (
  <div>
    <h1>Mission List</h1>
    <Link href="/missions/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>description</th>
          <th>budget</th>
          <th>startDate</th>
          <th>endDate</th>
          <th>affected</th>
          <th>client</th>
          <th>subDomains</th>
          <th>quotes</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {missions &&
          missions.length !== 0 &&
          missions.map(
            (mission) =>
              mission["@id"] && (
                <tr key={mission["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(mission["@id"], "/missions/[id]"),
                        name: mission["@id"],
                      }}
                    />
                  </th>
                  <td>{mission["title"]}</td>
                  <td>{mission["description"]}</td>
                  <td>{mission["budget"]}</td>
                  <td>{mission["startDate"]?.toLocaleString()}</td>
                  <td>{mission["endDate"]?.toLocaleString()}</td>
                  <td>{mission["affected"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(mission["client"], "/clients/[id]"),
                        name: mission["client"],
                      }}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={mission["subDomains"].map((ref: any) => ({
                        href: getPath(ref, "/subdomains/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={mission["quotes"].map((ref: any) => ({
                        href: getPath(ref, "/quotes/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <Link href={getPath(mission["@id"], "/missions/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={getPath(mission["@id"], "/missions/[id]/edit")}>
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
