import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logoutUser } from "../api";

export default function PortalLayout() {

  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();

    window.dispatchEvent(
      new Event("auth:logout")
    );

    navigate("/", { replace: true });
  };

  return (
    <div className="portal-page">

      <header className="portal-navbar">

        <div
          className="portal-logo"
          onClick={() => navigate("/home")}
        >
          Smart Interview
        </div>
        <nav className="portal-nav">
          <NavLink to="/home">
            Home
          </NavLink>
          
          <NavLink to="/attendance">
            Attendance
          </NavLink>

          <NavLink to="/mcq">
            MCQ
          </NavLink>

          <NavLink to="/coding">
            Coding
          </NavLink>

          <NavLink to="/results">
            Results
          </NavLink>

          <NavLink to="/about">
            About
          </NavLink>

          <NavLink to="/support">
            Support
          </NavLink>

        </nav>

        <button
          className="portal-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </header>

      <main className="portal-main">
        <Outlet />
      </main>

    </div>
  );
}
