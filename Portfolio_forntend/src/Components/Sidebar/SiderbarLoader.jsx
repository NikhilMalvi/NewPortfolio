import React from "react";
import Skeleton from "react-loading-skeleton";

const SiderbarLoader = () => {
  return (
    <>
      <div className="profile">
        <Skeleton height={100} width={100} circle />
        <Skeleton
          height={27}
          width="100"
          style={{ marginTop: 10, marginBottom: 20 }}
        />
        <Skeleton height={45} width="100" style={{ marginBottom: 15 }} />
        <div className="about_button">
          <Skeleton height={42} width="100" />
        </div>
      </div>
    </>
  );
};

export default SiderbarLoader;
