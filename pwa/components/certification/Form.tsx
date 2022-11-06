import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Certification } from "../../types/Certification";

interface Props {
  certification?: Certification;
}

interface SaveParams {
  values: Certification;
}

interface DeleteParams {
  id: string;
}

const saveCertification = async ({ values }: SaveParams) =>
  await fetch<Certification>(
    !values["@id"] ? "/api/certifications" : values["@id"],
    {
      method: !values["@id"] ? "POST" : "PUT",
      body: JSON.stringify(values),
    }
  );

const deleteCertification = async (id: string) =>
  await fetch<Certification>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ certification }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Certification> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveCertification(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Certification> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteCertification(id), {
    onSuccess: () => {
      router.push("/certifications");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!certification || !certification["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: certification["@id"] });
  };

  return (
    <div>
      <h1>
        {certification
          ? `Edit Certification ${certification["@id"]}`
          : `Create Certification`}
      </h1>
      <Formik
        initialValues={
          certification
            ? {
                ...certification,
              }
            : new Certification()
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
                router.push("/api/certifications");
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
                htmlFor="certification_title"
              >
                title
              </label>
              <input
                name="title"
                id="certification_title"
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
              <label
                className="form-control-label"
                htmlFor="certification_companyName"
              >
                companyName
              </label>
              <input
                name="companyName"
                id="certification_companyName"
                value={values.companyName ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.companyName && touched.companyName ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.companyName && touched.companyName ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="companyName"
              />
            </div>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="certification_startDate"
              >
                startDate
              </label>
              <input
                name="startDate"
                id="certification_startDate"
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
              <label
                className="form-control-label"
                htmlFor="certification_endDate"
              >
                endDate
              </label>
              <input
                name="endDate"
                id="certification_endDate"
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
              <label
                className="form-control-label"
                htmlFor="certification_current"
              >
                current
              </label>
              <input
                name="current"
                id="certification_current"
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
              <label
                className="form-control-label"
                htmlFor="certification_engineer"
              >
                engineer
              </label>
              <input
                name="engineer"
                id="certification_engineer"
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
      <Link href="/certifications">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {certification && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
