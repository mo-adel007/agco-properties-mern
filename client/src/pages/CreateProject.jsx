import { useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { app } from "../firbease";

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


export default function CreateProject() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    developer: "",
    community: "",
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "commercial",
    featured: false,
    status: "",
    deliveryDate:"",
    typeOfUnit: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [communities, setCommunities] = useState([]);
  const [projectStatus, setProjectStatus] = useState("");
  const [selectedUnitType, setSelectedUnitType] = useState("");
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
    if (formData.developer) {
      fetchCommunities(formData.developer);
    } else {
      setCommunities([]);
    }
  }, [formData.developer]);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 10) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
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
    if (id === "developer") {
      setFormData({
        ...formData,
        developer: value,
      });
      fetchCommunities(value);
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
    } else if (id === "featured") {
      setFormData({
        ...formData,
        featured: checked,
      });
    }
  };
  const handleUnitTypeChange = (e) => {
    setSelectedUnitType(e.target.value);
  };

  const handleAddUnitType = () => {
    if (selectedUnitType && !formData.typeOfUnit.includes(selectedUnitType)) {
      setFormData({
        ...formData,
        typeOfUnit: [...formData.typeOfUnit, selectedUnitType],
      });
      setSelectedUnitType("");
    }
  };

  const handleRemoveUnitType = (index) => {
    setFormData({
      ...formData,
      typeOfUnit: formData.typeOfUnit.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1) return setError("You must upload at least one image");
      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:3000/api/project/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      } else {
        navigate(`/profile`);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 mt-20">
        Create a Project
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <label htmlFor="developer">Developer:</label>
          <select
            id="developer"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.developer}
          >
            <option value="">Select a developer</option>
            {developers.map((dev) => (
              <option key={dev} value={dev}>
                {dev}
              </option>
            ))}
          </select>

          {/* Community Dropdown */}
          <label htmlFor="community">Community:</label>
          <select
            id="community"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.community}
          >
            <option value="">Select a community</option>
            {communities.map((community) => (
              <option key={community._id} value={community._id}>
                {community.name}
              </option>
            ))}
          </select>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            className="border p-3 rounded-lg"
            required
            onChange={handleChange}
            value={formData.status}
          >
            <option value="">Select a state</option>
            {status.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <option value="">Delivery Date</option>

          <input
            type="date"
            placeholder="Delivery Date"
            className="border p-3 rounded-lg"
            id="deliveryDate"
            required
            onChange={handleChange}
            value={formData.deliveryDate}
          />
            <label htmlFor="unitType">Unit Type:</label>
          <select
            id="unitType"
            className="border p-3 rounded-lg"
            onChange={handleUnitTypeChange}
            value={selectedUnitType}
          >
            <option value="">Select a unit type</option>
            {(formData.type === "commercial" ? commercialCategories : residentialCategories).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="p-2 bg-blue-500 text-white rounded mt-2"
            onClick={handleAddUnitType}
          >
            Add Unit Type
          </button>

          {/* Display Selected Unit Types */}
          {formData.typeOfUnit.length > 0 && (
            <div className="mt-4">
              {formData.typeOfUnit.map((type, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 border rounded mt-2"
                >
                  <span>{type}</span>
                  <button
                    type="button"
                    className="text-red-700"
                    onClick={() => handleRemoveUnitType(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-6 flex-wrap">
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
                id="featured"
                className="w-5"
                onChange={handleChange}
                checked={formData.featured}
              />
              <span>Featured</span>
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
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
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
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 p-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          <button
            disabled={loading}
            type="submit"
            className="p-3 text-white bg-green-700 rounded uppercase hover:shadow-lg mt-2 disabled:opacity-80"
          >
            {loading ? "Submitting..." : "Create Project"}
          </button>
          {error && <p className="text-center text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
