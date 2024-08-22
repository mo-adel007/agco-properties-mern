import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ListingItem from "../../components/Listing/Card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
const ListYourProperty = () => {
  const [metadata, setMetadata] = useState({ title: "", description: "" });
  const [successfulListings, setSuccessfulListings] = useState([]);

  const residentialCategories = [
    "Apartment",
    "Villa",
    "Townhouse",
    "Duplex",
    "Hotel Apartment",
  ];

  const commercialCategories = [
    "Office Space",
    "Retail",
    "Warehouse",
    "Half Floor",
    "Full Floor",
    "Co-working Space",
    "Clinic",
    "Pharmacy",
  ];

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/list-your-property`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch page metadata");
        }
        const data = await response.json();
        setMetadata(data);
      } catch (error) {
        console.error("Error fetching page metadata:", error);
      }
    };

    const fetchSuccessfulListings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/listing/successful-listings`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch successful listings");
        }
        const data = await response.json();
        setSuccessfulListings(data);
      } catch (error) {
        console.error("Error fetching successful listings:", error);
      }
    };

    fetchMetadata();
    fetchSuccessfulListings();
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{12}$/, "Phone number must be 12 digits"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    propertyType: Yup.string().required("Property type is required"),
    streetAddress: Yup.string().required("Street address is required"),
    area: Yup.string().required("Area is required"),
    city: Yup.string().oneOf(["Dubai"],"City is required"),
    bedrooms: Yup.number().required("Number of bedrooms is required"),
    bathrooms: Yup.number().required("Number of bathrooms is required"),
    areaSize: Yup.number().required("Area size is required"),
    budget: Yup.number().required("Budget is required"),
    notes: Yup.string(),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/email/list-your-property",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        toast.success("Property listing submitted successfully.");
        resetForm();
      } else {
        toast.error("Failed to submit property listing.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting property listing.");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-20">
      <Helmet>
        <title>{metadata.title || "Default Title"}</title>
        <meta
          name="description"
          content={metadata.description || "Default Description"}
        />
      </Helmet>
      <ToastContainer />

      <div className="bg-white p-6 shadow-md rounded-lg max-w-4xl mx-auto">
        <Formik
          initialValues={{
            userType: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
            propertyType: "",
            zipCode: "",
            streetAddress: "",
            area: "",
            city: "",
            bedrooms: "",
            bathrooms: "",
            areaSize: "",
            budget: "",
            notes: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange,isSubmitting }) => (
            <Form className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Field
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="firstName" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="lastName" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone number"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="phoneNumber" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-600" />
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-6">Property Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Field
                    as="select"
                    name="propertyType"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <optgroup label="Residential">
                      {residentialCategories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Commercial">
                      {commercialCategories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </optgroup>
                  </Field>
                  <ErrorMessage name="propertyType" component="div" className="text-red-600" />
                </div>

                <div>
                  <Field
                    type="text"
                    name="streetAddress"
                    placeholder="Street Address"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="streetAddress" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="area"
                    placeholder="Area"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="area" component="div" className="text-red-600" />
                </div>
                <div>
                <Field
                    as="select"
                    name="city"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    disabled // Make the city field read-only
                  >
                    <option value="Dubai">Dubai</option>
                  </Field>
                  <ErrorMessage name="city" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="bedrooms"
                    placeholder="N. of bedrooms"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="bedrooms" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="bathrooms"
                    placeholder="N. of bathrooms"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="bathrooms" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="areaSize"
                    placeholder="Area Size"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="areaSize" component="div" className="text-red-600" />
                </div>
                <div>
                  <Field
                    type="text"
                    name="budget"
                    placeholder="Your budget"
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  <ErrorMessage name="budget" component="div" className="text-red-600" />
                </div>
              </div>
              <div>
                <Field
                  as="textarea"
                  name="notes"
                  placeholder="Type Any Notes Here..."
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                  rows="3"
                />
                <ErrorMessage name="notes" component="div" className="text-red-600" />
              </div>
              <div>
              <button
                    type="submit"
                    className="w-full py-2 mt-4 bg-red-600 text-white rounded-lg hover:bg-gray-800 transition duration-300 flex items-center justify-center"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ClipLoader color={"#ffffff"} size={20} />
                    ) : (
                      "Submit"
                    )}
                  </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="mb-10">
        <h2 className="text-4xl font-bold text-center mb-6">
          Successful Stories (SOLD!)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {successfulListings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListYourProperty;
