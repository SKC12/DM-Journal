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
    let sessionUser = "";
    !user || user.uid !== params.user
      ? (sessionUser = params.user)
      : (sessionUser = user.uid);

    if (prevCampaign === undefined) {
      loadSessions(sessionUser, currentCampaign);
    }
    if (
      prevCampaign !== undefined &&
      prevCampaign.name !== currentCampaign.name
    ) {
      loadSessions(sessionUser, currentCampaign);
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

export const useCampaignsState = (userID) =>
  //userID
  // setCurrentUserID,
  // setCurrentCampaignID
  {
    const [campaigns, setCampaigns] = useState([]);
    const navigate = useNavigate();
    const [hasLoaded, setHasLoaded] = useState(false);

    //Sets IDs in the main App state
    // const setCurrentIDsFromParameters = useCallback(
    //   (currentUserID, paramsUser, paramsCampaign) => {
    //     if (paramsUser === undefined && currentUserID) {
    //       setCurrentUserID(currentUserID);
    //     } else if (paramsUser) {
    //       setCurrentUserID(paramsUser);
    //     }
    //     if (paramsCampaign) {
    //       setCurrentCampaignID(paramsCampaign);
    //     }
    //   },
    //   [setCurrentCampaignID, setCurrentUserID]
    // );

    //Loads campaign list based on params or user.
    useEffect(() => {
      //console.log("LOADING", hasLoaded, userID, params.user);
      async function loadCampaigns(userID, navigate) {
        if (!hasLoaded) {
          let campArray = await loadCampaignsFromDatabase(userID, navigate);
          setCampaigns(campArray);
          setHasLoaded(true);
        }
      }
      if (userID) {
        //console.log("LOADING BY PARAMS");
        loadCampaigns(userID, navigate);
        // } else {
        //   if (userID) {
        //     //console.log("LOADING BY ID");
        //     loadCampaigns(userID, navigate);
        //   }
      }
      //setCurrentIDsFromParameters(userID, params.user, params.campaign);
    }, [navigate, hasLoaded, userID]);

    return [campaigns, setCampaigns];
  };
