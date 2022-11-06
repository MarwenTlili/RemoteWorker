import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Quote } from "../../types/Quote";

interface Props {
  quote?: Quote;
}

interface SaveParams {
  values: Quote;
}

interface DeleteParams {
  id: string;
}

const saveQuote = async ({ values }: SaveParams) =>
  await fetch<Quote>(!values["@id"] ? "/api/quotes" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteQuote = async (id: string) =>
  await fetch<Quote>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ quote }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Quote> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveQuote(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Quote> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteQuote(id), {
    onSuccess: () => {
      router.push("/quotes");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!quote || !quote["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: quote["@id"] });
  };

  return (
    <div>
      <h1>{quote ? `Edit Quote ${quote["@id"]}` : `Create Quote`}</h1>
      <Formik
        initialValues={
          quote
            ? {
                ...quote,
              }
            : new Quote()
        }
        validate={() => {
          const errors = {};
          // add your validation logic here
          return errors;
        }}
        onSubmit={(values, { setSubmitting, setStatus, setErrors }) => {
          const isCreation = !values["@id"];
          saveMutation.mutate(
            { values },
            {
              onSuccess: () => {
                setStatus({
                  isValid: true,
                  msg: `Element ${isCreation ? "created" : "updated"}.`,
                });
                router.push("/api/quotes");
              },
              onError: (error) => {
                setStatus({
                  isValid: false,
                  msg: `${error.message}`,
                });
                if ("fields" in error) {
                  setErrors(error.fields);
                }
              },
              onSettled: () => {
                setSubmitting(false);
              },
            }
          );
        }}
      >
        {({
          values,
          status,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="quote_proposedPrice"
              >
                proposedPrice
              </label>
              <input
                name="proposedPrice"
                id="quote_proposedPrice"
                value={values.proposedPrice ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.proposedPrice && touched.proposedPrice
                    ? " is-invalid"
                    : ""
                }`}
                aria-invalid={
                  errors.proposedPrice && touched.proposedPrice
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="proposedPrice"
              />
            </div>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="quote_numberOfDays"
              >
                numberOfDays
              </label>
              <input
                name="numberOfDays"
                id="quote_numberOfDays"
                value={values.numberOfDays ?? ""}
                type="number"
                placeholder=""
                className={`form-control${
                  errors.numberOfDays && touched.numberOfDays
                    ? " is-invalid"
                    : ""
                }`}
                aria-invalid={
                  errors.numberOfDays && touched.numberOfDays
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="numberOfDays"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="quote_startAt">
                startAt
              </label>
              <input
                name="startAt"
                id="quote_startAt"
                value={values.startAt?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`form-control${
                  errors.startAt && touched.startAt ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.startAt && touched.startAt ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="startAt"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="quote_date">
                date
              </label>
              <input
                name="date"
                id="quote_date"
                value={values.date?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`form-control${
                  errors.date && touched.date ? " is-invalid" : ""
                }`}
                aria-invalid={errors.date && touched.date ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="date"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="quote_confirmed">
                confirmed
              </label>
              <input
                name="confirmed"
                id="quote_confirmed"
                value={values.confirmed ?? ""}
                type="checkbox"
                placeholder=""
                className={`form-control${
                  errors.confirmed && touched.confirmed ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.confirmed && touched.confirmed ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="confirmed"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="quote_engineer">
                engineer
              </label>
              <input
                name="engineer"
                id="quote_engineer"
                value={values.engineer ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.engineer && touched.engineer ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.engineer && touched.engineer ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="engineer"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="quote_mission">
                mission
              </label>
              <input
                name="mission"
                id="quote_mission"
                value={values.mission ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.mission && touched.mission ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.mission && touched.mission ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="mission"
              />
            </div>
            {status && status.msg && (
              <div
                className={`alert ${
                  status.isValid ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                {status.msg}
              </div>
            )}
            <button
              type="submit"
              className="btn btn-success"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </form>
        )}
      </Formik>
      <Link href="/quotes">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {quote && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
