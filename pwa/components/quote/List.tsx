import { FunctionComponent } from "react";
import Link from "next/link";

import ReferenceLinks from "../common/ReferenceLinks";
import { getPath } from "../../utils/dataAccess";
import { Quote } from "../../types/Quote";

interface Props {
  quotes: Quote[];
}

export const List: FunctionComponent<Props> = ({ quotes }) => (
  <div>
    <h1>Quote List</h1>
    <Link href="/quotes/create">
      <a className="btn btn-primary">Create</a>
    </Link>
    <table className="table table-responsive table-striped table-hover">
      <thead>
        <tr>
          <th>id</th>
          <th>proposedPrice</th>
          <th>numberOfDays</th>
          <th>startAt</th>
          <th>date</th>
          <th>confirmed</th>
          <th>engineer</th>
          <th>mission</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {quotes &&
          quotes.length !== 0 &&
          quotes.map(
            (quote) =>
              quote["@id"] && (
                <tr key={quote["@id"]}>
                  <th scope="row">
                    <ReferenceLinks
                      items={{
                        href: getPath(quote["@id"], "/quotes/[id]"),
                        name: quote["@id"],
                      }}
                    />
                  </th>
                  <td>{quote["proposedPrice"]}</td>
                  <td>{quote["numberOfDays"]}</td>
                  <td>{quote["startAt"]?.toLocaleString()}</td>
                  <td>{quote["date"]?.toLocaleString()}</td>
                  <td>{quote["confirmed"]}</td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(quote["engineer"], "/engineers/[id]"),
                        name: quote["engineer"],
                      }}
                    />
                  </td>
                  <td>
                    <ReferenceLinks
                      items={{
                        href: getPath(quote["mission"], "/missions/[id]"),
                        name: quote["mission"],
                      }}
                    />
                  </td>
                  <td>
                    <Link href={getPath(quote["@id"], "/quotes/[id]")}>
                      <a>
                        <i className="bi bi-search" aria-hidden="true"></i>
                        <span className="sr-only">Show</span>
                      </a>
                    </Link>
                  </td>
                  <td>
                    <Link href={getPath(quote["@id"], "/quotes/[id]/edit")}>
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
