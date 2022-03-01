import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
import StatsInfo from "./StatsInfo";
import { useParams, useNavigate } from "react-router-dom";

import CampaignSelector from "./CampaignSelector";
import {
  useCampaignsState,
  useCurrentCampaignState,
  useSessionState,
} from "../customHooks";

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
  const [stat, setStat] = useState("");
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

  function isOwner() {
    if (!user) {
      return false;
    } else if (user.uid === props.currentUserID) {
      return true;
    }
    return false;
  }

  const renderStats = (
    <div>
      <ul className="pl-4 font-normal">
        <li
          className={`pb-2 cursor-pointer ${
            stat === "time" ? "text-gray-400" : ""
          }`}
          onClick={() => setStat("time")}
        >
          Time
        </li>
        <li
          className={`pb-2 cursor-pointer ${
            stat === "leveling" ? "text-gray-400" : ""
          }`}
          onClick={() => setStat("leveling")}
        >
          Levels
        </li>
        <li
          className={`pb-2 cursor-pointer ${
            stat === "ingameTime" ? "text-gray-400" : ""
          }`}
          onClick={() => setStat("ingameTime")}
        >
          Ingame Time
        </li>
      </ul>
    </div>
  );

  return (
    <div className="box-border flex md:h-[95vh] w-[100%]">
      <div
        className={`${
          props.sideBarHidden ? "hidden" : "block"
        } absolute md:relative h-full p-3 md:block w-[250px] shrink-0 bg-gray-700 text-gray-200 font-bold z-50`}
      >
        {isOwner() ? (
          <CampaignSelector
            campaigns={campaigns}
            currentCampaign={currentCampaign}
            handleSelectChange={handleSelectChange}
          />
        ) : user ? (
          <div
            className="py-4 italic text-lg cursor-pointer"
            onClick={() => {
              props.setCurrentCampaignID("");
              props.setCurrentUserID("");
              navigate("/stats");
            }}
          >
            Return
          </div>
        ) : null}
        <h2 className="select-none pb-4">Stats:</h2>
        {currentCampaign !== "" ? (
          isPrivate(currentCampaign) ? (
            <ul className="text-gray-200 text-center">PRIVATE CAMPAIGN</ul>
          ) : (
            renderStats
          )
        ) : null}
      </div>
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
