import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Mission } from "../../types/Mission";

interface Props {
  mission?: Mission;
}

interface SaveParams {
  values: Mission;
}

interface DeleteParams {
  id: string;
}

const saveMission = async ({ values }: SaveParams) =>
  await fetch<Mission>(!values["@id"] ? "/api/missions" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteMission = async (id: string) =>
  await fetch<Mission>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ mission }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Mission> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveMission(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Mission> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteMission(id), {
    onSuccess: () => {
      router.push("/missions");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!mission || !mission["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: mission["@id"] });
  };

  return (
    <div>
      <h1>{mission ? `Edit Mission ${mission["@id"]}` : `Create Mission`}</h1>
      <Formik
        initialValues={
          mission
            ? {
                ...mission,
              }
            : new Mission()
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
                router.push("/api/missions");
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
              <label className="form-control-label" htmlFor="mission_title">
                title
              </label>
              <input
                name="title"
                id="mission_title"
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
                htmlFor="mission_description"
              >
                description
              </label>
              <input
                name="description"
                id="mission_description"
                value={values.description ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.description && touched.description ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.description && touched.description ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="description"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="mission_budget">
                budget
              </label>
              <input
                name="budget"
                id="mission_budget"
                value={values.budget ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.budget && touched.budget ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.budget && touched.budget ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="budget"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="mission_startDate">
                startDate
              </label>
              <input
                name="startDate"
                id="mission_startDate"
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
              <label className="form-control-label" htmlFor="mission_endDate">
                endDate
              </label>
              <input
                name="endDate"
                id="mission_endDate"
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
              <label className="form-control-label" htmlFor="mission_affected">
                affected
              </label>
              <input
                name="affected"
                id="mission_affected"
                value={values.affected ?? ""}
                type="checkbox"
                placeholder=""
                className={`form-control${
                  errors.affected && touched.affected ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.affected && touched.affected ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="affected"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="mission_client">
                client
              </label>
              <input
                name="client"
                id="mission_client"
                value={values.client ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.client && touched.client ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.client && touched.client ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="client"
              />
            </div>
            <div className="form-group">
              <div className="form-control-label">subDomains</div>
              <FieldArray
                name="subDomains"
                render={(arrayHelpers) => (
                  <div id="mission_subDomains">
                    {values.subDomains && values.subDomains.length > 0 ? (
                      values.subDomains.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`subDomains.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="form-group">
              <div className="form-control-label">quotes</div>
              <FieldArray
                name="quotes"
                render={(arrayHelpers) => (
                  <div id="mission_quotes">
                    {values.quotes && values.quotes.length > 0 ? (
                      values.quotes.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`quotes.${index}`} />
                          <button
                            type="button"
                            onClick={() => arrayHelpers.remove(index)}
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => arrayHelpers.insert(index, "")}
                          >
                            +
                          </button>
                        </div>
                      ))
                    ) : (
                      <button
                        type="button"
                        onClick={() => arrayHelpers.push("")}
                      >
                        Add
                      </button>
                    )}
                  </div>
                )}
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
      <Link href="/missions">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {mission && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
