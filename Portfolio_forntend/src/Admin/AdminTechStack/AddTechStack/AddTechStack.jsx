import React, { useRef, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { useEffect } from "react";
import Media from "../../../Components/Media/Media";

const AddTechStack = ({ editing }) => {
  const { axios } = useAppContext();
  const { id } = useParams();
  const [showMedia, setShowMedia] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState(null); // Track which image is being edited
  const [galleryImage, setGalleryImage] = useState(""); // 🔥 filename only

  const [techName, setTechName] = useState("");
  const [techImg, setTechImg] = useState(null);
  const [existingImg, setExistingImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const techInputRef = useRef();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    if (!editing || !id) return;

    const fetchTech = async () => {
      try {
        const { data } = await axios.get(`/api/technology/${id}`);

        if (data.success) {
          setTechName(data.technology.techName);
          setExistingImg(
            `${VITE_BASE_URL}/uploads/gallery/${data.technology.techImg}`
          );
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchTech();
  }, [editing, id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTechImg(file);
    setExistingImg(URL.createObjectURL(file));
  };

  const handleonSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // if (!techInputRef.current?.files[0]) {
    //   setLoading(false);
    //   return toast.error("Please upload an image");
    // }

    try {
      const formData = new FormData();
      formData.append("techName", techName);
      if (techInputRef.current?.files?.[0]) {
        formData.append("techImg", techInputRef.current.files[0]);
      }

      // ✅ CASE 2: selected from gallery
      else if (galleryImage) {
        formData.append("techImg", galleryImage);
      }

      let res;

      if (editing) {
        res = await axios.put(`api/technology/edit-tech/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/technology/add-tech", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(res.data.message);
        if (!editing) {
          setTechName("");
          setTechImg(null);
          setExistingImg(null);
          techInputRef.current.value = null;
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (item) => {
    // item.fileName comes from gallery schema
    setGalleryImage(item.fileName);

    // Preview URL (only for UI)
    setTechImg(
      `${import.meta.env.VITE_BASE_URL}/uploads/gallery/${item.fileName}`
    );
  };

  return (
    <section className="aboutAdminWrapper">
      <form className="aboutAdminContainer" onSubmit={handleonSubmit}>
        <div className="aboutSection">
          <h3 className="aboutAdminHeading">
            {" "}
            {editing ? "Edit Technology" : "Add Technology"}
          </h3>

          <div className="aboutRow">
            <div
              className="aboutUploadBox"
              onClick={() => {
                setCurrentImageSlot("techImg");
                setShowMedia(true);
              }}
            >
              {editing ? (
                existingImg ? (
                  <img src={existingImg} className="aboutUploadPreview" />
                ) : techImg ? (
                  <img src={techImg} className="aboutUploadPreview" />
                ) : (
                  <span>Click to upload image</span>
                )
              ) : techImg ? (
                <img src={techImg} className="aboutUploadPreview" />
              ) : (
                <span>Click to upload image</span>
              )}
            </div>
            <input
              type="file"
              hidden
              ref={techInputRef}
              accept="image/png , image/jpeg , image/webp"
              onChange={handleImageUpload}
            />
          </div>

          <div className="aboutRow">
            <label className="aboutLabel">Tech Title</label>
            <input
              className="aboutInput"
              required
              value={techName}
              onChange={(e) => setTechName(e.target.value)}
            />
          </div>

          <button disabled={loading} className="aboutSaveBtn">
            {loading
              ? editing
                ? "Updating..."
                : "Adding..."
              : editing
              ? "Update Technology"
              : "Add Technology"}{" "}
          </button>
        </div>
      </form>
      <Media
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        onUploadSuccess={handleMediaSelect}
      />
    </section>
  );
};

export default AddTechStack;
