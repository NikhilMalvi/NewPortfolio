import React, { useRef, useState } from "react";
import "./Media.css";
import { IoCloudUploadOutline, IoClose } from "react-icons/io5";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

/**
 * Media Component - WordPress-style popup modal
 * A reusable component for uploading images to the gallery from any admin page.
 *
 * Usage:
 * const [showMedia, setShowMedia] = useState(false);
 * <button onClick={() => setShowMedia(true)}>Upload Image</button>
 * <Media isOpen={showMedia} onClose={() => setShowMedia(false)} onUploadSuccess={(item) => console.log("Uploaded:", item)} />
 */
const Media = ({ isOpen, onClose, onUploadSuccess, accept = "image/*" }) => {
  const { axios } = useAppContext();
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sizeText, setSizeText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  // Tabs
  const [activeTab, setActiveTab] = useState("gallery"); // "gallery" or "upload"
  const [gallery, setGallery] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("general");

  // Extract filename without extension
  const getFileNameWithoutExt = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      setGalleryLoading(true);
      const { data } = await axios.get("/api/gallery/all");
      if (data.success) {
        setGallery(data.galleryData || data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch gallery");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setGalleryLoading(false);
    }
  };

  // Fetch gallery when gallery tab is active
  React.useEffect(() => {
    if (isOpen && activeTab === "gallery") {
      fetchGallery();
    }
  }, [isOpen, activeTab]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Auto-fill title from filename
    const fileName = getFileNameWithoutExt(file.name);
    setTitle(fileName);

    // Preview only for images
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setWidth(img.naturalWidth.toString());
        setHeight(img.naturalHeight.toString());
      };
    } else {
      setPreview(null);
      setWidth("");
      setHeight("");
    }

    setSizeText((file.size / 1024).toFixed(1) + " KB");
  };

  const resetForm = () => {
    setPreview(null);
    setTitle("");
    setAltText("");
    setCategory("general");
    setSizeText("");
    setWidth("");
    setHeight("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleClose = () => {
    resetForm();
    setActiveTab("gallery");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title required");
    if (!altText.trim()) return toast.error("ALT text required");
    if (!fileRef.current?.files?.[0])
      return toast.error("Please select a file");

    const form = new FormData();
    form.append("title", title);
    form.append("altText", altText);
    form.append("category", category);
    form.append("size", sizeText);
    form.append("width", width);
    form.append("height", height);
    form.append("file", fileRef.current.files[0]);

    try {
      setLoading(true);
      const res = await axios.post("/api/gallery/add", form);

      if (res.data?.success) {
        toast.success("Image uploaded to gallery");

        // Callback to parent component with uploaded item
        if (onUploadSuccess) {
          onUploadSuccess(res.data.data || res.data.item);
        }

        handleClose();
      } else {
        toast.error(res.data?.message || "Failed to upload");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="mediaBackdrop" onClick={handleClose}></div>

      {/* Modal */}
      <div className="mediaModal">
        <div className="mediaModalHeader">
          <h2>Media Library</h2>
          <button type="button" className="mediaCloseBtn" onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="mediaTabs">
          <button
            className={`mediaTabBtn ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
          </button>
          <button
            className={`mediaTabBtn ${activeTab === "upload" ? "active" : ""}`}
            onClick={() => setActiveTab("upload")}
          >
            Upload
          </button>
        </div>

        {/* Gallery Tab */}
        {activeTab === "gallery" && (
          <div className="mediaTabContent">
            {galleryLoading ? (
              <div className="mediaLoading">Loading gallery...</div>
            ) : gallery.length === 0 ? (
              <div className="mediaEmpty">No images in gallery</div>
            ) : (
              <div className="mediaGalleryGrid">
                {gallery.map((item) => {
                  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
                  const id = item._id || item.id;
                  const src = item.imageUrl;

                  return (
                    <div className="mediaGalleryItem" key={id}>
                      {src ? (
                        <img src={src} alt={item.altText || item.title} />
                      ) : (
                        <div className="mediaGalleryPlaceholder">No image</div>
                      )}
                      <div className="mediaGalleryInfo">
                        <h4>{item.title}</h4>
                        <p>{item.altText}</p>
                        <button
                          type="button"
                          className="mediaSelectBtn"
                          onClick={() => {
                            if (onUploadSuccess) {
                              onUploadSuccess(item);
                            }
                            handleClose();
                          }}
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === "upload" && (
          <form className="mediaForm" onSubmit={handleSubmit}>
            <div className="mediaTabContent">
              {/* Title */}
              <label className="mediaLabel">
                <span>Title</span>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mediaInput"
                  placeholder="Image title"
                  required
                />
              </label>

              {/* Alt Text */}
              <label className="mediaLabel">
                <span>ALT Text</span>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="mediaInput"
                  placeholder="Description for accessibility"
                  required
                />
              </label>

              {/* Category */}
              <label className="mediaLabel">
                <span>Category</span>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mediaInput"
                  placeholder="e.g., general, projects, portfolio"
                />
              </label>

              {/* File Upload */}
              <label className="mediaLabel">
                <span>Upload Image</span>
                <div
                  className="mediaUploadBox"
                  onClick={() => fileRef.current?.click()}
                >
                  {preview ? (
                    <img src={preview} alt="preview" className="mediaPreview" />
                  ) : (
                    <div className="mediaUploadPlaceholder">
                      <IoCloudUploadOutline size={40} />
                      <p>Click to upload</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept={accept}
                  onChange={handleFile}
                />
              </label>

              {/* Meta Info */}
              {(sizeText || width || height) && (
                <div className="mediaMeta">
                  {sizeText && <span>Size: {sizeText}</span>}
                  {width && height && (
                    <span>
                      Dimensions: {width} × {height}
                    </span>
                  )}
                </div>
              )}

              {/* Submit & Reset */}
              <div className="mediaActions">
                <button
                  type="submit"
                  className="mediaSubmitBtn"
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload to Gallery"}
                </button>
                <button
                  type="button"
                  className="mediaResetBtn"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Media;
