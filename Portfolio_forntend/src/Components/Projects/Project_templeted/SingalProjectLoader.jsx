import React from "react";
import Skeleton from "react-loading-skeleton";
import { MdDateRange, MdOutlinePlace } from "react-icons/md";
import { FaLink, FaLayerGroup } from "react-icons/fa";

const SingalProjectLoader = () => {
  return (
    <div className="singal_post section_container">
      <div className="title">
        <Skeleton width="60%" height={28} style={{ marginBottom: 20 }} />
        <p>
          Here Some details About <Skeleton width="60%" height={52.5} />
        </p>
      </div>
      <div className="max_container singal_container">
        <div className="col1">
          <Skeleton width="100%" height={645} />
          <div className="list_post_data">
            <div className="post_icons">
              <MdDateRange size={20} color="#0068ff" />
              <Skeleton width="100%" height={21} />
            </div>
            <div className="post_icons">
              <FaLink size={20} color="#0068ff" />
              <Skeleton width="100%" height={21} />
            </div>
            <div className="post_icons">
              <FaLayerGroup size={20} color="#0068ff" />
              <Skeleton width="100%" height={21} />
            </div>
            <div className="post_icons">
              <MdOutlinePlace size={20} color="#0068ff" />
              <Skeleton width="100%" height={21} />
            </div>
          </div>
        </div>
        <div className="col2">
          <h1 className="primery_heading">
            Name : <Skeleton width={130} height={18} />
          </h1>
          <h1 className="primery_heading">
            Tools: <Skeleton width={180} height={18} />
          </h1>
          <h1 className="primery_heading">
            About:
            <Skeleton width="100%" height={250} />
          </h1>
        </div>
      </div>
    </div>
  );
};

export default SingalProjectLoader;
