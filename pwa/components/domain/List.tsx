import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Domain } from "../../types/Domain";

interface Props {
  domains: Domain[];
}

export const List: FunctionComponent<Props> = ({ domains }) => (
  <div>
    <h1>Domain List</h1>
    <Link href="/domains/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>subDomains</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {domains &&
          domains.length !== 0 &&
          domains.map(
            (domain) =>
              domain["@id"] && (
                <tr key={domain["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(domain["@id"], "/domains/[id]"),
                        name: domain["@id"],
                      }}
                    />
                  </th>
                  <td>{domain["title"]}</td>
                  <td>
                    <ReferenceLinks
                      items={domain["subDomains"].map((ref: any) => ({
                        href: getPath(ref, "/subdomains/[id]"),
                        name: ref,
                      }))}
                    />
                  </td>
                  <td>
                    <Link href={getPath(domain["@id"], "/domains/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={getPath(domain["@id"], "/domains/[id]/edit")}>
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
