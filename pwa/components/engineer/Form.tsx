import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { useMutation } from "react-query";

import { fetch, FetchError, FetchResponse } from "../../utils/dataAccess";
import { Engineer } from "../../types/Engineer";

interface Props {
  engineer?: Engineer;
}

interface SaveParams {
  values: Engineer;
}

interface DeleteParams {
  id: string;
}

const saveEngineer = async ({ values }: SaveParams) =>
  await fetch<Engineer>(!values["@id"] ? "/api/engineers" : values["@id"], {
    method: !values["@id"] ? "POST" : "PUT",
    body: JSON.stringify(values),
  });

const deleteEngineer = async (id: string) =>
  await fetch<Engineer>(id, { method: "DELETE" });

export const Form: FunctionComponent<Props> = ({ engineer }) => {
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  const saveMutation = useMutation<
    FetchResponse<Engineer> | undefined,
    Error | FetchError,
    SaveParams
  >((saveParams) => saveEngineer(saveParams));

  const deleteMutation = useMutation<
    FetchResponse<Engineer> | undefined,
    Error | FetchError,
    DeleteParams
  >(({ id }) => deleteEngineer(id), {
    onSuccess: () => {
      router.push("/engineers");
    },
    onError: (error) => {
      setError(`Error when deleting the resource: ${error}`);
      console.error(error);
    },
  });

  const handleDelete = () => {
    if (!engineer || !engineer["@id"]) return;
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    deleteMutation.mutate({ id: engineer["@id"] });
  };

  return (
    <div>
      <h1>
        {engineer ? `Edit Engineer ${engineer["@id"]}` : `Create Engineer`}
      </h1>
      <Formik
        initialValues={
          engineer
            ? {
                ...engineer,
              }
            : new Engineer()
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
                router.push("/api/engineers");
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
                htmlFor="engineer_firstName"
              >
                firstName
              </label>
              <input
                name="firstName"
                id="engineer_firstName"
                value={values.firstName ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.firstName && touched.firstName ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.firstName && touched.firstName ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="firstName"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="engineer_lastName">
                lastName
              </label>
              <input
                name="lastName"
                id="engineer_lastName"
                value={values.lastName ?? ""}
                type="text"
                placeholder=""
                required={true}
                className={`form-control${
                  errors.lastName && touched.lastName ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.lastName && touched.lastName ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="lastName"
              />
            </div>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="engineer_experience"
              >
                experience
              </label>
              <input
                name="experience"
                id="engineer_experience"
                value={values.experience ?? ""}
                type="number"
                placeholder=""
                className={`form-control${
                  errors.experience && touched.experience ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.experience && touched.experience ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="experience"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="engineer_dayRate">
                dayRate
              </label>
              <input
                name="dayRate"
                id="engineer_dayRate"
                value={values.dayRate ?? ""}
                type="number"
                placeholder=""
                className={`form-control${
                  errors.dayRate && touched.dayRate ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.dayRate && touched.dayRate ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="dayRate"
              />
            </div>
            <div className="form-group">
              <label
                className="form-control-label"
                htmlFor="engineer_presentation"
              >
                presentation
              </label>
              <input
                name="presentation"
                id="engineer_presentation"
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
              <label className="form-control-label" htmlFor="engineer_country">
                country
              </label>
              <input
                name="country"
                id="engineer_country"
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
              <label className="form-control-label" htmlFor="engineer_city">
                city
              </label>
              <input
                name="city"
                id="engineer_city"
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
              <label className="form-control-label" htmlFor="engineer_phone">
                phone
              </label>
              <input
                name="phone"
                id="engineer_phone"
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
              <label className="form-control-label" htmlFor="engineer_photo">
                photo
              </label>
              <input
                name="photo"
                id="engineer_photo"
                value={values.photo ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.photo && touched.photo ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.photo && touched.photo ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="photo"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="engineer_gender">
                gender
              </label>
              <input
                name="gender"
                id="engineer_gender"
                value={values.gender ?? ""}
                type="text"
                placeholder=""
                className={`form-control${
                  errors.gender && touched.gender ? " is-invalid" : ""
                }`}
                aria-invalid={
                  errors.gender && touched.gender ? "true" : undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                className="invalid-feedback"
                component="div"
                name="gender"
              />
            </div>
            <div className="form-group">
              <label className="form-control-label" htmlFor="engineer_userRef">
                userRef
              </label>
              <input
                name="userRef"
                id="engineer_userRef"
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
              <div className="form-control-label">studies</div>
              <FieldArray
                name="studies"
                render={(arrayHelpers) => (
                  <div id="engineer_studies">
                    {values.studies && values.studies.length > 0 ? (
                      values.studies.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`studies.${index}`} />
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
              <div className="form-control-label">certifications</div>
              <FieldArray
                name="certifications"
                render={(arrayHelpers) => (
                  <div id="engineer_certifications">
                    {values.certifications &&
                    values.certifications.length > 0 ? (
                      values.certifications.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`certifications.${index}`} />
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
              <div className="form-control-label">experiences</div>
              <FieldArray
                name="experiences"
                render={(arrayHelpers) => (
                  <div id="engineer_experiences">
                    {values.experiences && values.experiences.length > 0 ? (
                      values.experiences.map((item: any, index: number) => (
                        <div key={index}>
                          <Field name={`experiences.${index}`} />
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
                  <div id="engineer_quotes">
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
      <Link href="/engineers">
        <a className="btn btn-primary">Back to list</a>
      </Link>
      {engineer && (
        <button className="btn btn-danger" onClick={handleDelete}>
          <a>Delete</a>
        </button>
      )}
    </div>
  );
};
