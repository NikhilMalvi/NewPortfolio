import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AboutLoader = () => {
  return (
    <div className="About">
      <div className="section_container About_me">
        <div className="max_container">
          <div className="col1">
            <Skeleton width={437.5} height={437.5} />
          </div>
          <div className="col2">
            <Skeleton width="100%" height={52.5} style={{ marginBottom: 10 }} />
            <Skeleton width="100%" height={212} style={{ marginBottom: 20 }} />
          </div>
        </div>
      </div>
      <div className="section_container My_workdata">
        <div className="container_data">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="box_heding">
                <Skeleton height={52} width={52} style={{ marginBottom: 10 }} />

                <Skeleton
                  height={24}
                  width="100%"
                  style={{ marginBottom: 10 }}
                />
              </div>
            ))}
        </div>
      </div>
      <div className="section_container MyEducation">
        <div className="max_container">
          <div className="col1">
            <Skeleton width="100%" height={52.5} style={{ marginBottom: 10 }} />
            <Skeleton width="100%" height={120} style={{ marginBottom: 20 }} />
          </div>
          <div className="col2">
            <Skeleton width={375} height={375} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLoader;
