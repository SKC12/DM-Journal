import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import JournalInfo from "./JournalInfo";
import JounalCard from "./JournalCard";

function Journal(props) {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  //Populates the campaign selector
  const populateSelectOptions = campaigns
    ? campaigns.map((camp, index) => {
        return (
          <option key={index} value={camp.name}>
            {camp.name}
          </option>
        );
      })
    : null;

  //Populates the journal with individual session cards
  const populateJournal = sessions.map((entry, index) => {
    return (
      <JounalCard
        session={entry}
        key={entry.name}
        sessionNumber={index + 1}
        onClickEvent={setCurrentSession}
      />
    );
  });

  //Loads session array from Database
  async function loadSessions(userID, camp) {
    let sessionsArray = [];
    const query = await getDocs(
      collection(
        db,
        "users/" + userID + "/campaigns/" + camp.name + "/sessions"
      )
    );
    query.forEach((doc) => {
      sessionsArray.push(doc.data());
    });
    sessionsArray.sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    setSessions(sessionsArray);
  }

  useEffect(() => {
    if (user) loadSessions(user.uid, currentCampaign);
  }, [currentCampaign, user]);

  //Load campaigns array from database
  async function loadCampaigns(userID) {
    let campArray = [];
    const query = await getDocs(
      collection(db, "users/" + userID + "/campaigns")
    );
    query.forEach((doc) => {
      campArray.push(doc.data());
    });
    return campArray;
  }

  function setInitialCampaign(campaignArray, userID, campaignName) {
    //console.log(campaignArray);
    //console.log(campaignName);
    if (userID && campaignName) {
      let camp = campaignArray.find(
        (campaign) => campaign.name === campaignName
      );
      //console.log(camp);
      setCurrentCampaign(camp);
    }
  }

  useEffect(() => {
    async function setCampaignsState(userID) {
      let camps = await loadCampaigns(userID);
      //console.log(camps);
      setCampaigns(camps);
      setInitialCampaign(camps, params.user, params.campaign);
    }

    if (error) return;
    if (loading) return;
    if (!user) return;
    if (user) {
      console.log(params.user);
      if (params.user === undefined) {
        props.setCurrentUserID(user.uid);
      }
      //console.log(props.currentUserID);
      setCampaignsState(user.uid);
      //console.log(campaigns);
    }
  }, [user, loading, error, props, params]);

  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
      props.setCurrentCampaignID(camp.name);
      navigate(`/journal/${user.uid}/${camp.name}`);
    }
    console.log(params);
  }

  return (
    <div className="box-border flex h-[95vh] w-[100%]">
      <div className="p-3 w-[250px] bg-gray-700 text-gray-200 font-bold">
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
        <h2 className="select-none pb-4">Sessions:</h2>
        <div
          className="text-blue-400 cursor-pointer pl-2 pb-2"
          onClick={() => setCurrentSession("new")}
        >
          + New session
        </div>
        <div className="bg-gray-300 overflow-y-auto rounded max-h-80">
          <ul className="font-normal">{populateJournal}</ul>
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
