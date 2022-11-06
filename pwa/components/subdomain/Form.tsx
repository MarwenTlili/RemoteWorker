import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { SubDomain } from "../../types/SubDomain";

interface Props {
  subdomain?: SubDomain;
}

interface SaveParams {
  values: SubDomain;
}

interface DeleteParams {
  id: string;
}

const saveSubDomain = async ({ values }: SaveParams) =>
  await fetch<SubDomain>(!values["@id"] ? "/api/sub_domains" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteSubDomain = async (id: string) =>
  await fetch<SubDomain>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ subdomain }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<SubDomain> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveSubDomain(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<SubDomain> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteSubDomain(id), {
    onSuccess: () => {
      router.push("/subdomains");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!subdomain || !subdomain["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: subdomain["@id"] });
  };

  return (
    <div>
      <h1>
        {subdomain ? `Edit SubDomain ${subdomain["@id"]}` : `Create SubDomain`}
      </h1>
      <Formik
        initialValues={
          subdomain
            ? {
                ...subdomain,
              }
            : new SubDomain()
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
                router.push("/api/sub_domains");
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
              <label className="form-control-label" htmlFor="subdomain_title">
                title
              </label>
              <input
                name="title"
                id="subdomain_title"
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
              <label className="form-control-label" htmlFor="subdomain_domain">
                domain
              </label>
              <input
                name="domain"
                id="subdomain_domain"
                value={values.domain ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.domain && touched.domain ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.domain && touched.domain ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="domain"
              />
            </div>
            <div className="form-group">
              <div className="form-control-label">missionSubdomain</div>
              <FieldArray
                name="missionSubdomain"
                render={(arrayHelpers) => (
                  <div id="subdomain_missionSubdomain">
                    {values.missionSubdomain &&
                    values.missionSubdomain.length > 0 ? (
                      values.missionSubdomain.map(
                        (item: any, index: number) => (
                          <div key={index}>
                            <Field name={`missionSubdomain.${index}`} />
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
                        )
                      )
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
      <Link href="/subdomains">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {subdomain && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
