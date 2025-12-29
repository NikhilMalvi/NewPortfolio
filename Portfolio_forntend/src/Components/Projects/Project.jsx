import React, { useEffect, useState } from "react";
import "./Project.css";
import Tab from "./Tab";
import { projectDataWithAll } from "./item";
const Project = () => {
  const [mainData, setMaindata] = useState([]);

  // useEffect(() => {
  //   const api = "";

  //   if (api === "/api/project/all") {
  //     setMaindata("");
  //     console.log("ed");
  //   } else if (api === "") {
  //     setMaindata(projectDataWithAll);
  //     console.log("error come");
  //     console.log(projectDataWithAll, "data come");
  //   }
  // }, []);

  return (
    <>
      <title>Projects | Nikhil Malviya - Front-End Portfolio</title>

      <meta
        name="description"
        content="Explore a selection of projects developed by Nikhil Malviya, including responsive websites, React apps, and custom WordPress themes."
      />
      <div className="project section_container">
        <div className="project_heading">
          <h1>Project</h1>
          <p>Recently completed projects list</p>
        </div>

        <div className="project_tab">
          <Tab project_data={mainData} />
        </div>
      </div>
    </>
  );
};

export default Project;
