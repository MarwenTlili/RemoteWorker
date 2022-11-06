import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Domain } from "../../types/Domain";

interface Props {
  domain?: Domain;
}

interface SaveParams {
  values: Domain;
}

interface DeleteParams {
  id: string;
}

const saveDomain = async ({ values }: SaveParams) =>
  await fetch<Domain>(!values["@id"] ? "/api/domains" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteDomain = async (id: string) =>
  await fetch<Domain>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ domain }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Domain> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveDomain(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Domain> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteDomain(id), {
    onSuccess: () => {
      router.push("/domains");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!domain || !domain["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: domain["@id"] });
  };

  return (
    <div>
      <h1>{domain ? `Edit Domain ${domain["@id"]}` : `Create Domain`}</h1>
      <Formik
        initialValues={
          domain
            ? {
                ...domain,
              }
            : new Domain()
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
                router.push("/api/domains");
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
              <label className="form-control-label" htmlFor="domain_title">
                title
              </label>
              <input
                name="title"
                id="domain_title"
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
              <div className="form-control-label">subDomains</div>
              <FieldArray
                name="subDomains"
                render={(arrayHelpers) => (
                  <div id="domain_subDomains">
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
      <Link href="/domains">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {domain && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
