import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Experience } from "../../types/Experience";

interface Props {
  experience?: Experience;
}

interface SaveParams {
  values: Experience;
}

interface DeleteParams {
  id: string;
}

const saveExperience = async ({ values }: SaveParams) =>
  await fetch<Experience>(!values["@id"] ? "/api/experiences" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteExperience = async (id: string) =>
  await fetch<Experience>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ experience }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Experience> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveExperience(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Experience> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteExperience(id), {
    onSuccess: () => {
      router.push("/experiences");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!experience || !experience["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: experience["@id"] });
  };

  return (
    <div>
      <h1>
        {experience
          ? `Edit Experience ${experience["@id"]}`
          : `Create Experience`}
      </h1>
      <Formik
        initialValues={
          experience
            ? {
                ...experience,
              }
            : new Experience()
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
                router.push("/api/experiences");
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
              <label className="form-control-label" htmlFor="experience_title">
                title
              </label>
              <input
                name="title"
                id="experience_title"
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
                htmlFor="experience_companyName"
              >
                companyName
              </label>
              <input
                name="companyName"
                id="experience_companyName"
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
                htmlFor="experience_startDate"
              >
                startDate
              </label>
              <input
                name="startDate"
                id="experience_startDate"
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
                htmlFor="experience_endDate"
              >
                endDate
              </label>
              <input
                name="endDate"
                id="experience_endDate"
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
                htmlFor="experience_current"
              >
                current
              </label>
              <input
                name="current"
                id="experience_current"
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
                htmlFor="experience_engineer"
              >
                engineer
              </label>
              <input
                name="engineer"
                id="experience_engineer"
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
      <Link href="/experiences">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {experience && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
