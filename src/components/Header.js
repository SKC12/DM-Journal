import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const NAV_ITEM_STYLE =
  "md:text-xl  w-fit p-2 md:w-32   text-gray-500  cursor-pointer font-bold md:tracking-wide flex items-center justify-center";

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
    <nav className="flex flex-row items-center justify-between px-2 md:px-9 h-[7vh] md:h-[5vh] bg-gray-50">
      <div className="">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500 md:hidden cursor-pointer"
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
      <ul className="flex flex-row self-center h-[7vh] md:h-[5vh]">
        <li
          className={`header__nav-item ${NAV_ITEM_STYLE} ${
            currentTab === "Journal" ? "header__selected bg-gray-300 " : ""
          }`}
          onClick={() => navigate(`/journal${idParameters}`)}
        >
          Journal
        </li>
        <li
          className={`header__nav-item ${NAV_ITEM_STYLE}  ${
            currentTab === "Stats" ? "header__selected bg-gray-300" : ""
          }`}
          onClick={() => navigate(`/stats${idParameters}`)}
        >
          Stats
        </li>
        {user ? (
          <li
            className={`header__nav-item ${NAV_ITEM_STYLE}  ${
              currentTab === "Campaign" ? "header__selected bg-gray-300" : ""
            }`}
            onClick={() => navigate(`/campaign`)}
          >
            Campaign
          </li>
        ) : null}
      </ul>
      {/* <button onClick={() => testFunction()}>TEST</button> */}
      <button
        className="md:w-20 bg-gray-700 hover:text-white border-2 border-gray-900 text-xs md:text-sm text-gray-200 py-1 px-1 md:px-3 rounded-md md:rounded-lg font-medium leading-none"
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
