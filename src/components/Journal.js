import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JournalInfo from "./JournalInfo";
import JounalCard from "./JournalCard";
import { isOwner } from "../helpers";
import Sidebar from "./Sidebar";
import "../style/main.css";

function Journal(props) {
  const setCurrentTab = props.setCurrentTab;
  const params = props.params;
  const paramsUser = params.user ? params.user : params["*"].replace("/", "");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [currentSession, setCurrentSession] = props.currentSessionState;
  const [campaigns] = props.campaignsState;
  const [currentCampaign, setCurrentCampaign] = props.currentCampaignState;
  const [sessions, setSessions, loadingSessions] = props.sessionsState;

  //Navigates to link containing User params
  useEffect(() => {
    if (!paramsUser && user) {
      navigate("/journal/" + user.uid);
    }
  }, [paramsUser, user, navigate]);

  //Sets up initial session on sessions load
  useEffect(() => {
    if (params.item) {
      let currentItem = sessions.find((char) => char.name === params.item);
      if (currentItem) {
        setCurrentSession(currentItem);
      }
    }
    if (!currentSession && !params.item) {
      if (sessions && sessions.length > 0) {
        setCurrentSession(sessions[0]);
      } else {
        setCurrentSession("");
      }
    }
  }, [sessions, currentSession, params.item, setCurrentSession]);

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
          key={"JC" + entry.name}
          sessionNumber={index + 1}
          onClickEvent={() =>
            navigate(`/journal/${user.uid}/${params.campaign}/${entry.name}`)
          }
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

      <div className="generic__Sidebar">
        {isPrivate(currentCampaign) ? (
          <ul className="text-gray-800 text-center">PRIVATE CAMPAIGN</ul>
        ) : loadingSessions ? (
          <p className="text-gray-500 h-12 flex items-center justify-center">
            LOADING...
          </p>
        ) : (
          <ul className="font-normal">{populateJournal()}</ul>
        )}
      </div>
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
      {isPrivate(currentCampaign) ? null : (
        <JournalInfo
          campaign={currentCampaign}
          session={currentSession}
          setSession={setCurrentSession}
          sessions={sessions}
          setSessions={setSessions}
          characters={props.characters}
          locations={props.locations}
          user={user}
          key={"JI" + currentSession.name}
        />
      )}
    </div>
  );
}

export default Journal;
