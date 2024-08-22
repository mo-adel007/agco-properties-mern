import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  position: Yup.string().required("Position is required"),
  cv: Yup.mixed()
    .required("CV is required")
    .test(
      "fileType",
      "Only PDF files are allowed",
      (value) => value && value.type === "application/pdf"
    ),
});

const JobApplicationForm = () => {
  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setFieldValue }
  ) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("position", values.position);
    formData.append("cv", values.cv);

    try {
      const response = await fetch(
        values.office === "dubai"
          ? "http://localhost:3000/api/email/send-application/dubai"
          : "http://localhost:3000/api/email/send-application/cairo",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        toast.success("Application sent successfully!");
        resetForm();
      } else {
        toast.error("Failed to send application. Please try again later.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      toast.error("Failed to send application. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center mt-24">
            <ToastContainer />

      {/* Dubai Office */}
      <div className="w-full max-w-lg mx-4 p-8 bg-gray-200 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Dubai Office</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            position: "",
            cv: null,
            office: "dubai",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-600">*</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-600">*</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-600">*</span>
                </label>
                <Field
                  type="tel"
                  name="phone"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Phone"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Position <span className="text-red-600">*</span>
                </label>
                <Field
                  as="select"
                  name="position"
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="">Select Position</option>
                  <option value="Property Consultant">
                    Property Consultant
                  </option>
                  <option value="Office Manager">Office Manager</option>
                </Field>
                <ErrorMessage
                  name="position"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Your Updated CV | PDF Only{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={(event) =>
                    setFieldValue("cv", event.currentTarget.files[0])
                  }
                  className="mt-1 p-2 w-full border rounded"
                />
                <ErrorMessage
                  name="cv"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white font-semibold p-3 rounded flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ClipLoader color={"#ffffff"} size={20} />
                ) : (
                  "SEND"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Cairo Office */}
      <div className="w-full max-w-lg mx-4 p-8 bg-gray-100 rounded-lg shadow-md">
      <ToastContainer />

        <h2 className="text-2xl font-semibold mb-6">Cairo Office</h2>
        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            position: "",
            cv: null,
            office: "cairo",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue,isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-600">*</span>
                </label>
                <Field
                  type="text"
                  name="name"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Name"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-600">*</span>
                </label>
                <Field
                  type="email"
                  name="email"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-600">*</span>
                </label>
                <Field
                  type="tel"
                  name="phone"
                  className="mt-1 p-2 w-full border rounded"
                  placeholder="Phone"
                />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Position <span className="text-red-600">*</span>
                </label>
                <Field
                  as="select"
                  name="position"
                  className="mt-1 p-2 w-full border rounded"
                >
                  <option value="">Select Position</option>
                  <option value="Property Consultant">
                    Property Consultant
                  </option>
                  <option value="Office Manager">Office Manager</option>
                </Field>
                <ErrorMessage
                  name="position"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Upload Your Updated CV | PDF Only{" "}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  name="cv"
                  accept="application/pdf"
                  onChange={(event) =>
                    setFieldValue("cv", event.currentTarget.files[0])
                  }
                  className="mt-1 p-2 w-full border rounded"
                />
                <ErrorMessage
                  name="cv"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 text-white font-semibold p-3 rounded flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ClipLoader color={"#ffffff"} size={20} />
                ) : (
                  "SEND"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default JobApplicationForm;
