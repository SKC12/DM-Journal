import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useCampaignsState,
  useCurrentCampaignState,
  useCharacterState,
} from "../customHooks";
import { isOwner } from "../helpers";
import Sidebar from "./Sidebar";
import "../style/main.css";
import CharacterInfo from "./CharacterInfo";
import CharacterCard from "./CharacterCard";
import Accordion from "./Accordion";

function Characters(props) {
  const setCurrentCampaignID = props.setCurrentCampaignID;
  const setCurrentUserID = props.setCurrentUserID;
  const setCurrentTab = props.setCurrentTab;
  const params = useParams();
  const paramsUser = params.user ? params.user : params["*"].replace("/", "");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [campaigns] = useCampaignsState(paramsUser);
  const [currentCampaign, setCurrentCampaign] = useCurrentCampaignState(
    campaigns,
    params.campaign
  );
  const [currentCharacter, setCurrentCharacter] = useState("");
  const [characters, setCharacters, loadingCharacters] = useCharacterState(
    paramsUser,
    currentCampaign.name
  );

  //Navigates to link containing User params
  useEffect(() => {
    if (!paramsUser && user) {
      navigate("/characters/" + user.uid);
    }
  }, [paramsUser, user, navigate]);

  //Updates current IDs on parent main element
  useEffect(() => {
    if (params.campaign) {
      setCurrentCampaignID(params.campaign);
    }
    if (paramsUser) {
      setCurrentUserID(paramsUser);
    }
  });

  //Updates currentTab on parent main element
  useEffect(() => {
    setCurrentTab("Characters");
  }, [setCurrentTab]);

  //Select change for sidebar campaign selector
  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
      navigate(`/characters/${user.uid}/${camp.name}`);
    }
  }

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Sessions:</h2>
      {isOwner(user, paramsUser) ? (
        <div
          className="text-blue-400 cursor-pointer pl-2 pb-2"
          onClick={() => setCurrentCharacter("new")}
        >
          + New character
        </div>
      ) : null}

      <div className="bg-gray-300 overflow-y-auto rounded max-h-[50vh]">
        {isPrivate(currentCampaign) ? (
          <ul className="text-gray-800 text-center">PRIVATE CAMPAIGN</ul>
        ) : loadingCharacters ? (
          <p className="text-gray-500 h-12 flex items-center justify-center">
            LOADING...
          </p>
        ) : (
          <ul className="font-normal">{populateCharacters()}</ul>
        )}
      </div>
    </div>
  );

  //Returns an Object where each key is a location with value that equals an array of characters from the location
  function getLocationCharacterObject(characters) {
    let locationsObj = {};
    for (let i = 0; i < characters.length; i++) {
      let loc = characters[i].location;
      if (locationsObj[loc]) {
        locationsObj[loc].push(characters[i]);
      } else {
        locationsObj[loc] = [characters[i]];
      }
    }
    return locationsObj;
  }

  //Populates the sidebar with the character Accordion
  function populateCharacters() {
    let locationsObj = getLocationCharacterObject(characters);
    //Iterates through location keys, for titles
    return Object.keys(locationsObj).map((location, index) => {
      //Iterates through characters in each location, for content
      let accordionContent = locationsObj[location].map((entry, index) => {
        return (
          <CharacterCard
            current={currentCharacter}
            character={entry}
            key={entry.name}
            onClickEvent={setCurrentCharacter}
          />
        );
      });
      return (
        <Accordion title={location} content={accordionContent} key={index} />
      );
    });
  }

  function isPrivate(campaign) {
    if (!user || user.uid !== paramsUser) {
      return campaign.private;
    } else {
      return false;
    }
  }

  return (
    <div className="main__container">
      <Sidebar
        campaigns={campaigns}
        currentCampaign={currentCampaign}
        handleSelectChange={handleSelectChange}
        content={sideBarContent}
        user={user}
        currentUserID={props.currentUserID}
        sideBarHidden={props.sideBarHidden}
      />
      <CharacterInfo
        campaign={currentCampaign}
        character={currentCharacter}
        characters={characters}
        setCharacters={setCharacters}
        user={user}
        key={currentCharacter.name}
      />
    </div>
  );
}

export default Characters;
