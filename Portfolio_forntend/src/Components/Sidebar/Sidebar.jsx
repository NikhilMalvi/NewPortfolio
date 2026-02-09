import "./Sidebar.css";
import profile_img from "../../img/profile_img.jpg";
import { FaInstagram, FaFacebookF, FaLinkedin, FaGithub } from "react-icons/fa";

import Imge_slider from "./Imge_slider";
import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import SiderbarLoader from "./SiderbarLoader";

const Sidebar = () => {
  const { axios } = useAppContext();
  const [profile, setProfile] = useState([]);
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const [loader, setLoader] = useState(false);

  const fetchProfileData = async () => {
    try {
      const { data } = await axios.get("/api/profile/all");

      if (data.success) {
        setProfile(data.profile);
        setLoader(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="sidebar">
      {loader ? (
        <div className="profile">
          <img src={profile.profileImgUrl || profile_img} alt="" />
          <h1 className="proflie_name">{profile.profileName}</h1>
          <h2>{profile.designation}</h2>
          <div className="about_button">
            <NavLink className="btn btn_border" to={`/${profile.aboutLink}`}>
              {profile.aboutme}
            </NavLink>
          </div>
        </div>
      ) : (
        <SiderbarLoader />
      )}
      <Imge_slider />
      <div className="icons_container">
        <h3 className="follow">Follow Me</h3>
        <div className="social_icons">
          <a
            href="https://www.instagram.com/nik.malvi.2002/"
            target="_blank"
            className="instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/nikhil.malvi.1297"
            target="_blank"
            className="facebook"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.linkedin.com/in/nikhil-malviya-702254258/"
            target="_blank"
            className="linkedin"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://github.com/NikhilMalviya"
            target="_blank"
            className="github"
          >
            <FaGithub />
          </a>
        </div>
        <div className="Copy_right">
          <h1> © 2026 ❤️ Nikhil Malviya</h1>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
