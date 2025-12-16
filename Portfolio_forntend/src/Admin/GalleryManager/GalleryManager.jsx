import React, { useEffect, useRef, useState } from "react";
import "./GalleryManager.css";
import { IoCloudUploadOutline, IoTrash, IoCopy } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const GalleryManager = () => {
  const { axios } = useAppContext();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef(null);
  const { id } = useParams();

  // Form States
  const [preview, setPreview] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState("");
  const [altText, setAltText] = useState("");
  const [category, setCategory] = useState("general");
  const [sizeText, setSizeText] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Edit state

  const [editTitle, setEditTitle] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [editCategory, setEditCategory] = useState("general");

  const startEdit = (id) => {
    setEditingItem(id);
    fetchSingleItem(id);
  };

  // Prevent double-click folder opening
  const [fileDialogOpen, setFileDialogOpen] = useState(false);

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      const { data } = await axios.get("/api/gallery/all");
      if (data.success) {
        setGallery(data.galleryData || []);
      } else {
        toast.error(data.message || "Failed to fetch gallery items");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch gallery items");
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle file preview
  const handleFile = (e) => {
    setFileDialogOpen(false); // stop double open

    const file = e.target.files?.[0];
    if (!file) return;

    // Preview only images
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
      // For PDF / DOC files → No preview
      setPreview(null);
      setWidth("");
      setHeight("");
    }

    setSizeText((file.size / 1024).toFixed(1) + " KB");
  };

  // Reset form
  const resetForm = () => {
    setPreview(null);
    setTitle("");
    setAltText("");
    setCategory("general");
    setSizeText("");
    setWidth("");
    setHeight("");
    setFileDialogOpen(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return toast.error("Title required");
    if (!altText.trim()) return toast.error("ALT text required");

    const form = new FormData();
    form.append("title", editTitle);
    form.append("altText", editAltText);
    form.append("category", editCategory);

    if (fileRef.current?.files?.[0]) {
      form.append("file", fileRef.current.files[0]);
    } else {
      return toast.error("Please upload a file");
    }

    try {
      setLoading(true);
      const res = await axios.post("/api/gallery/add", form);

      if (res.data?.success) {
        toast.success("Gallery item added");
        setGallery((g) => [res.data.data, ...g]);
        resetForm();
        setShowForm(false);
      } else {
        toast.error(res.data?.message || "Failed to add");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleItem = async (id) => {
    try {
      const { data } = await axios.get(`/api/gallery/${id}`);

      if (data.success) {
        const item = data.gallery;

        setEditTitle(item.title);
        setEditAltText(item.altText);
        setEditCategory(item.category);

        setEditingItem(item); // Store full object for editing
      } else {
        toast.error(data.message || "Failed to fetch item");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (editingItem && typeof editingItem === "string") {
      fetchSingleItem(editingItem);
    }
  }, [editingItem]);

  const handleEditFile = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      form.append("title", editTitle);
      form.append("altText", editAltText);
      form.append("category", editCategory);

      const { data } = await axios.put(
        `/api/gallery/edit-file/${editingItem._id}`,
        form
      );

      if (data.success) {
        toast.success("Gallery item updated");

        setGallery((g) =>
          g.map((it) => (it._id === editingItem._id ? data.updatedItem : it))
        );

        setEditingItem(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      const res = await axios.delete(`/api/gallery/delete-file/${id}`);

      if (res.data?.success) {
        setGallery((g) => g.filter((it) => it._id !== id));
        toast.success("Deleted");
      } else {
        toast.error(res.data?.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  return (
    <section className="galleryWrapper">
      <div className="galleryContainer">
        <h2 className="galleryHeading">Gallery Manager</h2>

        {/* Toggle form */}
        <div className="formToggleRow">
          <button
            type="button"
            className="projectSaveBtn"
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
          >
            {showForm ? "Close" : "Add New Image"}
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <form className="galleryForm" onSubmit={handleSubmit}>
            <div className="formRow">
              {/* Title */}
              <label className="labelField">
                Title
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="inputField"
                />
              </label>

              {/* Alt */}
              <label className="labelField">
                ALT Text
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  className="inputField"
                />
              </label>

              {/* Category */}
              <label className="labelField">
                Category
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="inputField"
                />
              </label>

              {/* Upload box */}
              <label className="labelField">
                File
                <div
                  className="uploadBox"
                  onClick={() => {
                    if (!fileDialogOpen) {
                      setFileDialogOpen(true);
                      fileRef.current.click();
                    }
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      className="uploadPreview"
                      alt="preview"
                    />
                  ) : (
                    <div className="uploadPlaceholder">
                      <IoCloudUploadOutline size={36} />
                      <p>Upload</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  hidden
                  ref={fileRef}
                  accept="image/*,application/pdf"
                  onChange={handleFile}
                  onClick={(e) => {
                    e.target.value = null; // allow same file re-upload
                    setFileDialogOpen(false);
                  }}
                />
              </label>

              {/* Meta Info */}
              <div className="metaSmall">
                <div>
                  <strong>Size:</strong> {sizeText || "-"}
                </div>
                <div>
                  <strong>Dimensions:</strong>{" "}
                  {width && height ? `${width} x ${height}` : "N/A"}
                </div>
              </div>

              <button
                className="projectSaveBtn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Saving..." : "Add Item"}
              </button>
            </div>
          </form>
        )}

        {/* Gallery list */}
        <h3 className="sectionTitle">Saved Gallery Items</h3>

        {gallery.length === 0 ? (
          <p className="empty">No gallery items found.</p>
        ) : (
          <div className="galleryGrid">
            {gallery.map((item) => {
              const id = item._id;
              const src = item.fileType?.startsWith("image/")
                ? `${VITE_BASE_URL}/uploads/gallery/${item.fileName}`
                : null;

              return (
                <div className="galleryCard" key={id}>
                  <div className="cardImageWrap">
                    {src ? (
                      <img src={src} alt={item.altText} />
                    ) : (
                      <div className="uploadPlaceholder">PDF / File</div>
                    )}
                  </div>

                  <div className="cardBody">
                    <h4 className="cardTitle">{item.title}</h4>
                    <small className="cardAlt">{item.altText}</small>

                    <div className="cardMeta">
                      <span>{item.category}</span>
                      <span>{item.fileSize}</span>
                      <span>
                        {item.width && item.height
                          ? `${item.width} x ${item.height}`
                          : "-"}
                      </span>
                    </div>

                    <div className="cardActions">
                      <button
                        className="copyBtn"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${VITE_BASE_URL}/uploads/gallery/${item.fileName}`
                          )
                        }
                      >
                        <IoCopy />
                      </button>

                      <button
                        className="deleteBtn"
                        onClick={() => handleDelete(id)}
                      >
                        <IoTrash />
                      </button>

                      <button
                        className="editBtn galleryedit"
                        onClick={() => startEdit(id)}
                      >
                        <MdModeEditOutline />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {editingItem && (
          <div className="msgModal">
            <div className="msgModalBox">
              <h3>Edit Gallery Item</h3>
              {/* Edit form fields can go here */}
              <form action="" onSubmit={handleEditFile}>
                <label className="labelField">
                  Title
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="inputField"
                  />
                </label>

                {/* Alt */}
                <label className="labelField">
                  ALT Text
                  <input
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    className="inputField"
                  />
                </label>

                {/* Category */}
                <label className="labelField">
                  Category
                  <input
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="inputField"
                  />
                </label>
                <button className="closeBtn">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryManager;
