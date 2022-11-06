import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Study } from "../../types/Study";

interface Props {
  study?: Study;
}

interface SaveParams {
  values: Study;
}

interface DeleteParams {
  id: string;
}

const saveStudy = async ({ values }: SaveParams) =>
  await fetch<Study>(!values["@id"] ? "/api/studies" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteStudy = async (id: string) =>
  await fetch<Study>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ study }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Study> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveStudy(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Study> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteStudy(id), {
    onSuccess: () => {
      router.push("/studys");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!study || !study["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: study["@id"] });
  };

  return (
    <div>
      <h1>{study ? `Edit Study ${study["@id"]}` : `Create Study`}</h1>
      <Formik
        initialValues={
          study
            ? {
                ...study,
              }
            : new Study()
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
                router.push("/api/studies");
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
              <label className="form-control-label" htmlFor="study_title">
                title
              </label>
              <input
                name="title"
                id="study_title"
                value={values.title ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.title && touched.title ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.title && touched.title ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="title"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="study_university">
                university
              </label>
              <input
                name="university"
                id="study_university"
                value={values.university ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.university && touched.university ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.university && touched.university ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="university"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="study_startDate">
                startDate
              </label>
              <input
                name="startDate"
                id="study_startDate"
                value={values.startDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`form-control${
                  errors.startDate && touched.startDate ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.startDate && touched.startDate ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="startDate"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="study_endDate">
                endDate
              </label>
              <input
                name="endDate"
                id="study_endDate"
                value={values.endDate?.toLocaleString() ?? ""}
                type="dateTime"
                placeholder=""
                className={`form-control${
                  errors.endDate && touched.endDate ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.endDate && touched.endDate ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="endDate"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="study_current">
                current
              </label>
              <input
                name="current"
                id="study_current"
                value={values.current ?? ""}
                type="checkbox"
                placeholder=""
                className={`form-control${
                  errors.current && touched.current ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.current && touched.current ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="current"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="study_engineer">
                engineer
              </label>
              <input
                name="engineer"
                id="study_engineer"
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
      <Link href="/studys">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {study && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
