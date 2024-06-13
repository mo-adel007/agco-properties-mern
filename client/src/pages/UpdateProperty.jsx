import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../firbease";
import { useEffect } from "react";
const developers = [
  "Emmar", "Damac", "Sobha Realty", "Nakheel", "Nshama", "Meraas", "Dubai Properties", 
  "Tilal Al Ghaf", "Ellington", "Samana", "Aldar", "Masaar"
];
export default function ListProperty() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    developers: "",
    community: "",
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "commercial",
    status: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(
        `http://localhost:3000/api/listing/get/${listingId}`,
        { credentials: 'include' }
      );
      
      const data = await res.json();
      if (data.success === false) {
        console.log(data.error);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

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
          setImageUploadError("Image upload failed (2 mb max per image)");
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
    } else if (id === "parking" || id === "furnished" || id === "offer" || id === "featured") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    } else if (type === "number" || type === "text" || type === "textarea") {
      setFormData({
        ...formData,
        [id]: value,
      });
    }

    if (id === "buy" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        status: "buy",
      }));
    } else if (id === "rent" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        status: "rent",
      }));
    }

    if (id === "commercial" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        type: "commercial",
      }));
    } else if (id === "residential" && checked) {
      setFormData((prevData) => ({
        ...prevData,
        type: "residential",
      }));
    }
    else if (id === "published") {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`http://localhost:3000/api/listing/update/${params.listingId}`, {
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
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 mt-20">
        Update Property
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
              <option key={dev} value={dev}>{dev}</option>
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
            {/* Assuming you have a similar array of community names */}
            {developers.map((com) => (
              <option key={com} value={com}>{com}</option>
            ))}
          </select>
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
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
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
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Price</p>
                {formData.status === "rent" && (
                  <span className="text-xs">(AED / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>

                  {formData.status === "rent" && (
                    <span className="text-xs">(AED / month)</span>
                  )}
                </div>
              </div>
            )}
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
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update Property"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
