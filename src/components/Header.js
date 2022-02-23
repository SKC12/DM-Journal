import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

// import annalData from "../entries.json";

// import { nanoid } from "nanoid";

// import {
//   collection,
//   doc,
//   setDoc,
//   query,
//   where,
//   getDocs,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";

const NAV_ITEM_STYLE =
  "w-32 text-gray-600 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-lg flex items-center justify-center";

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

  return (
    <nav className="md:flex flex-row items-center justify-between px-9 h-[5vh] bg-gray-50">
      <span className="text-5xl text-gray-800 -mb-1"></span>
      <ul className="flex flex-row self-center h-12">
        <li
          className={`${NAV_ITEM_STYLE}  ${
            currentTab === "Journal" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate(`/journal${idParameters}`)}
        >
          Journal
        </li>
        <li
          className={`${NAV_ITEM_STYLE}  ${
            currentTab === "Stats" ? "bg-gray-300" : ""
          }`}
          onClick={() => navigate(`/stats${idParameters}`)}
        >
          Stats
        </li>
        {user ? (
          <li
            className={`${NAV_ITEM_STYLE}  ${
              currentTab === "Campaign" ? "bg-gray-300" : ""
            }`}
            onClick={() => navigate(`/campaign`)}
          >
            Campaign
          </li>
        ) : null}
      </ul>
      {/* <button onClick={() => testFunction()}>TEST</button> */}
      <button
        className="w-20 bg-white hover:bg-gray-50 border-2 border-gray-900 text-sm text-gray-900 py-1 px-3 rounded-lg font-medium tracking-wide leading-none"
        onClick={() => navigate("/login")}
      >
        {user ? "Logout" : "Login"}
      </button>
    </nav>
  );
}

export default Header;
