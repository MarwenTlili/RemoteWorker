import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { User } from "../../types/User";

interface Props {
  user?: User;
}

interface SaveParams {
  values: User;
}

interface DeleteParams {
  id: string;
}

const saveUser = async ({ values }: SaveParams) =>
  await fetch<User>(!values["@id"] ? "/api/users" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteUser = async (id: string) =>
  await fetch<User>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ user }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<User> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveUser(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<User> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteUser(id), {
    onSuccess: () => {
      router.push("/users");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!user || !user["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: user["@id"] });
  };

  return (
    <div>
      <h1>{user ? `Edit User ${user["@id"]}` : `Create User`}</h1>
      <Formik
        initialValues={
          user
            ? {
                ...user,
              }
            : new User()
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
                router.push("/api/users");
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
              <label className="form-control-label" htmlFor="user_email">
                email
              </label>
              <input
                name="email"
                id="user_email"
                value={values.email ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.email && touched.email ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.email && touched.email ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="email"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="user_username">
                username
              </label>
              <input
                name="username"
                id="user_username"
                value={values.username ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.username && touched.username ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.username && touched.username ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="username"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="user_roles">
                roles
              </label>
              <input
                name="roles"
                id="user_roles"
                value={values.roles ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.roles && touched.roles ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.roles && touched.roles ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="roles"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="user_password">
                password
              </label>
              <input
                name="password"
                id="user_password"
                value={values.password ?? ""}
                type="text"
                placeholder="The hashed password"
                required={true}
                className={`form-control${
                  errors.password && touched.password ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.password && touched.password ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="password"
              />
            </div>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="user_userIdentifier"
              >
                userIdentifier
              </label>
              <input
                name="userIdentifier"
                id="user_userIdentifier"
                value={values.userIdentifier ?? ""}
                type="text"
                placeholder="A visual identifier that represents this user."
                className={`form-control${
                  errors.userIdentifier && touched.userIdentifier
                    ? " is-invalid"
                    : ""
                }`}
                aria-invalid={
                  errors.userIdentifier && touched.userIdentifier
                    ? "true"
                    : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="userIdentifier"
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
      <Link href="/users">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {user && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
