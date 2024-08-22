import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { app } from "../../firbease";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
const validationSchema = Yup.object({
  name: Yup.string()
    .min(5, "Name must be at least 5 characters")
    .max(62, "Name can't be longer than 62 characters")
    .required("Name is required"),
  description: Yup.string().required("Description is required"),
  address: Yup.string().required("Address is required"),
  developer: Yup.string().required("Developer is required"),
  community: Yup.string().required("Community is required"),
  project: Yup.string().required("Project is required"),
  category: Yup.string().required("Category is required"),
  bedrooms: Yup.number()
    .min(1, "At least 1 bedroom is required")
    .max(10, "No more than 10 bedrooms allowed")
    .required("Number of bedrooms is required"),
  bathrooms: Yup.number()
    .min(1, "At least 1 bathroom is required")
    .max(10, "No more than 10 bathrooms allowed")
    .required("Number of bathrooms is required"),
  size: Yup.number()
    .min(30, "Minimum size is 30 sq ft")
    .max(5000, "Maximum size is 5000 sq ft")
    .required("Size is required"),
  regularPrice: Yup.number()
    .min(50, "Minimum price is AED 50")
    .max(10000000, "Maximum price is AED 10,000,000")
    .required("Regular price is required"),
});

export default function ListProperty() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    developer: "",
    community: "",
    project: "",
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "commercial",
    status: "rent",
    category: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    parking: false,
    furnished: false,
    isPublished: false,
    featured: false,
    size: 30,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const fetchCommunities = async (developer) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/community/communities/developer/${developer}`
      );
      const data = await res.json();
      setCommunities(data);
    } catch (error) {
      setError("Failed to fetch communities");
    }
  };
  useEffect(() => {
    const fetchProjectsByCommunity = async () => {
      try {
        let response;
        if (selectedCommunity) {
          response = await fetch(
            `http://localhost:3000/api/project/projects/community/${selectedCommunity}`
          );

          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.statusText}`
            );
          }

          const data = await response.json();
          setProjects(data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects by community:", error);
        setError("Failed to fetch projects");
      }
    };

    fetchProjectsByCommunity();
  }, [selectedCommunity]);
  useEffect(() => {
    if (formData.developer) {
      fetchCommunities(formData.developer);
    } else {
      setCommunities([]);
    }
  }, [formData.developer]);

  const handleImageSubmit = (e, setFieldValue) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          const updatedImageUrls = formData.imageUrls.concat(urls);
          setFormData({
            ...formData,
            imageUrls: updatedImageUrls,
          });
          // Update the Formik state for imageUrls
          setFieldValue("imageUrls", updatedImageUrls);
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

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (id === "community") {
      setSelectedCommunity(value);
    }
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [id]: value,
      });
    }
    if (id === "buy" && checked) {
      setFormData({
        ...formData,
        status: "buy",
      });
    } else if (id === "rent" && checked) {
      setFormData({
        ...formData,
        status: "rent",
      });
    } else if (id === "commercial" && checked) {
      setFormData({
        ...formData,
        type: "commercial",
      });
    } else if (id === "residential" && checked) {
      setFormData({
        ...formData,
        type: "residential",
      });
    } else if (id === "parking" || id === "furnished" || id === "featured") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else if (type === "number" || type === "text" || type === "textarea") {
      setFormData({
        ...formData,
        [id]: value,
      });
    } else if (id === "published") {
      setFormData({
        ...formData,
        isPublished: true,
      });
    } else if (id === "unpublished") {
      setFormData({
        ...formData,
        isPublished: false,
      });
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (values.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+values.regularPrice < +values.discountPrice)
        return setError("Discount price must be lower than regular price");

      console.log("Form Data being sent:", values); // Log formData for debugging

      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:3000/api/listing/create", {
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
      console.log("Response from server:", data); // Log server response for debugging
      setLoading(false);
      if (data.success === false) {
        toast.error("There was a problem while creating a listing");
        setError(data.message);
      } else {
        toast.success("Listing created successfully!");
        setTimeout(() => navigate(`/profile`), 2000);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto bg-slate-200">
      <h1 className="text-3xl font-semibold text-center my-7 mt-24">
        Create a Property
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
          community: "",
          project: "",
          imageUrls: [],
          name: "",
          description: "",
          address: "",
          type: "commercial",
          status: "rent",
          category: "",
          bedrooms: 1,
          bathrooms: 1,
          regularPrice: 50,
          parking: false,
          furnished: false,
          isPublished: false,
          featured: false,
          size: 30,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form className="flex flex-col sm:flex-col gap-4">
            <div className="flex flex-col gap-4 flex-1">
              <label htmlFor="name">Name:</label>

              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="border p-3 rounded-lg"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-700 text-sm"
              />
              <label htmlFor="description">Description:</label>

              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                className="border p-3 rounded-lg"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-700 text-sm"
              />
              <label htmlFor="address">Address:</label>

              <Field
                type="text"
                name="address"
                placeholder="Address"
                className="border p-3 rounded-lg"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-700 text-sm"
              />
              <label htmlFor="developer">Developer:</label>

              <Field
                as="select"
                name="developer"
                onChange={(e) => {
                  setFieldValue("developer", e.target.value);
                  fetchCommunities(e.target.value);
                }}
                className="border p-3 rounded-lg"
              >
                <option value="" disabled>
                  Select Developer
                </option>
                {developers.map((dev) => (
                  <option key={dev} value={dev}>
                    {dev}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="developer"
                component="div"
                className="text-red-700 text-sm"
              />
              <label htmlFor="community">Community:</label>

              <Field
                as="select"
                name="community"
                onChange={(e) => {
                  setFieldValue("community", e.target.value);
                  setSelectedCommunity(e.target.value);
                }}
                className="border p-3 rounded-lg"
              >
                <option value="" disabled>
                  Select Community
                </option>
                {communities.map((community) => (
                  <option key={community._id} value={community._id}>
                    {community.name}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="community"
                component="div"
                className="text-red-700 text-sm"
              />
              <label htmlFor="project">Project:</label>

              <Field
                as="select"
                name="project"
                className="border p-3 rounded-lg"
              >
                <option value="" disabled>
                  Select Project
                </option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </Field>

              <ErrorMessage
                name="project"
                component="div"
                className="text-red-700 text-sm"
              />

              <div>
                <Field
                  as="select"
                  name="category"
                  className="border p-3 rounded-lg"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  {(values.type === "commercial"
                    ? commercialCategories
                    : residentialCategories
                  ).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="category"
                  component="div"
                  className="text-red-700 text-sm"
                />
              </div>

              <div className="flex gap-6 flex-wrap">
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="buy"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.status === "buy"}
                  />
                  <span>Buy</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="rent"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.status === "rent"}
                  />
                  <span>Rent</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="commercial"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "commercial"}
                  />
                  <span>Commercial</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="residential"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.type === "residential"}
                  />
                  <span>Residential</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="parking"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.parking}
                  />
                  <span>Parking spot</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="furnished"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.furnished}
                  />
                  <span>Furnished</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.isPublished}
                  />
                  <span>Publish</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="unpublished"
                    className="w-5"
                    onChange={handleChange}
                    checked={!formData.isPublished}
                  />
                  <span>Unpublish</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    className="w-5"
                    onChange={handleChange}
                    checked={formData.featured}
                  />
                  <span>Featured</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Field
                    type="number"
                    name="bedrooms"
                    placeholder="Bedrooms"
                    className="border p-3 rounded-lg"
                  />
                  <ErrorMessage
                    name="bedrooms"
                    component="div"
                    className="text-red-700 text-sm"
                  />
                  <p>Beds</p>
                </div>
                <div className="flex items-center gap-2">
                  <Field
                    type="number"
                    name="bathrooms"
                    placeholder="Bathrooms"
                    className="border p-3 rounded-lg"
                  />
                  <ErrorMessage
                    name="bathrooms"
                    component="div"
                    className="text-red-700 text-sm"
                  />
                  <p>Baths</p>
                </div>
                <div className="flex items-center gap-2">
                  <Field
                    type="number"
                    name="size"
                    placeholder="Size in Sq Ft"
                    className="border p-3 rounded-lg"
                  />
                  <ErrorMessage
                    name="size"
                    component="div"
                    className="text-red-700 text-sm"
                  />
                  <p>Sq Ft</p>
                </div>
                <div className="flex items-center gap-2">
                  <Field
                    type="number"
                    name="regularPrice"
                    placeholder="Regular Price"
                    className="border p-3 rounded-lg"
                  />
                  <ErrorMessage
                    name="regularPrice"
                    component="div"
                    className="text-red-700 text-sm"
                  />

                  <div className="flex flex-col items-center">
                    <p>Price</p>
                    {formData.status === "rent" && (
                      <span className="text-xs">(AED / Year)</span>
                    )}
                  </div>
                </div>
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
                  className="p-2 bg-blue-500 text-white rounded-lg mt-2"
                  onClick={handleImageSubmit}
                  disabled={uploading}
                >
                  {uploading ? (
                    <ClipLoader size={20} color="#ffffff" />
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
              <p className="text-red-700 text-sm">
                {imageUploadError && imageUploadError}
              </p>
              {formData.imageUrls.length > 0 &&
                formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className="flex justify-between p-3 border items-center"
                  >
                    <img
                      src={url}
                      alt="listing image"
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              <button
                type="submit"
                className="bg-green-500 text-white p-3 rounded-lg"
                disabled={isSubmitting || loading}
              >
                {loading ? (
                  <ClipLoader color="#36d7b7" size={20} />
                ) : (
                  "Create Listing"
                )}
              </button>
              {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
          </Form>
        )}
      </Formik>
    </main>
  );
}
