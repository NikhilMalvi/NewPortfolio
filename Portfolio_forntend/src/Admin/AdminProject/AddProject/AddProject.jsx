import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./AddProject.css";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import Media from "../../../Components/Media/Media";

const AddProject = ({ editing }) => {
  const { axios } = useAppContext();
  const [showMedia, setShowMedia] = useState(false);
  const [currentImageSlot, setCurrentImageSlot] = useState(null); // Track which image is being edited
  const [galleryImage, setGalleryImage] = useState(""); // 🔥 filename only

  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [skillOptions, setSkillOptions] = useState([]);

  // Project States
  const [projectImage, setProjectImage] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectWebsite, setProjectWebsite] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectTools, setProjectTools] = useState([]);
  const [projectSkills, setProjectSkills] = useState([]);
  const [toolInput, setToolInput] = useState("");

  const quillRef = useRef(null);
  const quillContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await axios.get("/api/project/skill/all");
        if (data.success) {
          setSkillOptions(data.data || data.skill || []);
        }
      } catch {
        toast.error("Error loading skills");
      }
    };
    fetchSkills();
  }, []);

  // Load project if editing
  useEffect(() => {
    if (!editing || !id || skillOptions.length === 0) return;

    const loadProject = async () => {
      try {
        const { data } = await axios.get(`/api/project/${id}`);
        if (data.success) {
          const p = data.project;

          setProjectTitle(p.projectTitle);
          setProjectWebsite(p.projectWebsite);
          setProjectLocation(p.projectLocation);
          setProjectTools(p.projectTools.split(","));
          setProjectSkills(p.projectSkills.map((s) => s._id)); // <-- This now works

          if (quillRef.current) {
            quillRef.current.root.innerHTML = p.projectDescription;
          }

          setProjectDescription(p.projectDescription);
          setProjectImage(p.projectImageUrl);
        }
      } catch {
        toast.error("Error loading project");
      }
    };

    loadProject();
  }, [editing, id, skillOptions]);

  // Init Quill
  useEffect(() => {
    if (!quillRef.current && quillContainerRef.current) {
      quillRef.current = new Quill(quillContainerRef.current, {
        theme: "snow",
        placeholder: "Write project description...",
      });

      quillRef.current.on("text-change", () => {
        setProjectDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  // Skills toggle
  const toggleSkill = (id) => {
    setProjectSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Tools input Enter Add
  const handleToolInput = (e) => {
    if (e.key === "Enter" && toolInput.trim()) {
      e.preventDefault();

      if (!projectTools.includes(toolInput.trim())) {
        setProjectTools((prev) => [...prev, toolInput.trim()]);
      }
      setToolInput("");
    }
  };

  // Remove Tool
  const removeTool = (tool) => {
    setProjectTools((prev) => prev.filter((t) => t !== tool));
  };

  // Upload image preview
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProjectImage(URL.createObjectURL(file));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Auto-add last typed tool
    if (toolInput.trim() && !projectTools.includes(toolInput.trim())) {
      setProjectTools((prev) => [...prev, toolInput.trim()]);
      setToolInput("");
    }

    await new Promise((r) => setTimeout(r, 50)); // update state

    if (
      !projectTitle.trim() ||
      !projectWebsite.trim() ||
      !projectLocation.trim() ||
      !projectDescription.trim() ||
      projectSkills.length === 0 ||
      projectTools.length === 0
    ) {
      return toast.error("Fill all fields and select skills/tools");
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("projectTitle", projectTitle);
      formData.append("projectDescription", projectDescription);
      formData.append("projectWebsite", projectWebsite);
      formData.append("projectLocation", projectLocation);
      formData.append("projectTools", projectTools);
      formData.append("projectSkills", JSON.stringify(projectSkills));

      // ✅ CASE 1: uploaded file
      if (projectImage) {
        formData.append("projectImageUrl", projectImage);
      }

      // ✅ CASE 2: selected from gallery

      let res;

      if (editing) {
        res = await axios.put(`/api/project/edit-project/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await axios.post("/api/project/add", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (res.data.success) {
        toast.success(
          editing ? "Project Updated" : "Project Added Successfully"
        );
        if (!editing) resetForm();
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setProjectTitle("");
    setProjectDescription("");
    quillRef.current.root.innerHTML = "";
    setProjectWebsite("");
    setProjectLocation("");
    setProjectTools([]);
    setProjectSkills([]);
    setToolInput("");
    setProjectImage(null);
    fileInputRef.current.value = "";
  };

  const handleMediaSelect = (item) => {
    // item.fileName comes from gallery schema
    // setGalleryImage(item.fileName);
    const imageUrl = item.imageUrl;

    // Preview URL (only for UI)
    setProjectImage(imageUrl);
  };

  return (
    <section className="projectAdminWrapper">
      <form className="projectAdminContainer" onSubmit={handleSubmit}>
        <h2 className="projectHeading">
          {editing ? "Edit Project" : "Add New Project"}
        </h2>

        <div className="projectGrid">
          {/* Left */}
          <div className="projectMain">
            <div className="projectRow">
              <label className="projectLabel">Project Title *</label>
              <input
                className="projectInput"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
              />
            </div>

            <div className="projectRow projectRowTwoCol">
              <div>
                <label className="projectLabel">Website *</label>
                <input
                  className="projectInput"
                  value={projectWebsite}
                  onChange={(e) => setProjectWebsite(e.target.value)}
                />
              </div>
              <div>
                <label className="projectLabel">Location *</label>
                <input
                  className="projectInput"
                  value={projectLocation}
                  onChange={(e) => setProjectLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="projectRow">
              <label className="projectLabel">Tools (Press Enter) *</label>
              <input
                id="toolInput"
                className="projectInput"
                placeholder="Example: React"
                value={toolInput}
                onChange={(e) => setToolInput(e.target.value)}
                onKeyDown={handleToolInput}
              />

              <div className="toolTagList">
                {projectTools.map((tool, i) => (
                  <span
                    key={i}
                    className="toolTag"
                    onClick={() => removeTool(tool)}
                  >
                    {tool} ✕
                  </span>
                ))}
              </div>
            </div>

            <div className="projectRow">
              <label className="projectLabel">Skills *</label>
              <div className="skillsCheckboxGroup">
                {skillOptions.map((skill) => (
                  <label key={skill._id} className="skillCheckbox">
                    <input
                      type="checkbox"
                      checked={projectSkills.includes(skill._id)}
                      onChange={() => toggleSkill(skill._id)}
                    />
                    {skill.skillName}
                  </label>
                ))}
              </div>
            </div>

            <div className="projectRow">
              <label className="projectLabel">Description *</label>
              <div ref={quillContainerRef} className="projectQuillWrapper" />
            </div>
          </div>

          {/* Right */}
          <div className="projectSide">
            <label className="projectLabel">Project Image *</label>
            <div
              className="projectUploadBox"
              onClick={() => {
                setCurrentImageSlot("projectImage");
                setShowMedia(true);
              }}
            >
              {projectImage ? (
                <img
                  src={projectImage}
                  className="projectUploadPreview"
                  alt=""
                />
              ) : (
                <div className="projectUploadPlaceholder">
                  <IoCloudUploadOutline size={30} />
                  <p>Upload</p>
                </div>
              )}
            </div>

            <input
              type="file"
              hidden
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        </div>

        <button className="projectSaveBtn" disabled={loading}>
          {loading ? "Saving..." : editing ? "Update Project" : "Save Project"}
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

export default AddProject;
