import React, { useEffect, useRef, useState } from "react";
import profile from "../../img/profile_img.jpg";
import toast from "react-hot-toast";
import { useAppContext } from "../../context/AppContext";
import Media from "../../Components/Media/Media";

const ProfileSection = () => {
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [showMedia, setShowMedia] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState(null); // Track which image is being edited

  const [profileImg, setProfileImg] = useState(null);
  const [profileImgName, setProfileImgName] = useState(null);
  const [profileName, setProfileName] = useState("");
  const [designation, setDesignation] = useState("");
  const [aboutme, setAboutMe] = useState("");
  const [aboutLink, setAboutLink] = useState("");

  const { axios } = useAppContext();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data } = await axios.get("/api/profile/all");
        if (data.success) {
          const profile = data.profile;
          setProfileName(profile.profileName || "");
          setDesignation(profile.designation || "");
          setAboutMe(profile.aboutme || "");
          setAboutLink(profile.aboutLink || "");
          if (profile.profileImgUrl) {
            setProfileImg(profile.profileImgUrl || profile);
            setProfileImgName(profile.profileImgUrl || null);
          }
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("profileName", profileName);
    formData.append("designation", designation);
    formData.append("aboutme", aboutme);
    formData.append("aboutLink", aboutLink);

    // send the gallery filename to the server so it can use existing upload
    formData.append("profileImgUrl", profileImg || "");

    try {
      const { data } = await axios.put("/api/profile/update-profile", formData);

      const updated = data.profile;

      setProfileName(updated.profileName);
      setDesignation(updated.designation);
      setAboutMe(updated.aboutme);
      setAboutLink(updated.aboutLink);
      setProfileImg(updated.profileImgUrl || profile);
      setProfileImgName(updated.profileImgUrl || profileImgName);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleMediaSelect = (item) => {
    const imageUrl = item.imageUrl;

    if (currentImageSlot === "profileImg") setProfileImg(imageUrl);

    setCurrentImageSlot(null);
    setShowMedia(false);
  };

  return (
    <section className="admin_section">
      <form className="aboutAdminContainer" onSubmit={handleUpdateProfile}>
        <div className="aboutRow">
          <label className="aboutLabel"> Profile Image </label>

          <div
            className="aboutUploadBox"
            onClick={() => {
              setCurrentImageSlot("profileImg");
              setShowMedia(true);
            }}
          >
            <img src={profileImg} alt="" className="aboutUploadPreview" />
          </div>
        </div>

        <div className="aboutRow">
          <label className="aboutLabel">Profile Name</label>
          <input
            className="aboutInput"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
          />
        </div>

        <div className="aboutRow">
          <label className="aboutLabel">Designation</label>
          <input
            className="aboutInput"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
        </div>

        <div className="aboutRow">
          <label className="aboutLabel">About Me Button</label>
          <input
            className="aboutInput"
            value={aboutme}
            onChange={(e) => setAboutMe(e.target.value)}
          />
        </div>

        <div className="aboutRow">
          <label className="aboutLabel">About Me Button Link</label>
          <input
            className="aboutInput"
            value={aboutLink}
            onChange={(e) => setAboutLink(e.target.value)}
          />
        </div>

        <button className="aboutSaveBtn">Save Profile</button>
      </form>
      <Media
        isOpen={showMedia}
        onClose={() => setShowMedia(false)}
        onUploadSuccess={handleMediaSelect}
      />
    </section>
  );
};

export default ProfileSection;
