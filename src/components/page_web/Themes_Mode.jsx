// src/components/ThemeToggleButton.jsx
import React, { useContext } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaMoon, FaSun } from "react-icons/fa6";
import { ThemeContext } from "../../ThemeContext";

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <OverlayTrigger
      placement="bottom"
      overlay={
        <Tooltip id="theme-tooltip">
          {theme === "light" ? "Mode Siang" : "Mode Malam"}
        </Tooltip>
      }
    >
      <button
        onClick={toggleTheme}
        className="d-flex align-items-center justify-content-center mx-3"
        style={{
          backgroundColor: theme === "light" ? "#FB8C00" : "#f0f0f0",
          color: theme === "light" ? "#fff" : "#333",
          border: "1px solid",
          borderColor: theme === "light" ? "#999" : "#ccc",
          borderRadius: "5px",
          padding: "8px 12px",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >
        {theme === "light" ? <FaSun size={18} /> : <FaMoon size={18} />}
      </button>
    </OverlayTrigger>
  );
};

export default ThemeToggleButton;
