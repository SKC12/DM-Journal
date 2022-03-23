import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignInfo from "./CampaignInfo";
import { loadCampaignsFromDatabase } from "../helpers.js";
import "../style/main.css";

function Campaign(props) {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const navigate = useNavigate();
  const setCurrentTab = props.setCurrentTab;

  useEffect(() => {
    setCurrentTab("Campaign");
  }, [setCurrentTab]);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setCurrentCampaign(campaigns[0]);
    } else {
      setCurrentCampaign("");
    }
  }, [campaigns]);

  useEffect(() => {
    async function setCampaignsState(userID) {
      let camps = await loadCampaignsFromDatabase(userID, navigate);
      setCampaigns(camps);
    }

    if (error) return;
    if (loading) return;
    if (!user) navigate("/login");
    if (user) setCampaignsState(user.uid);
  }, [user, loading, error, navigate]);

  let populateCampaigns = campaigns.map((camp, index) => {
    return (
      <li
        className={`cursor-pointer p-2 hover:text-gray-400 ${
          currentCampaign.name === camp.name ? "text-gray-400" : ""
        }`}
        key={index}
        onClick={() => setCurrentCampaign(camp)}
      >
        {camp.name}
      </li>
    );
  });

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Campaigns:</h2>
      <ul className="font-normal">
        {populateCampaigns}
        <li
          className="text-blue-400 cursor-pointer p-2"
          onClick={() => setCurrentCampaign("new")}
        >
          + Create new campaign
        </li>
      </ul>
    </div>
  );

  return (
    <div className="main__container">
      <div
        className={`${
          props.sideBarHidden ? "hidden" : "block"
        } absolute md:relative h-full p-3 md:block w-[250px] shrink-0 bg-gray-700 text-gray-200 font-bold z-50`}
      >
        {sideBarContent}
      </div>
      <CampaignInfo
        campaign={currentCampaign}
        user={user}
        key={"CI" + currentCampaign.name}
      />
    </div>
  );
}

export default Campaign;
