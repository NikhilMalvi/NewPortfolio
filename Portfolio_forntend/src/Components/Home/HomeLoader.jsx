import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomeSkeleton = () => {
  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="section_container row1">
        <div className="max_container">
          <div className="col1">
            <Skeleton height={40} width="70%" />
            <Skeleton height={24} width="90%" style={{ marginTop: 10 }} />
            <Skeleton height={24} width="60%" />

            <Skeleton
              height={45}
              width={160}
              borderRadius={30}
              style={{ marginTop: 20 }}
            />
          </div>

          <div className="col2">
            <Skeleton width={500} height={500} />
          </div>
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="section_container row2">
        <Skeleton height={30} width={200} style={{ marginBottom: 20 }} />

        <div className="tech_stack">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div className="image_boxes" key={index}>
                <div className="box">
                  {/* <Skeleton width={80} height={285} /> */}
                  <Skeleton
                    height={180}
                    width={180}
                    // style={{ marginTop: 10 }}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomeSkeleton;
