import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JournalInfo from "./JournalInfo";
import JounalCard from "./JournalCard";
import {
  useCampaignsState,
  useCurrentCampaignState,
  useSessionState,
} from "../customHooks";
import { isOwner } from "../helpers";
import Sidebar from "./Sidebar";

function Journal(props) {
  const setCurrentCampaignID = props.setCurrentCampaignID;
  const setCurrentUserID = props.setCurrentUserID;
  const setCurrentTab = props.setCurrentTab;
  const params = useParams();
  const paramsUser = params.user ? params.user : params["*"].replace("/", "");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [currentSession, setCurrentSession] = useState("");
  const [campaigns] = useCampaignsState(paramsUser);
  const [currentCampaign, setCurrentCampaign] = useCurrentCampaignState(
    campaigns,
    params.campaign
  );
  const [sessions, setSessions, loadingSessions] = useSessionState(
    paramsUser,
    currentCampaign.name
  );

  //Navigates to link containing User params
  useEffect(() => {
    if (!paramsUser && user) {
      navigate("/journal/" + user.uid);
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

  //Sets up initial session on sessions load
  useEffect(() => {
    if (sessions && sessions.length > 0) {
      setCurrentSession(sessions[0]);
    } else {
      setCurrentSession("");
    }
  }, [sessions]);

  //Updates currentTab on parent main element
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

  //Select change for sidebar campaign selector
  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
      //setCurrentCampaignID(camp.name);
      navigate(`/journal/${user.uid}/${camp.name}`);
    }
  }

  function isPrivate(campaign) {
    if (!user || user.uid !== paramsUser) {
      return campaign.private;
    } else {
      return false;
    }
  }

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Sessions:</h2>
      {isOwner(user, paramsUser) ? (
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
