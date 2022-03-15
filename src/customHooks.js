import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadSessionsFromDatabase,
  loadCampaignsFromDatabase,
  loadCharactersFromDatabase,
} from "./helpers.js";

export const useSessionState = (userID, campaignName) => {
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const navigate = useNavigate();

  //Loads session list based on params
  const loadSessions = useCallback(
    async (userID, campaignName) => {
      if (campaignName) {
        setLoadingSessions(true);
        let sessions = await loadSessionsFromDatabase(
          userID,
          campaignName,
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
    if (campaignName && userID) {
      loadSessions(userID, campaignName);
    }
  }, [campaignName, userID, loadSessions]);

  return [sessions, setSessions, loadingSessions];
};

export const useCharacterState = (userID, campaignName) => {
  const [characters, setCharacters] = useState([]);
  const [loadingCharacters, setLoadingCharacters] = useState(false);
  const navigate = useNavigate();

  //Loads session list based on params
  const loadCharacters = useCallback(
    async (userID, campaignName) => {
      if (campaignName) {
        setLoadingCharacters(true);
        let characters = await loadCharactersFromDatabase(
          userID,
          campaignName,
          navigate
        );
        setLoadingCharacters(false);
        setCharacters(characters);
      }
    },
    [navigate]
  );

  //Changes session list on campaign change
  useEffect(() => {
    if (campaignName && userID) {
      loadCharacters(userID, campaignName);
    }
  }, [campaignName, userID, loadCharacters]);

  return [characters, setCharacters, loadingCharacters];
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
  const navigate = useNavigate();
  const [hasLoaded, setHasLoaded] = useState(false);

  //Loads campaign list based on params
  useEffect(() => {
    async function loadCampaigns(userID, navigate) {
      if (!hasLoaded) {
        let campArray = await loadCampaignsFromDatabase(userID, navigate);
        setCampaigns(campArray);
        setHasLoaded(true);
      }
    }
    if (userID) {
      loadCampaigns(userID, navigate);
    }
  }, [navigate, hasLoaded, userID]);

  return [campaigns, setCampaigns];
};
