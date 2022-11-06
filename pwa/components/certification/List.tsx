import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Certification } from "../../types/Certification";

interface Props {
  certifications: Certification[];
}

export const List: FunctionComponent<Props> = ({ certifications }) => (
  <div>
    <h1>Certification List</h1>
    <Link href="/certifications/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>companyName</th>
          <th>startDate</th>
          <th>endDate</th>
          <th>current</th>
          <th>engineer</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {certifications &&
          certifications.length !== 0 &&
          certifications.map(
            (certification) =>
              certification["@id"] && (
                <tr key={certification["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(
                          certification["@id"],
                          "/certifications/[id]"
                        ),
                        name: certification["@id"],
                      }}
                    />
                  </th>
                  <td>{certification["title"]}</td>
                  <td>{certification["companyName"]}</td>
                  <td>{certification["startDate"]?.toLocaleString()}</td>
                  <td>{certification["endDate"]?.toLocaleString()}</td>
                  <td>{certification["current"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(
                          certification["engineer"],
                          "/engineers/[id]"
                        ),
                        name: certification["engineer"],
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      href={getPath(
                        certification["@id"],
                        "/certifications/[id]"
                      )}
                    >
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link
                      href={getPath(
                        certification["@id"],
                        "/certifications/[id]/edit"
                      )}
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
