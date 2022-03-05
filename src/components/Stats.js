import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
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
  const [user] = useAuthState(auth);
  const [campaigns] = useCampaignsState(
    user ? user.uid : "",
    setCurrentUserID,
    setCurrentCampaignID
  );
  const [currentCampaign, setCurrentCampaign] =
    useCurrentCampaignState(campaigns);
  const prevCampaign = usePrevious(currentCampaign);

  const [sessions] = useSessionState(user, currentCampaign, prevCampaign);
  const [stat, setStat] = useState("time");
  const navigate = useNavigate();
  const params = useParams();

  function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  }

  useEffect(() => {
    setCurrentTab("Stats");
  }, [setCurrentTab]);

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
