import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { SubDomain } from "../../types/SubDomain";

interface Props {
  subdomains: SubDomain[];
}

export const List: FunctionComponent<Props> = ({ subdomains }) => (
  <div>
    <h1>SubDomain List</h1>
    <Link href="/subdomains/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>domain</th>
          <th>missionSubdomain</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {subdomains &&
          subdomains.length !== 0 &&
          subdomains.map(
            (subdomain) =>
              subdomain["@id"] && (
                <tr key={subdomain["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(subdomain["@id"], "/subdomains/[id]"),
                        name: subdomain["@id"],
                      }}
                    />
                  </th>
                  <td>{subdomain["title"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(subdomain["domain"], "/domains/[id]"),
                        name: subdomain["domain"],
                      }}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={subdomain["missionSubdomain"].map((ref: any) => ({
                        href: getPath(ref, "/missions/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <Link href={getPath(subdomain["@id"], "/subdomains/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={getPath(subdomain["@id"], "/subdomains/[id]/edit")}
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
