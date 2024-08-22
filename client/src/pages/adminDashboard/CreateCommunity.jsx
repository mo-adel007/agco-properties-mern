import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../firbease";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader"; // Add react-spinners for loading spinner
import { AiOutlineLeft } from "react-icons/ai";

const developers = [
  "emmar",
  "damac",
  "sobah-reality",
  "nakheel",
  "nshama",
  "meraas",
  "dubai-properties",
  "tilal-al-ghaf",
  "ellington",
  "samana",
  "aldar",
  "masaar",
];

const validationSchema = Yup.object({
  name: Yup.string()
    .min(5, "Name must be at least 5 characters")
    .max(62, "Name can't be more than 62 characters")
    .required("Name is required"),
  description: Yup.string().required("Description is required"),
  address: Yup.string().required("Address is required"),
  developer: Yup.string().required("Developer is required"),
  imageUrls: Yup.array().min(1, "At least one image is required"),
});

export default function CreateCommunity() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleImageSubmit = async (values, setFieldValue) => {
    if (files.length > 0 && files.length + values.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFieldValue("imageUrls", values.imageUrls.concat(urls));
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError(
            "Image upload failed (2 MB Min & 7MB Max per image)"
          );
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 10 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      setSubmitting(true);
      const res = await fetch("http://localhost:3000/api/community/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentUser.token}`,
        },
        credentials: "include",
        body: JSON.stringify({
          ...values,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setSubmitting(false);

      if (data.success == false) {
        toast.error("Failed to create community. Please try again later.");
      } else {
        toast.success("Community created successfully!");
        setTimeout(() => navigate(`/profile`), 2000); // Delay navigating by 2 seconds
      }
    } catch (error) {
      toast.error("Failed to create community. Please try again later.");
      setSubmitting(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto bg-slate-200">
    <ToastContainer />
    <h1 className="text-3xl font-bold text-center my-7 mt-20">
      Create a Community
    </h1>
    <Link
        to={"/profile"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to Profile
      </Link>
    <Formik
      initialValues={{
        developer: "",
        name: "",
        description: "",
        address: "",
        imageUrls: [],
        featured: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <label htmlFor="name">Name:</label>
            <Field
              type="text"
              placeholder="Name"
              className="border p-3 rounded-lg"
              id="name"
              name="name"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-600 text-sm"
            />
            <label htmlFor="description">Description:</label>
            <Field
              as="textarea"
              placeholder="Description"
              className="border p-3 rounded-lg"
              id="description"
              name="description"
            />
            <ErrorMessage
              name="description"
              component="div"
              className="text-red-600 text-sm"
            />
            <label htmlFor="address">Address:</label>
            <Field
              type="text"
              placeholder="Address"
              className="border p-3 rounded-lg"
              id="address"
              name="address"
            />
            <ErrorMessage
              name="address"
              component="div"
              className="text-red-600 text-sm"
            />
            <label htmlFor="developer">Developer:</label>
            <Field
              as="select"
              id="developer"
              name="developer"
              className="border p-3 rounded-lg"
            >
              <option value="">Select a developer</option>
              {developers.map((dev) => (
                <option key={dev} value={dev}>
                  {dev}
                </option>
              ))}
            </Field>
            <ErrorMessage
              name="developer"
              component="div"
              className="text-red-600 text-sm"
            />
            <div className="flex gap-2">
              <Field
                type="checkbox"
                id="featured"
                name="featured"
                className="w-5"
              />
              <span>Featured</span>
            </div>
          </div>

          <div className="flex flex-col flex-1 gap-4">
            <p className="font-semibold">
              Images:
              <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 10)
              </span>
            </p>
            <div className="flex gap-4">
              <input
                onChange={(e) => setFiles(e.target.files)}
                className="p-3 border border-gray-300 rounded w-full"
                type="file"
                id="images"
                accept="image/*"
                multiple
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => handleImageSubmit(values, setFieldValue)}
                className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <p className="text-red-700 text-sm">
              {imageUploadError && imageUploadError}
            </p>
              {values.imageUrls.length > 0 &&
                values.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between p-2 items-center border rounded"
                  >
                    <img
                      src={url}
                      alt={`uploaded image ${index}`}
                      className="h-20 w-20 object-cover mr-2"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue(
                          "imageUrls",
                          values.imageUrls.filter((_, i) => i !== index)
                        )
                      }
                      className="text-red-700 p-1 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              <button
                disabled={isSubmitting}
                type="submit"
                className="p-3 text-white bg-green-700 rounded uppercase hover:shadow-lg mt-2 disabled:opacity-80"
              >
                {isSubmitting ? (
                  <ClipLoader color="#ffffff" size={20} />
                ) : (
                  "Create Community"
                )}
              </button>
              <ErrorMessage
                name="imageUrls"
                component="div"
                className="text-red-600 text-sm mt-2"
              />
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
