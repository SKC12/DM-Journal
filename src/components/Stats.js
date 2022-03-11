import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import StatsInfo from "./StatsInfo";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCampaignsState,
  useCurrentCampaignState,
  useSessionState,
} from "../customHooks";
import Sidebar from "./Sidebar";

function Stats(props) {
  const setCurrentTab = props.setCurrentTab;
  const setCurrentCampaignID = props.setCurrentCampaignID;
  const setCurrentUserID = props.setCurrentUserID;
  const navigate = useNavigate();
  const params = useParams();
  const paramsUser = params.user ? params.user : params["*"].replace("/", "");
  const [user] = useAuthState(auth);
  const [campaigns] = useCampaignsState(paramsUser);
  const [currentCampaign, setCurrentCampaign] = useCurrentCampaignState(
    campaigns,
    params.campaign
  );
  const [sessions] = useSessionState(paramsUser, currentCampaign.name);
  const [stat, setStat] = useState("time");

  //Navigates to link containing User params
  useEffect(() => {
    if (!paramsUser && user) {
      navigate("/stats/" + user.uid);
    }
  }, [paramsUser, user, navigate]);

  //Updates current IDs on parent main element
  useEffect(() => {
    if (params.campaign) {
      setCurrentCampaignID(params.campaign);
    }
    if (paramsUser) {
      setCurrentUserID(paramsUser);
    }
  });

  //Updates currentTab on parent main element
  useEffect(() => {
    setCurrentTab("Stats");
  }, [setCurrentTab]);

  //Select change for sidebar campaign selector
  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
      props.setCurrentCampaignID(camp.name);
      navigate(`/stats/${user.uid}/${camp.name}`);
    }
  }

  function isPrivate(campaign) {
    if (!user || user.uid !== params.user) {
      return campaign.private;
    } else {
      return false;
    }
  }

  const renderStats = (
    <div>
      <ul className="pl-4 font-normal">
        <li
          className={`pb-2 cursor-pointer hover:text-gray-400 transition-colors duration-300 ${
            stat === "time" ? "text-gray-400" : ""
          }`}
          onClick={() => setStat("time")}
        >
          Sessions
        </li>
        <li
          className={`pb-2 cursor-pointer hover:text-gray-400 transition-colors duration-300 ${
            stat === "leveling" ? "text-gray-400" : ""
          }`}
          onClick={() => setStat("leveling")}
        >
          Levels
        </li>
        <li
          className={`pb-2 cursor-pointer hover:text-gray-400 transition-colors duration-300 ${
            stat === "ingameTime" ? "text-gray-400" : ""
          }`}
          onClick={() => setStat("ingameTime")}
        >
          Ingame Time
        </li>
      </ul>
    </div>
  );

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Stats:</h2>
      {currentCampaign !== "" ? (
        isPrivate(currentCampaign) ? (
          <ul className="text-gray-200 text-center">PRIVATE CAMPAIGN</ul>
        ) : (
          renderStats
        )
      ) : null}
    </div>
  );

  return (
    <div className="box-border flex md:h-[95vh] w-[100%]">
      <Sidebar
        campaigns={campaigns}
        currentCampaign={currentCampaign}
        handleSelectChange={handleSelectChange}
        content={sideBarContent}
        user={user}
        currentUserID={props.currentUserID}
        sideBarHidden={props.sideBarHidden}
      />
      <StatsInfo
        campaign={currentCampaign}
        sessions={sessions}
        user={user}
        stat={stat}
      />
    </div>
  );
}

export default Stats;
