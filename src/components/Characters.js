import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isOwner } from "../helpers";
import Sidebar from "./Sidebar";
import "../style/main.css";
import CharacterInfo from "./CharacterInfo";
import CharacterCard from "./CharacterCard";
import Accordion from "./Accordion";

function Characters(props) {
  const setCurrentTab = props.setCurrentTab;
  const params = props.params;
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [campaigns] = props.campaignsState;
  const [currentCampaign, setCurrentCampaign] = props.currentCampaignState;
  const [currentCharacter, setCurrentCharacter] = props.currentCharacterState;
  const [characters, setCharacters, loadingCharacters] = props.charactersState;

  //Navigates to link containing User params
  useEffect(() => {
    if (!params.user && user) {
      navigate("/characters/" + user.uid);
    }
  }, [params.user, user, navigate]);

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

  //Sets up initial characcter on characters load
  useEffect(() => {
    if (params.item) {
      let currentItem = characters.find((char) => char.name === params.item);
      if (currentItem) {
        setCurrentCharacter(currentItem);
      }
    }
    if (!currentCharacter && !params.item) {
      let random = Math.floor(Math.random() * characters.length);
      if (characters && characters.length > 0) {
        setCurrentCharacter(characters[random]);
      } else {
        setCurrentCharacter("");
      }
    }
  }, [characters, currentCharacter, setCurrentCharacter, params.item]);

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Characters:</h2>
      {isOwner(user, params.user) ? (
        <div
          className="text-blue-400 cursor-pointer pl-2 pb-2"
          onClick={() => setCurrentCharacter("new")}
        >
          + New character
        </div>
      ) : null}

      <div className="generic__Sidebar">
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
    //Iterates through sorted location keys, for titles
    return Object.keys(locationsObj)
      .sort()
      .map((location, index) => {
        //Iterates through characters in each location for accordion content, sorting by name
        let accordionContent = locationsObj[location]
          .sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
          })
          .map((entry, index) => {
            return (
              <CharacterCard
                current={currentCharacter}
                character={entry}
                key={"CG" + entry.name}
                onClickEvent={() =>
                  navigate(
                    `/characters/${user.uid}/${params.campaign}/${entry.name}`
                  )
                }
              />
            );
          });
        return (
          <Accordion
            title={location}
            content={accordionContent}
            startOpen={currentCharacter.location}
            key={index}
          />
        );
      });
  }

  function isPrivate(campaign) {
    if (!user || user.uid !== params.user) {
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
      {isPrivate(currentCampaign) ? null : (
        <CharacterInfo
          campaign={currentCampaign}
          character={currentCharacter}
          setCharacter={setCurrentCharacter}
          characters={characters}
          locations={props.locations}
          setCharacters={setCharacters}
          user={user}
          params={props.params}
          key={"CI" + currentCharacter.name}
        />
      )}
    </div>
  );
}

export default Characters;
