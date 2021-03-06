import { useCallback, useEffect, useState } from "react";
import {
  loadFromFirebase,
  loadCampaignsFromDatabase,
  sortSessionsByDate,
} from "./helpers.js";

export const useSessionState = (userID, campaignName) => {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [hasError, setHasError] = useState(false);

  //Loads session list based on params
  const loadSessions = useCallback(async (userID, campaignName) => {
    if (campaignName) {
      setLoadingSessions(true);
      try {
        let sessions = await loadFromFirebase("sessions", userID, campaignName);
        sortSessionsByDate(sessions);
        setSessions(sessions);
        setLoadingSessions(false);
      } catch (e) {
        setHasError(true);
        throw e;
      }
    }
  }, []);

  //Changes session list on campaign change
  useEffect(() => {
    if (campaignName && userID) {
      loadSessions(userID, campaignName);
    }
  }, [campaignName, userID, loadSessions]);

  //console.log("CURRENT SESSION STATE", [campaignName, userID, loadSessions]);

  return [sessions, setSessions, loadingSessions, hasError];
};

export const useCharacterState = (userID, campaignName) => {
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const [hasError, setHasError] = useState(false);

  //Loads session list based on params
  const loadCharacters = useCallback(async (userID, campaignName) => {
    if (campaignName) {
      setLoadingCharacters(true);
      try {
        let characters = await loadFromFirebase(
          "characters",
          userID,
          campaignName
        );
        setCharacters(characters);
        setLoadingCharacters(false);
      } catch (e) {
        setHasError(true);
        throw e;
      }
    }
  }, []);

  //Changes character list on campaign change
  useEffect(() => {
    if (campaignName && userID) {
      loadCharacters(userID, campaignName);
    }
  }, [campaignName, userID, loadCharacters]);

  return [characters, setCharacters, loadingCharacters, hasError];
};

export const useLocationState = (userID, campaignName) => {
  const [locations, setLocations] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [hasError, setHasError] = useState(false);

  //Loads session list based on params
  const loadLocations = useCallback(async (userID, campaignName) => {
    if (campaignName) {
      setLoadingLocations(true);
      try {
        let locations = await loadFromFirebase(
          "locations",
          userID,
          campaignName
        );
        setLocations(locations);
        setLoadingLocations(false);
      } catch (e) {
        setHasError(true);
        throw e;
      }
    }
  }, []);

  //Changes location list on campaign change
  useEffect(() => {
    if (campaignName && userID) {
      loadLocations(userID, campaignName);
    }
  }, [campaignName, userID, loadLocations]);

  return [locations, setLocations, loadingLocations, hasError];
};

export const useCurrentCampaignState = (campaigns, campaignName) => {
  const [currentCampaign, setCurrentCampaign] = useState("");

  useEffect(() => {
    async function setCampaign(campaignArray, campaignName) {
      if (campaignName) {
        let camp = campaignArray.find(
          (campaign) => campaign.name === campaignName
        );
        camp ? setCurrentCampaign(camp) : setCurrentCampaign("");
      }
    }

    if (campaignName) {
      setCampaign(campaigns, campaignName);
    }
  }, [campaigns, campaignName]);

  return [currentCampaign, setCurrentCampaign];
};

export const useCampaignsState = (userID) => {
  const [campaigns, setCampaigns] = useState([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  //Loads campaign list based on params
  useEffect(() => {
    async function loadCampaigns(userID) {
      if (!hasLoaded) {
        try {
          let campArray = await loadCampaignsFromDatabase(userID);
          setCampaigns(campArray);
          setHasLoaded(true);
        } catch (e) {
          setHasError(true);
          throw e;
        }
      }
    }
    if (userID) {
      loadCampaigns(userID);
    }
  }, [hasLoaded, userID]);

  return [campaigns, setCampaigns, hasError];
};
