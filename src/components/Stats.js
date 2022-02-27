import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState, useRef, useCallback } from "react";
import StatsInfo from "./StatsInfo";
import { useParams, useNavigate } from "react-router-dom";
import {
  loadSessionsFromDatabase,
  loadCampaignsFromDatabase,
} from "../helpers.js";
import CampaignSelector from "./CampaignSelector";

function Stats(props) {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const prevCampaign = usePrevious(currentCampaign);

  const [sessions, setSessions] = useState([]);
  const [stat, setStat] = useState("");
  const navigate = useNavigate();
  const params = useParams();
  const setCurrentTab = props.setCurrentTab;
  const setCurrentCampaignID = props.setCurrentCampaignID;
  const setCurrentUserID = props.setCurrentUserID;

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

  //Load sessions on campaign change
  useEffect(() => {
    async function setSessionsState(userID, campaign) {
      let sessions = await loadSessionsFromDatabase(
        userID,
        campaign.name,
        navigate
      );
      setSessions(sessions);
    }
    if (
      prevCampaign !== undefined &&
      prevCampaign.name !== currentCampaign.name
    ) {
      if (user) {
        if (params.user && user.uid === params.user) {
          setSessionsState(user.uid, currentCampaign);
        }
      }
    }
  }, [currentCampaign, user, prevCampaign, params.user, navigate]);

  function setInitialCampaign(campaignArray, userID, campaignName) {
    if (userID && campaignName) {
      let camp = campaignArray.find(
        (campaign) => campaign.name === campaignName
      );
      camp ? setCurrentCampaign(camp) : setCurrentCampaign("");
    }
  }

  const setCurrentIDsFromParameters = useCallback(
    (currentUser, paramsUser, paramsCampaign) => {
      if (paramsUser === undefined) {
        setCurrentUserID(currentUser.uid);
      } else if (paramsUser) {
        setCurrentUserID(paramsUser);
      }
      if (paramsCampaign) {
        setCurrentCampaignID(paramsCampaign);
      }
    },
    [setCurrentCampaignID, setCurrentUserID]
  );

  useEffect(() => {
    //Sets up state for logged users
    async function setCampaignsState(userID) {
      setCurrentIDsFromParameters(user, params.user, params.campaign);

      let camps = await loadCampaignsFromDatabase(userID, navigate);
      setCampaigns(camps);
      setInitialCampaign(camps, params.user, params.campaign);
    }

    //Loads session list from parameters, sets up state and "global" IDs for non-users.
    async function anonymousLoading(userID, campaign) {
      //console.log("ANONYMOUS");
      let campArray = await loadCampaignsFromDatabase(userID);
      setCampaigns(campArray);
      let selectedCamp = campArray.find((camp) => camp.name === campaign);
      selectedCamp ? setCurrentCampaign(selectedCamp) : setCurrentCampaign("");
      let sessions = await loadSessionsFromDatabase(userID, campaign, navigate);
      setSessions(sessions);
      setCurrentUserID(params.user);
      setCurrentCampaignID(params.campaign);
    }

    if (error) return;
    if (loading) return;
    if (!user)
      if (params.user && params.campaign) {
        anonymousLoading(params.user, params.campaign);
      }
    if (user) {
      if (params.user && params.campaign && user.uid !== params.user) {
        anonymousLoading(params.user, params.campaign);
      } else {
        if (params.user === undefined) {
          setCurrentUserID(user.uid);
        }
        setCampaignsState(user.uid);
      }
    }
  }, [
    user,
    loading,
    error,
    params.campaign,
    params.user,
    setCurrentUserID,
    setCurrentCampaignID,
    setCurrentIDsFromParameters,
    navigate,
  ]);

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
    <div className="box-border flex h-[95vh] w-[100%]">
      <div className="shrink-0 p-3 w-[250px] bg-gray-700 text-gray-200 font-bold">
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
