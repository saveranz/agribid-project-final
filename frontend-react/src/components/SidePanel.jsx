import React from "react";

const SidePanel = ({ open, onClose, children, title }) => {
  // Always render, but hide visually and from pointer events when closed for transition
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-label="Close side panel"
      />
      {/* Desktop Side Panel (right, swipe left) */}
      <aside
        className={`
          hidden md:block fixed top-0 right-0 h-full w-96 max-w-full bg-white dark:bg-gray-900 shadow-2xl z-50
          transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ willChange: "transform" }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </aside>
      
      {/* Mobile Bottom Panel (swipe up) */}
      <aside
        className={`
          md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 rounded-t-2xl shadow-2xl z-50
          transition-transform duration-300
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ willChange: "transform" }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-800 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            className="text-2xl text-gray-400 hover:text-gray-700 dark:hover:text-white"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="p-6">{children}</div>
      </aside>
    </>
  );
};

export default SidePanel;