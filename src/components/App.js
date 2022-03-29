import "../index.css";
//import SignIn from "./SignIn";
import { Route, Routes, useMatch, useNavigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Main from "./Main";
import Campaign from "./Campaign";
import Journal from "./Journal";
import Stats from "./Stats";
import { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import Characters from "./Characters";
import Locations from "./Locations";
import {
  useCampaignsState,
  useCharacterState,
  useCurrentCampaignState,
  useLocationState,
  useSessionState,
} from "../customHooks";

function App() {
  const routerMatch = useMatch;
  let params = getParams();
  const navigate = useNavigate();
  const [currentUserID, setCurrentUserID] = useState("");
  const [currentCampaignID, setCurrentCampaignID] = useState("");
  const [currentTab, setCurrentTab] = useState("");
  const [sideBarHidden, setSideBarHidden] = useState("true");
  const [campaigns, setCampaigns] = useCampaignsState(params.user);
  const [currentCampaign, setCurrentCampaign] = useCurrentCampaignState(
    campaigns,
    params.campaign
  );
  const [sessions, setSessions, loadingSessions, hasSessionError] =
    useSessionState(params.user, currentCampaign.name);
  const [currentSession, setCurrentSession] = useState("");

  const [characters, setCharacters, loadingCharacters, hasCharacterError] =
    useCharacterState(params.user, currentCampaign.name);
  const [currentCharacter, setCurrentCharacter] = useState("");
  const [locations, setLocations, loadingLocations, hasLocationError] =
    useLocationState(params.user, currentCampaign.name);
  const [currentLocation, setCurrentLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loadingLocations || loadingSessions || loadingCharacters) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loadingCharacters, loadingLocations, loadingSessions]);

  useEffect(() => {
    if (hasSessionError || hasCharacterError || hasLocationError) {
      navigate("/error");
    }
  }, [hasSessionError, hasCharacterError, hasLocationError, navigate]);

  function getParams() {
    let fullMatch = routerMatch("/:route/:user/:campaign/:item");
    let userLocMatch = routerMatch("/:route/:user/:campaign");

    let userMath = routerMatch("/:route/:user");
    let routeMatch = routerMatch("/:route");

    if (fullMatch) {
      return {
        user: fullMatch.params.user,
        route: fullMatch.params.route,
        campaign: fullMatch.params.campaign,
        item: fullMatch.params.item,
      };
    }

    if (userLocMatch) {
      return {
        user: userLocMatch.params.user,
        route: userLocMatch.params.route,
        campaign: userLocMatch.params.campaign,
        item: "",
      };
    }

    if (userMath) {
      return {
        user: userMath.params.user,
        route: userMath.params.route,
        campaign: "",
        item: "",
      };
    }
    if (routeMatch) {
      return {
        user: "",
        route: routeMatch.params.route,
        campaign: "",
        item: "",
      };
    }

    return { user: "", route: "", campaign: "", item: "" };
  }

  // useEffect(() => {
  //   setCurrentSession("");
  //   setCurrentLocation("");
  //   setCurrentCharacter("");
  // }, [currentCampaign.name]);

  //Updates current IDs on parent main element
  useEffect(() => {
    if (params.campaign) {
      setCurrentCampaignID(params.campaign);
    }
    if (params.user) {
      setCurrentUserID(params.user);
    }
  }, [params.campaign, params.user, params.item, params.route]);

  return (
    <div className="main-app">
      <div className="main-app-container">
        <Header
          sideBarHidden={sideBarHidden}
          setSideBarHidden={setSideBarHidden}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUserID={currentUserID}
          setCurrentUserID={setCurrentUserID}
          currentCampaignID={currentCampaignID}
          setCurrentCampaignID={setCurrentCampaignID}
          currentSession={currentSession}
          currentCharacter={currentCharacter}
          currentLocation={currentLocation}
        />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route
            exact
            path="/campaign/*"
            element={
              <Campaign
                campaignsState={[campaigns, setCampaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sideBarHidden={sideBarHidden}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/journal/*"
            element={
              <Journal
                params={params}
                loading={loading}
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sessionsState={[sessions, setSessions, loadingSessions]}
                currentSessionState={[currentSession, setCurrentSession]}
                characters={characters}
                currentCharacterState={[currentCharacter, setCurrentCharacter]}
                locations={locations}
                currentLocationState={[currentLocation, setCurrentLocation]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/characters/*"
            element={
              <Characters
                params={params}
                loading={loading}
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                charactersState={[characters, setCharacters, loadingCharacters]}
                currentCharacterState={[currentCharacter, setCurrentCharacter]}
                currentLocationState={[currentLocation, setCurrentLocation]}
                locations={locations}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/locations/*"
            element={
              <Locations
                params={params}
                loading={loading}
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                locationsState={[locations, setLocations, loadingLocations]}
                currentCharacterState={[currentCharacter, setCurrentCharacter]}
                currentLocationState={[currentLocation, setCurrentLocation]}
                characters={characters}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/stats/*"
            element={
              <Stats
                campaignsState={[campaigns]}
                loading={loading}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sessionsState={[sessions, setSessions, loadingSessions]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/error" element={<ErrorPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
