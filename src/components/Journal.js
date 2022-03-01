import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JournalInfo from "./JournalInfo";
import JounalCard from "./JournalCard";
import CampaignSelector from "./CampaignSelector";
import {
  useCampaignsState,
  useCurrentCampaignState,
  useSessionState,
} from "../customHooks";

function Journal(props) {
  const setCurrentCampaignID = props.setCurrentCampaignID;
  const setCurrentUserID = props.setCurrentUserID;
  const setCurrentTab = props.setCurrentTab;
  const [user] = useAuthState(auth);
  const [currentSession, setCurrentSession] = useState("");
  const [campaigns] = useCampaignsState(
    user ? user.uid : "",
    setCurrentUserID,
    setCurrentCampaignID
  );
  const [currentCampaign, setCurrentCampaign] =
    useCurrentCampaignState(campaigns);
  const prevCampaign = usePrevious(currentCampaign);
  const [sessions, setSessions, loadingSessions] = useSessionState(
    user,
    currentCampaign,
    prevCampaign
  );
  const params = useParams();
  const navigate = useNavigate();

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
              navigate(`/journal/${user.uid}`);
              window.location.reload();
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
