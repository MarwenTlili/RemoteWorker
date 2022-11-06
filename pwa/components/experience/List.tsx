import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Experience } from "../../types/Experience";

interface Props {
  experiences: Experience[];
}

export const List: FunctionComponent<Props> = ({ experiences }) => (
  <div>
    <h1>Experience List</h1>
    <Link href="/experiences/create">
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
        {experiences &&
          experiences.length !== 0 &&
          experiences.map(
            (experience) =>
              experience["@id"] && (
                <tr key={experience["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(experience["@id"], "/experiences/[id]"),
                        name: experience["@id"],
                      }}
                    />
                  </th>
                  <td>{experience["title"]}</td>
                  <td>{experience["companyName"]}</td>
                  <td>{experience["startDate"]?.toLocaleString()}</td>
                  <td>{experience["endDate"]?.toLocaleString()}</td>
                  <td>{experience["current"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(
                          experience["engineer"],
                          "/engineers/[id]"
                        ),
                        name: experience["engineer"],
                      }}
                    />
                  </td>
                  <td>
                    <Link
                      href={getPath(experience["@id"], "/experiences/[id]")}
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
                        experience["@id"],
                        "/experiences/[id]/edit"
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
