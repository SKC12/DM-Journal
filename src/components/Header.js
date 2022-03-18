import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../style/Header.css";

function Header(props) {
  const [user] = useAuthState(auth);

  const [idParameters, setIdParameters] = useState("");
  const navigate = useNavigate();
  const currentTab = props.currentTab;

  useEffect(() => {
    setIdParameters(
      props.currentUserID !== "" && props.currentCampaignId !== ""
        ? `/${props.currentUserID}/${props.currentCampaignID}`
        : ""
    );
  }, [props]);

  function toggleSidebar() {
    props.setSideBarHidden(!props.sideBarHidden);
  }

  return (
    <nav className="header__navbar">
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 md:hidden cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          onClick={toggleSidebar}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </div>
      <ul className="header__nav-item-container">
        <li
          className={`header__nav-item ${
            currentTab === "Journal" ? "header__selected" : ""
          }`}
          onClick={() => navigate(`/journal${idParameters}`)}
        >
          Journal
        </li>
        <li
          className={`header__nav-item ${
            currentTab === "Characters" ? "header__selected" : ""
          }`}
          onClick={() => navigate(`/characters${idParameters}`)}
        >
          Characters
        </li>
        <li
          className={`header__nav-item ${
            currentTab === "Locations" ? "header__selected" : ""
          }`}
          onClick={() => navigate(`/locations${idParameters}`)}
        >
          Locations
        </li>
        <li
          className={`header__nav-item   ${
            currentTab === "Stats" ? "header__selected" : ""
          }`}
          onClick={() => navigate(`/stats${idParameters}`)}
        >
          Stats
        </li>
        {user ? (
          <li
            className={`header__nav-item ${
              currentTab === "Campaign" ? "header__selected" : ""
            }`}
            onClick={() => navigate(`/campaign`)}
          >
            Campaign
          </li>
        ) : null}
      </ul>
      {/* <button onClick={() => testFunction()}>TEST</button> */}
      <button
        className="header__button"
        onClick={() => {
          props.setCurrentTab("");
          navigate("/login");
        }}
      >
        {user ? "Logout" : "Login"}
      </button>
    </nav>
  );
}

export default Header;
