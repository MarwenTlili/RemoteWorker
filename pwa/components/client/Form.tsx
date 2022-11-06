import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Client } from "../../types/Client";

interface Props {
  client?: Client;
}

interface SaveParams {
  values: Client;
}

interface DeleteParams {
  id: string;
}

const saveClient = async ({ values }: SaveParams) =>
  await fetch<Client>(!values["@id"] ? "/api/clients" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteClient = async (id: string) =>
  await fetch<Client>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ client }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Client> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveClient(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Client> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteClient(id), {
    onSuccess: () => {
      router.push("/clients");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!client || !client["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: client["@id"] });
  };

  return (
    <div>
      <h1>{client ? `Edit Client ${client["@id"]}` : `Create Client`}</h1>
      <Formik
        initialValues={
          client
            ? {
                ...client,
              }
            : new Client()
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
                router.push("/api/clients");
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
              <label className="form-control-label" htmlFor="client_name">
                name
              </label>
              <input
                name="name"
                id="client_name"
                value={values.name ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.name && touched.name ? " is-invalid" : ""
                }`}
                aria-invalid={errors.name && touched.name ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="name"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="client_address">
                address
              </label>
              <input
                name="address"
                id="client_address"
                value={values.address ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.address && touched.address ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.address && touched.address ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="address"
              />
            </div>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="client_presentation"
              >
                presentation
              </label>
              <input
                name="presentation"
                id="client_presentation"
                value={values.presentation ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.presentation && touched.presentation
                    ? " is-invalid"
                    : ""
                }`}
                aria-invalid={
                  errors.presentation && touched.presentation
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="presentation"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="client_country">
                country
              </label>
              <input
                name="country"
                id="client_country"
                value={values.country ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.country && touched.country ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.country && touched.country ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="country"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="client_city">
                city
              </label>
              <input
                name="city"
                id="client_city"
                value={values.city ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.city && touched.city ? " is-invalid" : ""
                }`}
                aria-invalid={errors.city && touched.city ? "true" : undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="city"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="client_phone">
                phone
              </label>
              <input
                name="phone"
                id="client_phone"
                value={values.phone ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.phone && touched.phone ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.phone && touched.phone ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="phone"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="client_userRef">
                userRef
              </label>
              <input
                name="userRef"
                id="client_userRef"
                value={values.userRef ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.userRef && touched.userRef ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.userRef && touched.userRef ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="userRef"
              />
            </div>
            <div className="form-group">
              <div className="form-control-label">missions</div>
              <FieldArray
                name="missions"
                render={(arrayHelpers) => (
                  <div id="client_missions">
                    {values.missions && values.missions.length > 0 ? (
                      values.missions.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`missions.${index}`} />
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
      <Link href="/clients">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {client && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
