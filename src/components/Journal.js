import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import JournalInfo from "./JournalInfo";

function Journal() {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState("");

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

  const populateSelectOptions = campaigns.map((camp, index) => {
    return (
      <option key={index} value={camp.name}>
        {camp.name}
      </option>
    );
  });

  const populateJournal = sessions.map((entry, index) => {
    return (
      <li
        className="cursor-pointer pl-2 pb-2"
        key={index}
        onClick={() => setCurrentCampaign(entry)}
      >
        {entry.name}
      </li>
    );
  });

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (user) loadCampaigns();
  }, [user, loading]);

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
        <ul className="font-normal">
          {populateJournal}
          <li
            className="text-blue-400 cursor-pointer pl-2"
            onClick={() => setCurrentSession("new")}
          >
            + New session
          </li>
        </ul>
      </div>
      <JournalInfo
        campaign={currentCampaign}
        session={currentSession}
        user={user}
        key={currentSession.name}
      />
    </div>
  );
}

export default Journal;
