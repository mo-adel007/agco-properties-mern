import React from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {ToastContainer,toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
const Modal = ({ title, closeModal, formFields }) => {
  // Define validation schema using Yup
  const validationSchema = Yup.object(
    formFields.reduce(
      (acc, field) => {
        if (field.toLowerCase().includes("email")) {
          // If the field name includes 'email', validate it as an email
          acc[field] = Yup.string()
            .email("Invalid email address")
            .required(`${field} is required`);
        } else {
          acc[field] = Yup.string().required(`${field} is required`);
        }
        return acc;
      },
      {
        inquiryType: Yup.string().required("Inquiry Type is required"),
        role: Yup.string().required("Role is required"),
      }
    )
  );

  return (
    <div className="fade-in-bottom fixed inset-0 flex justify-center items-center z-50 bg-black bg-opacity-50">
      <ToastContainer />
      <div className="bg-white rounded-lg w-full max-w-4xl p-8">
        <div className="flex flex-col md:flex-row">
          <div className="bg-red-600 text-white p-6 md:w-1/3 flex flex-col justify-center">
            <h2 className="text-3xl font-bold">AGCO PROPERTIES</h2>
            <div className="mt-4">
              <p className="text-lg">
                Office# 1707, Damac Smart Heights, Barsha Heights Dubai, AE
              </p>
              <a
                href="https://www.google.com/maps/place/AGCO+PROPERTIES/@25.0966277,55.1766511,15z/data=!4m6!3m5!1s0x3e5f6908ead6b1e3:0x3b6c40a53c2ed6db!8m2!3d25.0966277!4d55.1766511!16s%2Fg%2F11r4c2360m?entry=ttu"
                className="text-white underline mt-2 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Us
              </a>
            </div>
            <div className="mt-4">
              <p className="text-lg">Contact us at: hr@agcoproperties.com</p>
            </div>
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button
                onClick={closeModal}
                className="text-gray-700 hover:text-gray-900 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <Formik
              initialValues={formFields.reduce(
                (acc, field) => {
                  acc[field] = "";
                  return acc;
                },
                {
                  inquiryType: "",
                  role: "",
                }
              )}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                // Format the form data to match the server's expected structure
                const formattedFields = formFields.map((field) => ({
                  label: field,
                  value: values[field],
                }));

                const requestBody = {
                  inquiryType: values.inquiryType,
                  role: values.role,
                  fields: formattedFields,
                };

                try {
                  const response = await fetch(
                    "http://localhost:3000/api/email/contact-us",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(requestBody),
                    }
                  );

                  if (response.ok) {
                    toast.success("Message sent successfully!");
                    setTimeout(closeModal, 2000);  // Delay closing the modal by 2 seconds
                  } else {
                    toast.error(
                      "Failed to send message. Please try again later."
                    );
                  }
                } catch (error) {
                  console.error("Error sending message:", error);
                  toast.error(
                    "Failed to send message. Please try again later."
                  );
                }
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formFields.map((field, index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                          {field}
                        </label>
                        <Field
                          type="text"
                          name={field}
                          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
                        />
                        {errors[field] && touched[field] ? (
                          <div className="text-red-600 text-sm">
                            {errors[field]}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Inquiry Type
                      </label>
                      <Field
                        as="select"
                        name="inquiryType"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Select Inquiry Type</option>
                        <option value="Purchase">Purchase</option>
                        <option value="Rent">Rent</option>
                        <option value="Sell">Sell</option>
                        <option value="Miss">Miss</option>
                        <option value="Evaluation">Evaluation</option>
                      </Field>
                      {errors.inquiryType && touched.inquiryType ? (
                        <div className="text-red-600 text-sm">
                          {errors.inquiryType}
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        I’m a
                      </label>
                      <Field
                        as="select"
                        name="role"
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:shadow-outline"
                      >
                        <option value="">Role</option>
                        <option value="I'm a property owner">
                          I'm a property owner
                        </option>
                        <option value="">I'm a real estate agent</option>
                      </Field>
                      {errors.role && touched.role ? (
                        <div className="text-red-600 text-sm">
                          {errors.role}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-black text-white rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ClipLoader color={"#ffffff"} size={20} />
                    ) : (
                      "Submit"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
