import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import CampaignInfo from "./CampaignInfo";

function Campaign() {
  const [user, loading, error] = useAuthState(auth);
  const [campaigns, setCampaigns] = useState([]);
  const [currentCampaign, setCurrentCampaign] = useState("");
  const navigate = useNavigate();

  async function loadCampaigns() {
    //console.log(user);
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

  //   useEffect(() => {
  //     loadCampaigns();

  //     console.log(campaigns);
  //   }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login");
    if (user) loadCampaigns();
  }, [user, loading]);

  let populateCampaigns = campaigns.map((camp, index) => {
    return (
      <li
        className="cursor-pointer pl-2 pb-2"
        key={index}
        onClick={() => setCurrentCampaign(camp)}
      >
        {camp.name}
      </li>
    );
  });

  return (
    <div className="box-border flex h-[95vh] w-[100%]">
      <div className="p-3 w-[250px] bg-gray-700 text-gray-200 font-bold">
        <h2 className="select-none pb-4">Campaigns:</h2>
        <ul className="font-normal">
          {populateCampaigns}
          <li
            className="text-blue-400 cursor-pointer pl-2"
            onClick={() => setCurrentCampaign("new")}
          >
            + Create new campaign
          </li>
        </ul>
      </div>
      <CampaignInfo
        campaign={currentCampaign}
        user={user}
        key={currentCampaign.name}
      />
    </div>
  );
}

export default Campaign;
