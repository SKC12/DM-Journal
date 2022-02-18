import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
//import { Link, Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import JournalInfo from "./JournalInfo";
import JounalCard from "./JournalCard";

function Journal() {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");

  const populateSelectOptions = campaigns.map((camp, index) => {
    return (
      <option key={index} value={camp.name}>
        {camp.name}
      </option>
    );
  });

  const populateJournal = sessions.map((entry, index) => {
    return (
      <JounalCard
        session={entry}
        key={entry.name}
        sessionNumber={index + 1}
        onClickEvent={setCurrentSession}
      />
      // <li
      //   className="cursor-pointer pl-2 pb-2 text-gray-700"
      //   key={index}
      //   onClick={() => setCurrentSession(entry)}
      // >
      //   {entry.name}
      // </li>
    );
  });

  useEffect(() => {
    async function loadSessions(camp) {
      //console.log(user);
      let sessionsArray = [];
      const query = await getDocs(
        collection(
          db,
          "users/" + user.uid + "/campaigns/" + camp.name + "/sessions"
        )
      );
      query.forEach((doc) => {
        sessionsArray.push(doc.data());
      });
      //console.log(campArray);
      sessionsArray.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setSessions(sessionsArray);
    }

    if (user) loadSessions(currentCampaign);
  }, [currentCampaign, user]);

  useEffect(() => {
    async function loadCampaigns() {
      let campArray = [];
      const query = await getDocs(
        collection(db, "users/" + user.uid + "/campaigns")
      );
      query.forEach((doc) => {
        campArray.push(doc.data());
      });
      //console.log(campArray);
      setCampaigns(campArray);
    }

    if (error) return;
    if (loading) return;
    if (!user) return;
    if (user) loadCampaigns();
  }, [user, loading, error]);

  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
    }
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
