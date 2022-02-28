import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JournalInfo from "./JournalInfo";
import JounalCard from "./JournalCard";
import {
  loadSessionsFromDatabase,
  loadCampaignsFromDatabase,
} from "../helpers.js";
import CampaignSelector from "./CampaignSelector";

function Journal(props) {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const prevCampaign = usePrevious(currentCampaign);
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
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
    setCurrentTab("Journal");
  }, [setCurrentTab]);

  //Populates the journal with individual session cards
  function populateJournal() {
    let sessionJournalCards = sessions.map((entry, index) => {
      return (
        <JounalCard
          current={currentSession}
          session={entry}
          key={entry.name}
          sessionNumber={index + 1}
          onClickEvent={setCurrentSession}
        />
      );
    });

    return sessionJournalCards;
  }

  //Changes session list on campaign change
  useEffect(() => {
    async function setSessionsState(userID, campaign) {
      setLoadingSessions(true);
      let sessions = await loadSessionsFromDatabase(
        userID,
        campaign.name,
        navigate
      );
      setLoadingSessions(false);
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
      return camp;
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
      //console.log("USER");
      setCurrentIDsFromParameters(user, params.user, params.campaign);

      let camps = await loadCampaignsFromDatabase(userID, navigate);

      setCampaigns(camps);
      setInitialCampaign(camps, params.user, params.campaign);
    }

    //Loads session list from parameters, sets up state and "global" IDs.
    async function anonymousLoading(userID, campaign) {
      //console.log("ANONYMOUS");

      let campArray = await loadCampaignsFromDatabase(userID, navigate);

      //console.log(campArray);

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
      //If there are url parameters, but the campaign belongs to another
      if (params.user && params.campaign && user.uid !== params.user) {
        //console.log("DIFFERENT USER");
        anonymousLoading(params.user, params.campaign);
      } else {
        setCampaignsState(user.uid);
      }
    }
  }, [
    user,
    loading,
    error,
    params.campaign,
    params.user,
    setCurrentCampaignID,
    setCurrentUserID,
    setCurrentIDsFromParameters,
    navigate,
  ]);

  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
      setCurrentCampaignID(camp.name);
      navigate(`/journal/${user.uid}/${camp.name}`);
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

  function isPrivate(campaign) {
    if (!user || user.uid !== params.user) {
      return campaign.private;
    } else {
      return false;
    }
  }

  return (
    <div className="box-border flex md:h-[95vh] w-[100%]">
      <div
        className={`${
          props.sideBarHidden ? "hidden" : "block"
        } absolute md:relative h-full p-3 md:block w-[250px] shrink-0 bg-gray-700 text-gray-200 font-bold`}
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
              navigate("/journal");
            }}
          >
            Return
          </div>
        ) : null}

        <h2 className="select-none pb-4">Sessions:</h2>
        {isOwner() ? (
          <div
            className="text-blue-400 cursor-pointer pl-2 pb-2"
            onClick={() => setCurrentSession("new")}
          >
            + New session
          </div>
        ) : null}

        <div className="bg-gray-300 overflow-y-auto rounded max-h-[50vh]">
          {isPrivate(currentCampaign) ? (
            <ul className="text-gray-800 text-center">PRIVATE CAMPAIGN</ul>
          ) : loadingSessions ? (
            <p className="text-gray-500 text-center">LOADING...</p>
          ) : (
            <ul className="font-normal">{populateJournal()}</ul>
          )}
        </div>
      </div>
      <JournalInfo
        campaign={currentCampaign}
        session={currentSession}
        sessions={sessions}
        setSessions={setSessions}
        user={user}
        key={currentSession.name}
      />
    </div>
  );
}

export default Journal;
