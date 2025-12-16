import React, { useEffect, useRef, useState } from "react";
import "./Admin_About.css";
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { IoCloudUploadOutline } from "react-icons/io5";
import LightImage from "../../img/About_light_img.png";
import DarkImage from "../../img/About_dark_img.png";
import EducationLight from "../../img/Education_light.png";
import EducationDark from "../../img/Education_dark.png";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Media from "../../Components/Media/Media";

const Admin_About = () => {
  // Section 1

  const { axios, navigate } = useAppContext();
  const [showMedia, setShowMedia] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState(null); // Track which image is being edited

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const [aboutHeading, setAboutHeading] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [lightImage, setLightImage] = useState(null);
  const [darkImage, setDarkImage] = useState(null);
  const editorRef1 = useRef(null);
  const quillRef1 = useRef(null);
  const lightInputRef = useRef(null);
  const darkInputRef = useRef(null);
  const section3LightRef = useRef(null);
  const section3DarkRef = useRef(null);

  // Section 2 - counters
  const [counters, setCounters] = useState([]);

  // Section 3
  const [section3Title, setSection3Title] = useState("");
  const [section3LightImg, setSection3LightImg] = useState(null);
  const [section3DarkImg, setSection3DarkImg] = useState(null);
  const [section3Content, setSection3Content] = useState("");
  const editorRef2 = useRef(null);
  const quillRef2 = useRef(null);

  // Handle media modal selection for different image slots
  const handleMediaSelect = (item) => {
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
    const imageUrl = item.fileType?.startsWith("image/")
      ? `${VITE_BASE_URL}/uploads/gallery/${item.fileName}`
      : item.image
      ? `${VITE_BASE_URL}/uploads/gallery/${item.image}`
      : item.url || "";

    if (currentImageSlot === "light") setLightImage(imageUrl);
    else if (currentImageSlot === "dark") setDarkImage(imageUrl);
    else if (currentImageSlot === "section3Light")
      setSection3LightImg(imageUrl);
    else if (currentImageSlot === "section3Dark") setSection3DarkImg(imageUrl);

    setCurrentImageSlot(null);
    setShowMedia(false);
  };

  useEffect(() => {
    if (!quillRef1.current && editorRef1.current) {
      quillRef1.current = new Quill(editorRef1.current, { theme: "snow" });
      quillRef1.current.on("text-change", () => {
        setAboutDescription(quillRef1.current.root.innerHTML);
      });
    }
    if (!quillRef2.current && editorRef2.current) {
      quillRef2.current = new Quill(editorRef2.current, { theme: "snow" });
      quillRef2.current.on("text-change", () => {
        setSection3Content(quillRef2.current.root.innerHTML);
      });
    }
  }, []);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const { data } = await axios.get("/api/about/all");

        if (data.success) {
          const about = data.about;
          setAboutHeading(about.aboutHeading || "");
          setAboutDescription(about.aboutDescription || "");
          setLightImage(
            about.lightImage
              ? `${VITE_BASE_URL}/uploads/gallery/${about.lightImage}`
              : LightImage
          );
          setDarkImage(
            about.darkImage
              ? `${VITE_BASE_URL}/uploads/gallery/${about.darkImage}`
              : DarkImage
          );
          setCounters(about.counters || "");
          setSection3Title(about.section3Title || "");
          setSection3Content(about.section3Content || "");
          setSection3LightImg(
            about.section3LightImg
              ? `${VITE_BASE_URL}/uploads/gallery/${about.section3LightImg}`
              : EducationLight
          );
          setSection3DarkImg(
            about.section3DarkImg
              ? `${VITE_BASE_URL}/uploads/gallery/${about.section3DarkImg}`
              : EducationDark
          );
          setTimeout(() => {
            if (quillRef1.current) {
              quillRef1.current.root.innerHTML = about.aboutDescription || "";
            }
            if (quillRef2.current) {
              quillRef2.current.root.innerHTML = about.section3Content || "";
            }
          }, 0);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchAboutData();
  }, []);

  // useEffect(() => {
  //   if (quillRef1.current) {
  //     quillRef1.current.root.innerHTML = aboutDescription;
  //   }
  //   if (quillRef2.current) {
  //     quillRef2.current.root.innerHTML = section3Content;
  //   }
  // }, [aboutDescription, section3Content]);

  const handleSave = async (e) => {
    e.preventDefault();
    // alert("Saved successfully — Backend connection coming next 🚀");
    try {
      const formData = new FormData();
      formData.append("aboutHeading", aboutHeading);
      formData.append("aboutDescription", aboutDescription);

      const lightFilename =
        lightImage && lightImage.startsWith(VITE_BASE_URL)
          ? lightImage.split("/").pop()
          : null;
      const darkFilename =
        darkImage && darkImage.startsWith(VITE_BASE_URL)
          ? darkImage.split("/").pop()
          : null;

      formData.append("lightImage", lightFilename);
      formData.append("darkImage", darkFilename);

      formData.append("counters", JSON.stringify(counters));
      formData.append("section3Title", section3Title);

      formData.append("section3Content", section3Content);

      const section3LightFileName =
        section3LightImg && section3LightImg.startsWith(VITE_BASE_URL)
          ? section3LightImg.split("/").pop()
          : null;

      const section3DarkFileName =
        section3DarkImg && section3DarkImg.startsWith(VITE_BASE_URL)
          ? section3DarkImg.split("/").pop()
          : null;
      darkImage && darkImage.startsWith(VITE_BASE_URL)
        ? darkImage.split("/").pop()
        : null;

      formData.append("section3LightImg", section3LightFileName);

      formData.append("section3DarkImg", section3DarkFileName);

      const response = await axios.put("/api/about/update-about", formData);

      const updated = response.data.about;

      setAboutHeading(updated.aboutHeading);
      setAboutDescription(updated.aboutDescription);
      setLightImage(
        updated.lightImage
          ? `${VITE_BASE_URL}/uploads/gallery/${updated.lightImage}`
          : LightImage
      );

      setDarkImage(
        updated.darkImage
          ? `${VITE_BASE_URL}/uploads/gallery/${updated.darkImage}`
          : DarkImage
      );
      setSection3Title(updated.section3Title);
      setSection3Content(updated.section3Content);
      setSection3LightImg(
        updated.section3LightImg
          ? `${VITE_BASE_URL}/uploads/gallery/${updated.section3LightImg}`
          : EducationLight
      );
      setSection3DarkImg(
        updated.section3DarkImg
          ? `${VITE_BASE_URL}/uploads/gallery/${updated.section3DarkImg}`
          : EducationDark
      );

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <section className="aboutAdminWrapper">
      <form className="aboutAdminContainer" onSubmit={handleSave}>
        <h2 className="aboutAdminHeading">About Page Settings</h2>

        {/* ========= SECTION 1 ========= */}
        <div className="aboutSection">
          <h3 className="aboutSectionTitle">Section 1 — Main Content</h3>

          <div className="aboutRow">
            <label className="aboutLabel">Title</label>
            <input
              className="aboutInput"
              value={aboutHeading}
              onChange={(e) => setAboutHeading(e.target.value)}
            />
          </div>

          <div className="aboutRow">
            <label className="aboutLabel">Description</label>
            <div ref={editorRef1} className="aboutQuillWrapper"></div>
          </div>

          <div className="aboutRow">
            <label className="aboutLabel">Images</label>
            <div className="aboutUploadRow">
              {/* Light Image */}
              <div
                className="aboutUploadBox"
                onClick={() => {
                  setCurrentImageSlot("light");
                  setShowMedia(true);
                }}
              >
                <img
                  src={lightImage}
                  className="aboutUploadPreview"
                  alt="light"
                />
              </div>

              {/* Dark Image */}
              <div
                className="aboutUploadBox"
                onClick={() => {
                  setCurrentImageSlot("dark");
                  setShowMedia(true);
                }}
              >
                <img
                  src={darkImage}
                  className="aboutUploadPreview"
                  alt="dark"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========= SECTION 2 ========= */}
        <div className="aboutSection">
          <h3 className="aboutSectionTitle">Section 2 — Counters</h3>

          {counters.map((c, i) => (
            <div className="aboutRow" key={i}>
              <label className="aboutLabel">{c.label}</label>
              <div className="aboutCounterRow">
                <input
                  className="aboutInput"
                  value={c.value}
                  onChange={(e) => {
                    const updated = [...counters];
                    updated[i].value = e.target.value;
                    setCounters(updated);
                  }}
                />
                <input
                  className="aboutInput"
                  value={c.symbol}
                  onChange={(e) => {
                    const updated = [...counters];
                    updated[i].symbol = e.target.value;
                    setCounters(updated);
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ========= SECTION 3 ========= */}
        <div className="aboutSection">
          <h3 className="aboutSectionTitle">Section 3 — Additional Info</h3>

          <div className="aboutRow">
            <label className="aboutLabel">Section Title</label>
            <input
              className="aboutInput"
              value={section3Title}
              onChange={(e) => setSection3Title(e.target.value)}
            />
          </div>

          <div className="aboutRow">
            <label className="aboutLabel">Content</label>
            <div ref={editorRef2} className="aboutQuillWrapper"></div>
          </div>

          <div className="aboutRow">
            <label className="aboutLabel">Images</label>
            <div className="aboutUploadRow">
              {/* Light */}
              <div
                className="aboutUploadBox"
                onClick={() => {
                  setCurrentImageSlot("section3Light");
                  setShowMedia(true);
                }}
              >
                {section3LightImg ? (
                  <img src={section3LightImg} className="aboutUploadPreview" />
                ) : (
                  <div className="aboutPlaceholder">
                    <IoCloudUploadOutline size={30} />
                    <p>Light</p>
                  </div>
                )}
              </div>

              {/* Dark */}
              <div
                className="aboutUploadBox"
                onClick={() => {
                  setCurrentImageSlot("section3Dark");
                  setShowMedia(true);
                }}
              >
                {section3DarkImg ? (
                  <img src={section3DarkImg} className="aboutUploadPreview" />
                ) : (
                  <div className="aboutPlaceholder">
                    <IoCloudUploadOutline size={30} />
                    <p>Dark</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="aboutSaveBtn">Save About Page</button>
      </form>

      {/* Media Modal */}
      <Media
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        onUploadSuccess={handleMediaSelect}
      />
    </section>
  );
};

export default Admin_About;
