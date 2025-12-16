import React from "react";

const TableOfProject = ({
  projects,
  handleDelete,
  searchQuery,
  setSearchQuery,
  filteredProjects,
  navigate,
  VITE_BASE_URL,
}) => {
  return (
    <>
      <div className="filterBar">
        <input
          type="text"
          placeholder="Search by name..."
          className="searchInput"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects().length === 0 ? (
        <p className="emptyMsg">No projects found.</p>
      ) : (
        <table className="projectTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Skills</th>
              <th>Tools</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProjects().map((p) => (
              <tr key={p._id}>
                <td>
                  <img
                    src={`${VITE_BASE_URL}/uploads/gallery/${p.projectImage}`}
                    alt={p.projectTitle}
                    className="tableImg"
                  />
                </td>

                <td>{p.projectTitle}</td>

                <td>
                  <div className="tagRow">
                    {p.projectSkills.map((s, i) => (
                      <span key={s._id} className="tag">
                        {s.skillName}
                      </span>
                    ))}
                  </div>
                </td>

                <td>
                  <div className="tagRow">
                    {p.projectTools.split(",").map((tool, i) => (
                      <span key={i} className="tag tool">
                        {tool}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="actionCell">
                  <button
                    onClick={() => navigate(`/admin/edit-project/${p._id}`)}
                    className="editBtn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="deleteBtn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default TableOfProject;
