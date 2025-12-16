import "./App.css";
import Menu from "./Components/Menu";
import Container from "./Components/Container";
import { useEffect, useState } from "react";
import MainLayout from "./Pages/MainLayout";
import AdminLayout from "./Pages/AdminLayout";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Project from "./Components/Projects/Project";
import Contact from "./Components/Contact/Contact";
import Singal_post from "./Components/Projects/Project_templeted/Singal_post";
import Dashboard from "./Admin/Dashboard/Dashboard";
import Admin_Home from "./Admin/Admin_Home/Admin_Home";
import Admin_About from "./Admin/Admin_About/Admin_About";
import AddProject from "./Admin/AdminProject/AddProject/AddProject";
import AllProjects from "./Admin/AdminProject/AllProject/AllProjects";
import AddNewSkill from "./Admin/AdminProject/AddNewSkill/AddNewSkill";
import ContactMessages from "./Admin/Admin_Contact/ContactMessages/ContactMessages";
import GalleryManager from "./Admin/GalleryManager/GalleryManager";
import AdminLogin from "./Admin/Login/AdminLogin";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import ProfileSection from "./Admin/AdminSidebarSettings/ProfileSection";
import AddTechStack from "./Admin/AdminTechStack/AddTechStack/AddTechStack";
import GetTechStack from "./Admin/AdminTechStack/GetTechStack/GetTechStack";
import AllSkill from "./Admin/AdminProject/AllSkill/AllSkill";
import Media from "./Components/Media/Media";

function App() {
  // const body = document.querySelector("body");
  useEffect(() => {
    // On mount, apply default theme (light-mode)
    document.body.classList.add("light-mode");
  }, []);

  const { token } = useAppContext();

  const [openmenu, setopenmenu] = useState(true);

  const open = () => {
    setopenmenu(!openmenu);
  };

  const close = () => {
    setopenmenu(!openmenu);
  };

  // const token = true;

  return (
    <div className="App">
      {" "}
      <Toaster />
      <Routes>
        {/* USER WEBSITE ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/project" element={<Project />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project/:projectId" element={<Singal_post />} />
          {/* <Route path="/admin" element={<Layout />}></Route> */}
        </Route>

        <Route element={token ? <AdminLayout /> : <AdminLogin />} path="/admin">
          {/* <Route path="/admin/login" element={<AdminLogin />} /> */}
          <Route path="" element={<Dashboard />} />
          <Route path="home" element={<Admin_Home />} />
          <Route path="about" element={<Admin_About />} />
          <Route path="add-project" element={<AddProject editing={false} />} />
          <Route
            path="edit-project/:id"
            element={<AddProject editing={true} />}
          />

          <Route path="all-skill" element={<AllSkill />} />

          <Route path="all-project" element={<AllProjects />} />

          <Route path="add-skill" element={<AddNewSkill editing={false} />} />
          <Route
            path="edit-skill/:id"
            element={<AddNewSkill editing={true} />}
          />

          <Route
            path="add-technology"
            element={<AddTechStack editing={false} />}
          />
          <Route
            path="edit-tech/:id"
            element={<AddTechStack editing={true} />}
          />
          <Route path="all-technologys" element={<GetTechStack />} />
          <Route path="contact-messages" element={<ContactMessages />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="gallery" element={<GalleryManager />} />
          <Route path="media" element={<Media />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
