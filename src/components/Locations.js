import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { isOwner } from "../helpers";
import Sidebar from "./Sidebar";
import "../style/main.css";
import LocationInfo from "./LocationInfo";
import Accordion from "./Accordion";
import LocationCard from "./LocationCard";

function Locations(props) {
  const setCurrentCampaignID = props.setCurrentCampaignID;
  const setCurrentUserID = props.setCurrentUserID;
  const setCurrentTab = props.setCurrentTab;
  const params = useParams();
  const paramsUser = params.user ? params.user : params["*"].replace("/", "");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [campaigns] = props.campaignsState;
  const [currentCampaign, setCurrentCampaign] = props.currentCampaignState;

  const [currentLocation, setCurrentLocation] = useState("");
  const [locations, setLocations, loadingLocations] = props.locationsState;

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
    setCurrentTab("Locations");
  }, [setCurrentTab]);

  //Select change for sidebar campaign selector
  function handleSelectChange(e) {
    let camp = campaigns.find((camp) => {
      return camp.name === e.target.value;
    });
    if (!!camp) {
      setCurrentCampaign(camp);
      navigate(`/locations/${user.uid}/${camp.name}`);
    }
  }

  //Sets up initial location on locations load
  useEffect(() => {
    if (!currentLocation) {
      let random = Math.floor(Math.random() * locations.length);
      if (locations && locations.length > 0) {
        setCurrentLocation(locations[random]);
      } else {
        setCurrentLocation("");
      }
    }
  }, [locations, currentLocation]);

  const sideBarContent = (
    <div>
      <h2 className="select-none pb-4">Locations:</h2>
      {isOwner(user, paramsUser) ? (
        <div
          className="text-blue-400 cursor-pointer pl-2 pb-2"
          onClick={() => setCurrentLocation("new")}
        >
          + New location
        </div>
      ) : null}

      <div className="generic__Sidebar">
        {isPrivate(currentCampaign) ? (
          <ul className="text-gray-800 text-center">PRIVATE CAMPAIGN</ul>
        ) : loadingLocations ? (
          <p className="text-gray-500 h-12 flex items-center justify-center">
            LOADING...
          </p>
        ) : (
          <ul className="font-normal">{populateLocations()}</ul>
        )}
      </div>
    </div>
  );

  //Returns an Object where each key is a folder with value that equals an array of locations from the folder
  function getFolderLocationObject(locations) {
    let foldersObj = {};
    for (let i = 0; i < locations.length; i++) {
      let loc = locations[i].location;
      if (foldersObj[loc]) {
        foldersObj[loc].push(locations[i]);
      } else {
        foldersObj[loc] = [locations[i]];
      }
    }
    return foldersObj;
  }

  //Populates the sidebar with the location Accordion
  function populateLocations() {
    let foldersObj = getFolderLocationObject(locations);
    //Iterates through sorted location keys, for titles
    return Object.keys(foldersObj)
      .sort()
      .map((folder, index) => {
        //Iterates through characters in each location for accordion content, sorting by name
        let accordionContent = foldersObj[folder]
          .sort((a, b) => {
            return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
          })
          .map((entry, index) => {
            return (
              <LocationCard
                current={currentLocation}
                location={entry}
                key={"LC" + entry.name}
                onClickEvent={setCurrentLocation}
              />
            );
          });
        return (
          <Accordion
            title={folder}
            content={accordionContent}
            startOpen={currentLocation.location}
            key={index}
          />
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
      {isPrivate(currentCampaign) ? null : (
        <LocationInfo
          campaign={currentCampaign}
          location={currentLocation}
          setLocation={setCurrentLocation}
          locations={locations}
          setLocations={setLocations}
          user={user}
          key={"LI" + currentLocation.name}
        />
      )}
    </div>
  );
}

export default Locations;
