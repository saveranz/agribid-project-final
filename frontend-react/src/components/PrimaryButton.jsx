import React from "react";

const PrimaryButton = ({ label, onClick, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                  py-2 px-4 rounded-lg transition duration-200"
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
