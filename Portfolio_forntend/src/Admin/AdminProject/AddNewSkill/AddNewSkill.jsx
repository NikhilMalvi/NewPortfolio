import React, { useState, useEffect } from "react";
import "./AddNewSkill.css";
import { useAppContext } from "../../../context/AppContext";
import toast from "react-hot-toast";
import { useParams } from "react-router";

const AddNewSkill = ({ editing }) => {
  const { axios } = useAppContext();

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [skillName, setSkillName] = useState("");
  const [skillSlug, setSkillSlug] = useState("");
  const [parentSkill, setParentSkill] = useState("");
  const [parentOptions, setParentOptions] = useState([]); // dynamic parent skills

  useEffect(() => {
    if (!editing || !id) return;

    const fetchSkill = async () => {
      try {
        const { data } = await axios.get(`/api/project/skill/${id}`);

        if (data.success) {
          if (editing) {
            setSkillName(data.skill.skillName);
            setSkillSlug(data.skill.skillSlug);
            setParentSkill(data.skill.parentSkill);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchSkill();
  }, [editing, id]);

  // 👉 Auto-generate slug from skillName
  useEffect(() => {
    if (!skillName) {
      setSkillSlug("");
      return;
    }
    setSkillSlug(skillName.trim().toLowerCase().replace(/\s+/g, "-"));
  }, [skillName]);

  // 👉 Fetch all skills to use as parent options
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data } = await axios.get("/api/project/skill/all");

        if (data.success && Array.isArray(data.data || data.skill)) {
          // adjust based on your backend key: data.data OR data.skills
          setParentOptions(data.data || data.skill);
        } else {
          setParentOptions([]);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load skills for parent list");
      }
    };

    fetchSkills();
  }, [axios]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skillName.trim() || !skillSlug.trim()) {
      return toast.error("Skill Name and Slug cannot be empty");
    }

    try {
      setLoading(true);

      const payload = {
        skillName,
        skillSlug,
        parentSkill: parentSkill || "none", // empty => "none"
      };

      let res;

      if (editing) {
        res = await axios.put(`/api/project/skill/edit-skill/${id}`, payload);
      } else {
        res = await axios.post("/api/project/skill/add", payload);
      }

      if (res.data.success) {
        toast.success(res.data.message || "Skill created successfully");

        if (!editing) {
          setSkillName("");
          setSkillSlug("");
          setParentSkill("");
        }
      } else {
        toast.error(res.data.message || "Failed to create skill");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="adminSkillWrapper">
      <form className="adminSkillContainer" onSubmit={handleSubmit}>
        <h2 className="adminSkillHeading">
          {editing ? "Edit Skill" : "Add New Skill"}
        </h2>

        <div className="adminSkillGrid">
          {/* LEFT Side */}
          <div className="skillMain">
            <div className="skillRow">
              <label className="skillLabel">Skill Name *</label>
              <input
                type="text"
                className="skillInput"
                placeholder="e.g. React.js"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>

            <div className="skillRow">
              <label className="skillLabel">Skill Slug *</label>
              <input
                type="text"
                className="skillInput"
                placeholder="react-js"
                value={skillSlug}
                onChange={(e) => setSkillSlug(e.target.value)}
              />
            </div>

            <div className="skillRow">
              <label className="skillLabel">Parent Skill (Optional)</label>
              <select
                className="skillInput"
                value={parentSkill}
                onChange={(e) => setParentSkill(e.target.value)}
              >
                <option value="">None</option>
                {parentOptions.map((skill) => (
                  <option key={skill._id} value={skill.skillName}>
                    {skill.skillName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT Side Preview */}
          <div className="skillSide">
            <div className="previewBox">
              <p>Skill Preview</p>
              <h4>{skillName || "Skill Name"}</h4>
              <small>{skillSlug || "slug-preview"}</small>

              {parentSkill && (
                <span className="previewTag">Parent: {parentSkill}</span>
              )}
            </div>
          </div>
        </div>

        <button className="skillSaveBtn" type="submit" disabled={loading}>
          {loading
            ? editing
              ? "Updating..."
              : "Adding..."
            : editing
            ? "Update Skill"
            : "Add Skill"}
        </button>
      </form>
    </section>
  );
};

export default AddNewSkill;
