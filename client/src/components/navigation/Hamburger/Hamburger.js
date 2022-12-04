import React from "react";
import "./Hamburger.css";
function Hamburger(props) {
  return (
    <button onClick={props.click} className="toggle-button">
      <div className="toggle-button_line" />
      <div className="toggle-button_line" />
      <div className="toggle-button_line" />
    </button>
  );
}

export default Hamburger;
