import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function CreateProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [useFileUpload, setUseFileUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const previewSrc = useMemo(() => {
    if (useFileUpload && imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return imageUrl || "";
  }, [useFileUpload, imageUrl, imageFile]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!BACKEND_URL) {
      Swal.fire({
        icon: "error",
        title: "Missing BACKEND_URL",
        text: "VITE_BACKEND_URL is not set. Please configure your .env.",
      });
      return;
    }

    if (!name.trim()) {
      Swal.fire({ icon: "warning", title: "Name is required" });
      return;
    }

    const priceNumber = Number(price);
    if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
      Swal.fire({ icon: "warning", title: "Enter a valid price (> 0)" });
      return;
    }

    setSubmitting(true);

    try {
      let finalImageUrl = imageUrl.trim();

      if (useFileUpload) {
        if (!imageFile) {
          Swal.fire({ icon: "warning", title: "Please choose an image file" });
          setSubmitting(false);
          return;
        }

        const fd = new FormData();
        fd.append("file", imageFile);

        // Backend should return: { url: "https://..." }
        const uploadRes = await axios.post(
          `${BACKEND_URL}/api/upload`,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (!uploadRes?.data?.url) {
          throw new Error("Upload did not return a URL");
        }
        finalImageUrl = uploadRes.data.url;
      } else {
        // Quick URL sanity check
        try {
          const u = new URL(finalImageUrl);
          if (!/^https?:/.test(u.protocol)) throw new Error();
        } catch {
          Swal.fire({ icon: "warning", title: "Enter a valid Image URL" });
          setSubmitting(false);
          return;
        }
      }

      await axios.post(`${BACKEND_URL}/api/products`, {
        name: name.trim(),
        price: priceNumber,   // make sure it's a number
        image: finalImageUrl, // backend receives a proper URL
      });

      Swal.fire("Congratulations! You Have Successfully created 😊", "", "success");
      navigate("/");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "An error occurred. Please try again. 😔";
      Swal.fire({ icon: "error", title: "Oops...", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Product
      </h2>

      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Wireless Mouse"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Price</label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. 29.99"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-700 font-medium">Image Source:</span>
          <button
            type="button"
            onClick={() => setUseFileUpload(false)}
            className={`px-3 py-1 rounded-lg border ${
              !useFileUpload ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setUseFileUpload(true)}
            className={`px-3 py-1 rounded-lg border ${
              useFileUpload ? "bg-blue-600 text-white" : "bg-white"
            }`}
          >
            Upload File
          </button>
        </div>

        {!useFileUpload ? (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Image URL
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ) : (
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>
        )}

        {previewSrc ? (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Preview</p>
            <img
              src={previewSrc}
              alt="preview"
              className="w-full h-48 object-cover rounded-lg border"
              onLoad={(e) => {
                if (useFileUpload && imageFile) {
                  URL.revokeObjectURL(e.target.src);
                }
              }}
              onError={() => {
                console.warn("Image preview failed to load.");
              }}
            />
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full text-white py-2 px-4 rounded-lg transition duration-200 hover:cursor-pointer ${
            submitting
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {submitting ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}

export default CreateProducts;
