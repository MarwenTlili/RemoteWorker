import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Study } from "../../types/Study";

interface Props {
  studys: Study[];
}

export const List: FunctionComponent<Props> = ({ studys }) => (
  <div>
    <h1>Study List</h1>
    <Link href="/studys/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>title</th>
          <th>university</th>
          <th>startDate</th>
          <th>endDate</th>
          <th>current</th>
          <th>engineer</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {studys &&
          studys.length !== 0 &&
          studys.map(
            (study) =>
              study["@id"] && (
                <tr key={study["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(study["@id"], "/studys/[id]"),
                        name: study["@id"],
                      }}
                    />
                  </th>
                  <td>{study["title"]}</td>
                  <td>{study["university"]}</td>
                  <td>{study["startDate"]?.toLocaleString()}</td>
                  <td>{study["endDate"]?.toLocaleString()}</td>
                  <td>{study["current"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(study["engineer"], "/engineers/[id]"),
                        name: study["engineer"],
                      }}
                    />
                  </td>
                  <td>
                    <Link href={getPath(study["@id"], "/studys/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={getPath(study["@id"], "/studys/[id]/edit")}>
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
