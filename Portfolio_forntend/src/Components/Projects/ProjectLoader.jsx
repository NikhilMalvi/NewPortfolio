import React from "react";
import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

const ProjectLoader = () => {
  return (
    <div className="tabes">
      {/* ===== Tabs Skeleton ===== */}
      <div className="block_tabes max_container">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <div className="tab" key={index}>
              <Skeleton height={24} width={80} />
            </div>
          ))}
      </div>

      {/* ===== Project Cards Skeleton ===== */}
      <div className="contant_tab max_container">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div className="card card_active" key={index}>
              {/* Image */}
              <Skeleton height={180} width="100%" />

              <div className="card_data">
                {/* Title */}
                <Skeleton height={22} width="70%" />

                {/* Skills row */}
                <div style={{ marginTop: 10 }}>
                  <Skeleton height={14} width="90%" />
                </div>

                {/* Read more */}
                <div style={{ marginTop: 15 }}>
                  <Skeleton height={16} width={100} />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ProjectLoader;
