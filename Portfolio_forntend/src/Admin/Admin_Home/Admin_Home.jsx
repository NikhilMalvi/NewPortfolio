import React, { useEffect, useRef, useState } from "react";
import "./Admin_Home.css";
import { IoCloudUploadOutline } from "react-icons/io5";

import LightImage from "../../img/Home_light_img.png";
import DarkImage from "../../img/Home_dark_img.png";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Media from "../../Components/Media/Media";

const Admin_Home = () => {
  const { axios, navigate } = useAppContext();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [showMedia, setShowMedia] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState(null); // Track which image is being edited
  const [isLoading, setIsLoading] = useState(true);

  const [homeHeading, setHomeHeading] = useState(" ");
  const [homeDescription, setHomeDescription] = useState("");
  const [homeCTA, setHomeCTA] = useState("");
  const [homeCTALink, setHomeCTALink] = useState("");

  const [previewLight, setPreviewLight] = useState(null);
  const [previewDark, setPreviewDark] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`${VITE_BASE_URL}/api/home/all`);

        if (data.success) {
          const home = data.home;

          setHomeHeading(home.homeHeading || "");
          setHomeDescription(home.homeDescription || "");
          setHomeCTA(home.homeCTA || "");
          setHomeCTALink(home.homeCTALink || "");

          setPreviewLight(home.lightImageUrl || null);

          setPreviewDark(home.darkImageUrl || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleUpdateHome = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("homeHeading", homeHeading);
      formData.append("homeDescription", homeDescription);
      formData.append("homeCTA", homeCTA);
      formData.append("homeCTALink", homeCTALink);

      if (previewLight) formData.append("lightImageUrl", previewLight);
      if (previewDark) formData.append("darkImageUrl", previewDark);

      const response = await axios.put(`/api/home/update-home`, formData);
      console.log(previewLight, previewDark);

      console.log(response.data.data);

      const updated = response.data.data;

      // 🔥 Update State With New Fresh Values (so UI updates instantly)
      setHomeHeading(updated.homeHeading);
      setHomeDescription(updated.homeDescription);
      setHomeCTA(updated.homeCTA);
      setHomeCTALink(updated.homeCTALink);

      setPreviewLight(updated.lightImageUrl || LightImage);
      setPreviewDark(updated.darkImageUrl || DarkImage);

      toast.success(response.data.message);
      // toast.success("Home updated successfully!");
    } catch (error) {
      toast.error(error.message); // toast.error("Update failed");
    }
  };

  const handleMediaSelect = (item) => {
    const imageUrl = item.imageUrl;

    if (currentImageSlot === "light") setPreviewLight(imageUrl);
    else if (currentImageSlot === "dark") setPreviewDark(imageUrl);

    setCurrentImageSlot(null);
    setShowMedia(false);
  };

  return (
    <section className="admin_section">
      {isLoading && (
        <div style={{ textAlign: "center", padding: "20px" }}>Loading...</div>
      )}
      <h2 className="adminHeading">Home Page Settings</h2>

      <form onSubmit={handleUpdateHome}>
        <div className="adminCard">
          {/* LEFT SIDE FIELDS */}
          <div className="adminLeft">
            <label className="labelField">
              Home Heading
              <input
                type="text"
                value={homeHeading}
                className="inputField"
                onChange={(e) => setHomeHeading(e.target.value)}
              />
            </label>

            <label className="labelField">
              Home Description
              <input
                type="text"
                value={homeDescription}
                className="inputField"
                onChange={(e) => setHomeDescription(e.target.value)}
              />
            </label>

            <label className="labelField">
              CTA Button Text
              <input
                type="text"
                value={homeCTA}
                className="inputField"
                onChange={(e) => setHomeCTA(e.target.value)}
              />
            </label>

            <label className="labelField">
              CTA Button Link
              <input
                type="text"
                value={homeCTALink}
                className="inputField"
                onChange={(e) => setHomeCTALink(e.target.value)}
              />
            </label>
          </div>

          {/* RIGHT SIDE UPLOADS */}
          <div className="adminRight">
            <div>
              <p style={{ marginBottom: "6px", fontWeight: 600 }}>
                Light Mode Image
              </p>
              <div
                className="uploadBox"
                onClick={() => {
                  setCurrentImageSlot("light");
                  setShowMedia(true);
                }}
              >
                {previewLight &&
                previewLight !== LightImage &&
                previewLight.startsWith("http") ? (
                  <img
                    src={previewLight}
                    className="uploadPreview"
                    alt="Light Preview"
                  />
                ) : (
                  <div className="uploadPlaceholder">
                    <IoCloudUploadOutline size={45} />
                    <p>Upload</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p style={{ marginBottom: "6px", fontWeight: 600 }}>
                Dark Mode Image
              </p>
              <div
                className="uploadBox"
                onClick={() => {
                  setCurrentImageSlot("dark");
                  setShowMedia(true);
                }}
              >
                {previewDark &&
                previewDark !== DarkImage &&
                previewDark.startsWith("http") ? (
                  <img
                    src={previewDark}
                    className="uploadPreview"
                    alt="Dark Preview"
                  />
                ) : (
                  <div className="uploadPlaceholder">
                    <IoCloudUploadOutline size={45} />
                    <p>Upload</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button type="submit" className="saveBtn">
          Update Home Page
        </button>
      </form>

      <Media
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        onUploadSuccess={handleMediaSelect}
      />
    </section>
  );
};

export default Admin_Home;
