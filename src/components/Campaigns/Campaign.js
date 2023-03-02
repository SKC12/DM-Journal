import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import React, { useEffect } from "react";
import CampaignInfo from "./CampaignInfo";
import "../../style/main.css";
import { useNavigate } from "react-router-dom";

function Campaign(props) {
  const navigate = useNavigate();
  const params = props.params;
  const [user] = useAuthState(auth);
  const [campaigns, setCampaigns, loadingCampaigns] = props.campaignsState;
  const [currentCampaign, setCurrentCampaign] = props.currentCampaignState;
  const setCurrentTab = props.setCurrentTab;

  //Navigates to link containing User params
  useEffect(() => {
    if (!params.user && user) {
      navigate("/campaigns/" + user.uid);
    }
  }, [params.user, user, navigate]);

  useEffect(() => {
    setCurrentTab("Campaign");
  }, [setCurrentTab]);

  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      setCurrentCampaign(campaigns[0]);
    } else {
      setCurrentCampaign("");
    }
  }, [campaigns, setCurrentCampaign]);

  let populateCampaigns = campaigns.map((camp, index) => {
    return (
      <li
        className={`Stats__sidebar-item ${
          currentCampaign.name === camp.name ? "Stats__selected" : ""
        }`}
        key={index}
        onClick={() => setCurrentCampaign(camp)}
      >
        {camp.name}
      </li>
    );
  });

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Campaigns:</h2>
      <ul className="generic__Sidebar">
        {loadingCampaigns ? (
          <p className="text-gray-500 h-12 flex items-center justify-center">
            LOADING...
          </p>
        ) : (
          populateCampaigns
        )}
        <li
          className="text-blue-400 cursor-pointer p-2"
          onClick={() => setCurrentCampaign("new")}
        >
          + Create new campaign
        </li>
      </ul>
    </div>
  );

  return (
    <div className="main__container">
      <div
        className={`${
          props.sideBarHidden ? "hidden" : "block"
        } Sidebar__sidebar `}
      >
        {sideBarContent}
      </div>
      <CampaignInfo
        campaign={currentCampaign}
        setCampaign={setCurrentCampaign}
        campaigns={campaigns}
        setCampaigns={setCampaigns}
        user={user}
        navigate={navigate}
        key={"CI" + currentCampaign.name}
      />
    </div>
  );
}

export default Campaign;
