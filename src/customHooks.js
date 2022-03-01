import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  loadSessionsFromDatabase,
  loadCampaignsFromDatabase,
} from "./helpers.js";

export const useSessionState = (user, currentCampaign, prevCampaign) => {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const loadSessions = useCallback(
    async (userID, campaign) => {
      if (campaign) {
        //console.log("LOADING SESSIONS");
        setLoadingSessions(true);
        let sessions = await loadSessionsFromDatabase(
          userID,
          campaign.name,
          navigate
        );
        setLoadingSessions(false);
        setSessions(sessions);
      }
    },
    [navigate]
  );

  //Changes session list on campaign change
  useEffect(() => {
    //console.log("CAMPAIGN CHANGE", prevCampaign, currentCampaign);
    if (prevCampaign === undefined) {
      loadSessions(params.user, currentCampaign);
    }
    if (
      prevCampaign !== undefined &&
      prevCampaign.name !== currentCampaign.name
    ) {
      //console.log("STEP 1");
      if (user) {
        //console.log("STEP 2");

        if (params.user && user.uid === params.user) {
          loadSessions(user.uid, currentCampaign);
        }
      }
    }
  }, [currentCampaign, user, prevCampaign, params.user, loadSessions]);

  return [sessions, setSessions, loadingSessions];
};

export const useCurrentCampaignState = (campaigns) => {
  const [currentCampaign, setCurrentCampaign] = useState("");
  const params = useParams();

  useEffect(() => {
    async function setInitialCampaign(campaignArray, userID, campaignName) {
      if (userID && campaignName) {
        let camp = campaignArray.find(
          (campaign) => campaign.name === campaignName
        );
        camp ? setCurrentCampaign(camp) : setCurrentCampaign("");
      }
    }

    if (params.user && params.campaign) {
      setInitialCampaign(campaigns, params.user, params.campaign);
    }
  }, [campaigns, params.user, params.campaign]);

  return [currentCampaign, setCurrentCampaign];
};

export const useCampaignsState = (
  userID,
  setCurrentUserID,
  setCurrentCampaignID
) => {
  const [campaigns, setCampaigns] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [hasLoaded, setHasLoaded] = useState(false);

  const setCurrentIDsFromParameters = useCallback(
    (currentUserID, paramsUser, paramsCampaign) => {
      //console.log("USER:", currentUser);
      if (paramsUser === undefined && currentUserID) {
        setCurrentUserID(currentUserID);
      } else if (paramsUser) {
        setCurrentUserID(paramsUser);
      }
      if (paramsCampaign) {
        setCurrentCampaignID(paramsCampaign);
      }
    },
    [setCurrentCampaignID, setCurrentUserID]
  );

  //Loads campaign list based on params or user.
  useEffect(() => {
    async function loadCampaigns(userID, navigate) {
      if (!hasLoaded) {
        //console.log("HERE", hasLoaded, userID);
        let campArray = await loadCampaignsFromDatabase(userID, navigate);
        setCampaigns(campArray);
        setHasLoaded(true);
      }
    }

    if (params.user && params.campaign) {
      loadCampaigns(params.user, navigate);
    } else {
      if (userID) {
        console.log("2");

        loadCampaigns(userID, navigate);
      }
    }
    //}
    setCurrentIDsFromParameters(userID, params.user, params.campaign);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params.user,
    params.campaign,
    navigate,
    hasLoaded,
    setCurrentIDsFromParameters,
  ]);

  return [campaigns, setCampaigns];
};
