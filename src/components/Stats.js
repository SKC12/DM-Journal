import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import StatsInfo from "./StatsInfo";
import { useParams, useNavigate } from "react-router-dom";
import {
  loadSessionsFromDatabase,
  loadCampaignsFromDatabase,
} from "../helpers.js";

function Stats(props) {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const [sessions, setSessions] = useState([]);
  const [stat, setStat] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const setCurrentTab = props.setCurrentTab;

  useEffect(() => {
    setCurrentTab("Stats");
  }, [setCurrentTab]);

  const populateSelectOptions = campaigns.map((camp, index) => {
    return (
      <option key={index} value={camp.name}>
        {camp.name}
      </option>
    );
  });

  //Load sessions on campaign change
  useEffect(() => {
    async function setSessionsState(userID, campaign) {
      let sessions = await loadSessionsFromDatabase(userID, campaign.name);
      setSessions(sessions);
    }
    if (user) {
      setSessionsState(user.uid, currentCampaign);
    }
  }, [currentCampaign, user]);

  function setInitialCampaign(campaignArray, userID, campaignName) {
    if (userID && campaignName) {
      let camp = campaignArray.find(
        (campaign) => campaign.name === campaignName
      );
      setCurrentCampaign(camp);
    }
  }

  useEffect(() => {
    //Sets up state for logged users
    async function setCampaignsState(userID) {
      let camps = await loadCampaignsFromDatabase(userID);
      setCampaigns(camps);
      setInitialCampaign(camps, params.user, params.campaign);
    }

    //Loads session list from parameters, sets up state and "global" IDs for non-users.
    async function anonymousLoading(userID, campaign) {
      let campArray = await loadCampaignsFromDatabase(userID);
      setCampaigns(campArray);
      let selectedCamp = campArray.find((camp) => camp.name === campaign);
      setCurrentCampaign(selectedCamp);
      let sessions = await loadSessionsFromDatabase(userID, campaign);
      setSessions(sessions);
      props.setCurrentUserID(params.user);
      props.setCurrentCampaignID(params.campaign);
    }

    if (error) return;
    if (loading) return;
    if (!user)
      if (params.user && params.campaign) {
        anonymousLoading(params.user, params.campaign);
      }
    if (user) {
      if (params.user === undefined) {
        props.setCurrentUserID(user.uid);
      }
      setCampaignsState(user.uid);
    }
  }, [user, loading, error, params, props]);

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

  const CampaignSelector = (
    <div>
      <h2 id="journal-select-label" className="select-none pb-4">
        Campaign:
      </h2>
      <select
        className="text-gray-700 text-sm px-2 py-0.5 mb-4 w-full rounded focus:text-gray-700 focus:border-gray-700 focus:outline-none"
        aria-label="journal-campaign-select"
        value={currentCampaign.name}
        onChange={handleSelectChange}
      >
        <option>--- Select a campaign ---</option>
        {populateSelectOptions}
      </select>
    </div>
  );

  return (
    <div className="box-border flex h-[95vh] w-[100%]">
      <div className="shrink-0 p-3 w-[250px] bg-gray-700 text-gray-200 font-bold">
        {user ? CampaignSelector : null}

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
