import React from "react";

const AppLogo = ({ height = "100px" }) => {
  const sizes = {
    small: "w-12 h-12",
    medium: "w-20 h-20",
    large: "w-32 h-32",
  };

  return (
    <img
      src="/app-logo.png"
      alt="OT Logo"
      style={{ height: height }}
    />
  );
};

export default AppLogo;