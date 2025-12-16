import React from "react";
import { Link } from "react-router";

const Icon = ({ Icon, icon_name, Icon_title }) => {
  return (
    <li>
      <Link to={`/${icon_name}`} className="Menuitem_hover">
        <div className="siderbar_menuicon">
          <span className="firstIcon">{Icon}</span>
          <span className="secondIcon">{Icon}</span>
        </div>
        <span className="hover_heading">{Icon_title}</span>
      </Link>
    </li>
  );
};

export default Icon;
