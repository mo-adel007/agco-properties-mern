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
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClipLoader from "react-spinners/ClipLoader";

import "react-toastify/dist/ReactToastify.css";
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
const status = ["ready", "off plan"];

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
    .min(5, 'Must be at least 5 characters')
    .max(62, 'Must be 62 characters or less')
    .required('Project Name is required'),
  description: Yup.string().required('Project Description is required'),
  address: Yup.string()
    .min(5, 'Must be at least 5 characters')
    .max(62, 'Must be 62 characters or less')
    .required('Address is required'),
  latitude: Yup.string().required('Latitude is required'),
  longitude: Yup.string().required('Longitude is required'),
  developer: Yup.string().required('Developer is required'),
  community: Yup.string().required('Community is required'),
  status: Yup.string().required('Status is required'),
  deliveryDate: Yup.date().required('Delivery Date is required'),
});

export default function CreateProject() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      address: "",
      latitude: "",
      longitude: "",
      developer: "",
      community: "",
      status: "",
      deliveryDate: "",
      type: "commercial",
      typeOfUnit: [],
      featured: false,
      imageUrls: []
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (values.imageUrls.length < 1) return toast.error("You must upload at least one image");
      setLoading(true);
      try {
        const res = await fetch("http://localhost:3000/api/project/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`
          },
          credentials: "include",
          body: JSON.stringify({
            ...values,
            userRef: currentUser._id,
          }),
        });
        const data = await res.json();
        setLoading(false);
        if (!data.success) {
          toast.error("Failed to create project. Please try again later.");
        } else {
          toast.success("Project created successfully!");
          setTimeout(() => navigate(`/profile`), 2000);
        }
      } catch (error) {
        toast.error("Failed to create project. Please try again later.");
        setLoading(false);
      }
    }
  });

  const fetchCommunities = async (developer) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/community/communities/developer/${developer}`
      );
      const data = await res.json();
      formik.setFieldValue("community", ""); // Reset the community field
      formik.setFieldValue("communities", data);
    } catch (error) {
      toast.error("Failed to fetch communities");
    }
  };

  useEffect(() => {
    if (formik.values.developer) {
      fetchCommunities(formik.values.developer);
    }
  }, [formik.values.developer]);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formik.values.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError("");
      const promises = files.map((file) => storeImage(file));
      Promise.all(promises)
        .then((urls) => {
          formik.setFieldValue("imageUrls", formik.values.imageUrls.concat(urls));
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 MB Min & 7MB Max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 10 images per listing");
      setUploading(false);
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        () => {},
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
    formik.setFieldValue("imageUrls", formik.values.imageUrls.filter((_, i) => i !== index));
  };

  const handleUnitTypeChange = (e) => {
    setSelectedUnitType(e.target.value);
  };

  const handleAddUnitType = () => {
    if (selectedUnitType && !formik.values.typeOfUnit.includes(selectedUnitType)) {
      formik.setFieldValue("typeOfUnit", [...formik.values.typeOfUnit, selectedUnitType]);
      setSelectedUnitType("");
    }
  };

  const handleRemoveUnitType = (index) => {
    formik.setFieldValue("typeOfUnit", formik.values.typeOfUnit.filter((_, i) => i !== index));
  };

  return (
    <main className="p-3 max-w-4xl mx-auto container bg-slate-200 ">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center my-7 mt-20">
        Create a Project
      </h1>
      <Link
        to={"/profile"}
        className="inline-flex items-center text-blue-500 hover:text-blue-700 font-semibold"
      >
        <AiOutlineLeft className="w-6 h-6 mr-2" />
        Back to Profile
      </Link>
      <form onSubmit={formik.handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <label htmlFor="name">Project Name:</label>
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-600 text-sm">{formik.errors.name}</div>
          ) : null}

          <label htmlFor="description">Project Description:</label>
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-600 text-sm">{formik.errors.description}</div>
          ) : null}

          <label htmlFor="address">Address:</label>
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            {...formik.getFieldProps("address")}
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-600 text-sm">{formik.errors.address}</div>
          ) : null}

          <label htmlFor="latitude">Latitude:</label>
          <input
            type="text"
            placeholder="Latitude"
            className="border p-3 rounded-lg"
            id="latitude"
            {...formik.getFieldProps("latitude")}
          />
          {formik.touched.latitude && formik.errors.latitude ? (
            <div className="text-red-600 text-sm">{formik.errors.latitude}</div>
          ) : null}

          <label htmlFor="longitude">Longitude:</label>
          <input
            type="text"
            placeholder="Longitude"
            className="border p-3 rounded-lg"
            id="longitude"
            {...formik.getFieldProps("longitude")}
          />
          {formik.touched.longitude && formik.errors.longitude ? (
            <div className="text-red-600 text-sm">{formik.errors.longitude}</div>
          ) : null}

          <label htmlFor="developer">Developer:</label>
          <select
            id="developer"
            className="border p-3 rounded-lg"
            {...formik.getFieldProps("developer")}
          >
            <option value="">Select Developer</option>
            {developers.map((developer) => (
              <option key={developer} value={developer}>
                {developer}
              </option>
            ))}
          </select>
          {formik.touched.developer && formik.errors.developer ? (
            <div className="text-red-600 text-sm">{formik.errors.developer}</div>
          ) : null}

          <label htmlFor="community">Community:</label>
          <select
            id="community"
            className="border p-3 rounded-lg"
            {...formik.getFieldProps("community")}
          >
            <option value="">Select Community</option>
            {formik.values.communities &&
              formik.values.communities.map((community) => (
                <option key={community} value={community}>
                  {community}
                </option>
              ))}
          </select>
          {formik.touched.community && formik.errors.community ? (
            <div className="text-red-600 text-sm">{formik.errors.community}</div>
          ) : null}

          <label htmlFor="status">Status:</label>
          <select
            id="status"
            className="border p-3 rounded-lg"
            {...formik.getFieldProps("status")}
          >
            <option value="">Select Status</option>
            {status.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {formik.touched.status && formik.errors.status ? (
            <div className="text-red-600 text-sm">{formik.errors.status}</div>
          ) : null}

          <label htmlFor="deliveryDate">Delivery Date:</label>
          <input
            type="date"
            className="border p-3 rounded-lg"
            id="deliveryDate"
            {...formik.getFieldProps("deliveryDate")}
          />
          {formik.touched.deliveryDate && formik.errors.deliveryDate ? (
            <div className="text-red-600 text-sm">{formik.errors.deliveryDate}</div>
          ) : null}

          <label htmlFor="type">Project Type:</label>
          <select
            id="type"
            className="border p-3 rounded-lg"
            {...formik.getFieldProps("type")}
          >
            <option value="commercial">Commercial</option>
            <option value="residential">Residential</option>
          </select>
          {formik.touched.type && formik.errors.type ? (
            <div className="text-red-600 text-sm">{formik.errors.type}</div>
          ) : null}

          {/* Display Unit Types for Residential or Commercial */}
          <div className="flex flex-col gap-4 flex-1">
            {formik.values.type === "residential" && (
              <>
                <label htmlFor="typeOfUnit">Type of Unit:</label>
                <div className="flex gap-2">
                  <select
                    className="border p-3 rounded-lg"
                    id="typeOfUnit"
                    value={selectedUnitType}
                    onChange={handleUnitTypeChange}
                  >
                    <option value="">Select Unit Type</option>
                    {residentialCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleAddUnitType}
                  >
                    Add
                  </button>
                </div>
                {formik.values.typeOfUnit.length > 0 && (
                  <ul className="list-disc list-inside">
                    {formik.values.typeOfUnit.map((unit, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{unit}</span>
                        <button
                          type="button"
                          className="p-1 bg-red-500 text-white rounded-lg"
                          onClick={() => handleRemoveUnitType(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {formik.values.type === "commercial" && (
              <>
                <label htmlFor="typeOfUnit">Type of Unit:</label>
                <div className="flex gap-2">
                  <select
                    className="border p-3 rounded-lg"
                    id="typeOfUnit"
                    value={selectedUnitType}
                    onChange={handleUnitTypeChange}
                  >
                    <option value="">Select Unit Type</option>
                    {commercialCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="p-2 bg-blue-500 text-white rounded-lg"
                    onClick={handleAddUnitType}
                  >
                    Add
                  </button>
                </div>
                {formik.values.typeOfUnit.length > 0 && (
                  <ul className="list-disc list-inside">
                    {formik.values.typeOfUnit.map((unit, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center"
                      >
                        <span>{unit}</span>
                        <button
                          type="button"
                          className="p-1 bg-red-500 text-white rounded-lg"
                          onClick={() => handleRemoveUnitType(index)}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>

          <label htmlFor="imageUpload">Upload Images:</label>
          <span className="font-normal text-gray-600 ml-2">
                The first image will be the cover (max 10)
              </span>
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="border p-3 rounded-lg"
          />
          <button
            type="button"
            className="p-2 bg-blue-500 text-white rounded-lg mt-2"
            onClick={handleImageSubmit}
            disabled={uploading}
          >
            {uploading ? <ClipLoader size={20} color="#ffffff" /> : "Upload"}
          </button>
          {imageUploadError && (
            <div className="text-red-600 text-sm">{imageUploadError}</div>
          )}

          {formik.values.imageUrls.length > 0 && (
            <div>
              <h3>Uploaded Images:</h3>
              <ul className="list-disc list-inside">
                {formik.values.imageUrls.map((url, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <img src={url} alt={`Uploaded ${index}`} className="w-16 h-16 object-cover" />
                    <button
                      type="button"
                      className="p-1 bg-red-500 text-white rounded-lg"
                      onClick={() => handleRemoveImage(index)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Featured Checkbox */}
          <label className="inline-flex items-center mt-3">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              {...formik.getFieldProps("featured")}
            />
            <span className="ml-2">Featured</span>
          </label>
          <button
          type="submit"
          className="p-3 bg-green-500 text-white rounded-lg mt-5"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Create Project"}
        </button>
        </div>

       
      </form>
    </main>
  );
}

