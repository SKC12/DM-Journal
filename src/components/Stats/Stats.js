import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import React, { useEffect, useState } from "react";
import StatsInfo from "./StatsInfo";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import "../../style/main.css";

function Stats(props) {
  const loading = props.loading;
  const setCurrentTab = props.setCurrentTab;
  const navigate = useNavigate();
  const params = props.params;
  //console.log(params);
  const paramsUser = params.user;
  //params["*"].replace("/", "");
  const [user] = useAuthState(auth);
  const [campaigns] = props.campaignsState;
  const [currentCampaign, setCurrentCampaign] = props.currentCampaignState;
  const [sessions] = props.sessionsState;
  const [stat, setStat] = useState("time");

  //Navigates to link containing User params
  useEffect(() => {
    if (!paramsUser && user) {
      navigate("/stats/" + user.uid);
    }
  }, [paramsUser, user, navigate]);

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
      //props.setCurrentCampaignID(camp.name);
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
    <div className="">
      <ul className="generic__Sidebar">
        <li
          className={`Stats__sidebar-item  ${
            stat === "time" ? "Stats__selected" : ""
          }`}
          onClick={() => setStat("time")}
        >
          Sessions
        </li>
        {currentCampaign && currentCampaign.options.level ? (
          <li
            className={`Stats__sidebar-item ${
              stat === "leveling" ? "Stats__selected" : ""
            }`}
            onClick={() => setStat("leveling")}
          >
            Levels
          </li>
        ) : null}

        {currentCampaign && currentCampaign.options.ingameTime ? (
          <li
            className={`Stats__sidebar-item ${
              stat === "ingameTime" ? "Stats__selected" : ""
            }`}
            onClick={() => setStat("ingameTime")}
          >
            Ingame Time
          </li>
        ) : null}

        {currentCampaign && currentCampaign.options.arc ? (
          <li
            className={`Stats__sidebar-item ${
              stat === "arc" ? "Stats__selected" : ""
            }`}
            onClick={() => setStat("arc")}
          >
            Campaign Arcs
          </li>
        ) : null}
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
    <div className="main__container">
      <Sidebar
        campaigns={campaigns}
        currentCampaign={currentCampaign}
        handleSelectChange={handleSelectChange}
        content={sideBarContent}
        user={user}
        currentUserID={props.currentUserID}
        sideBarHidden={props.sideBarHidden}
      />
      {isPrivate(currentCampaign) ? null : loading ? null : (
        <StatsInfo
          campaign={currentCampaign}
          sessions={sessions}
          user={user}
          stat={stat}
        />
      )}
    </div>
  );
}

export default Stats;
