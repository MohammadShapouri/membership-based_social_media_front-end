import React from "react";
import "./Label.css";

function FormLabel({ htmlFor, children }) {
  return (
    <label className="field-label" htmlFor={htmlFor}>
      {children}
    </label>
  );
}

export default FormLabel;
