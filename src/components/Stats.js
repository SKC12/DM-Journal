import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import StatsInfo from "./StatsInfo";

function Stats() {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const [sessions, setSessions] = useState([]);
  const [stat, setStat] = useState("");

  const populateSelectOptions = campaigns.map((camp, index) => {
    return (
      <option key={index} value={camp.name}>
        {camp.name}
      </option>
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

  const renderStats = (
    <div>
      <ul className="pl-4 font-normal">
        <li className="pb-2 cursor-pointer" onClick={() => setStat("time")}>
          Time
        </li>
        <li className="pb-2 cursor-pointer" onClick={() => setStat("leveling")}>
          Leveling
        </li>
        <li
          className="pb-2 cursor-pointer"
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

        <h2 className="select-none pb-4">Stats:</h2>
        {currentCampaign !== "" ? renderStats : null}
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
