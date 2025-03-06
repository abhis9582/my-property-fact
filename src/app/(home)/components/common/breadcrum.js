import Link from "next/link";

export default function CommonBreadCrum({ firstPage, pageName }) {
  return (
    <div className="container bg-light my-2 rounded border p-2">
      <ul className="d-flex text-decoration-none list-unstyled gap-1 fw-bold ps-3">
        <li>
          <Link className="text-decoration-none text-dark" href="/">
            Home
          </Link>
        </li>
        {firstPage && (
          <li>
            <Link
              className="text-decoration-none text-dark text-capitalize"
              href={`/${firstPage}`}
            >
              \ {firstPage}
            </Link>
          </li>
        )}
        <li className="text-secondary">\ {pageName}</li>
      </ul>
    </div>
  );
}
