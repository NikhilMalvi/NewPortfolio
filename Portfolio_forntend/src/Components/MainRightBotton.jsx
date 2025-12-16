import React from "react";
import TopSeller from "./TopSeller";

const MainRightBotton = () => {
  return (
    <div className="bottomRightCard">
      <div className="bottomName">
        <h2>Top Seller</h2>
        <a href="#">View More</a>
      </div>
      {TopSeller &&
        TopSeller.map((seller) => (
          <div className="topSeller" key={seller.id}>
            <div className="topSellerimg">
              <img src={seller.imgSrc} alt="" />
            </div>
            <p className="topSellerName">
              {seller.seller_name}
              <span>{seller.username}</span>{" "}
            </p>
            <a href="" className="button1 btn">
              Follow
            </a>
          </div>
        ))}
    </div>
  );
};

export default MainRightBotton;
