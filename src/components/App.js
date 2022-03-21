import "../index.css";
//import SignIn from "./SignIn";
import { Route, Routes, useMatch } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Main from "./Main";
import Campaign from "./Campaign";
import Journal from "./Journal";
import Stats from "./Stats";
import { useState } from "react";
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
  const [currentUserID, setCurrentUserID] = useState("");
  const [currentCampaignID, setCurrentCampaignID] = useState("");
  const [currentTab, setCurrentTab] = useState("");
  const [sideBarHidden, setSideBarHidden] = useState("true");
  const [campaigns] = useCampaignsState(params.user);
  const [currentCampaign, setCurrentCampaign] = useCurrentCampaignState(
    campaigns,
    params.campaign
  );
  const [sessions, setSessions, loadingSessions] = useSessionState(
    params.user,
    currentCampaign.name
  );
  const [characters, setCharacters, loadingCharacters] = useCharacterState(
    params.user,
    currentCampaign.name
  );
  const [locations, setLocations, loadingLocations] = useLocationState(
    params.user,
    currentCampaign.name
  );

  function getParams() {
    let fullMatch = routerMatch("/:route/:user/:campaign");
    let userMath = routerMatch("/:route/:user");
    let routeMatch = routerMatch("/:route");

    if (fullMatch) {
      return {
        user: fullMatch.params.user,
        route: fullMatch.params.route,
        campaign: fullMatch.params.campaign,
      };
    }

    if (userMath) {
      return {
        user: userMath.params.user,
        route: userMath.params.route,
        campaign: "",
      };
    }
    if (routeMatch) {
      return {
        user: "",
        route: routeMatch.params.route,
        campaign: "",
      };
    }

    return { user: "", route: "", campaign: "" };
  }

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
        />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route
            exact
            path="/campaign"
            element={
              <Campaign
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
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sessionsState={[sessions, setSessions, loadingSessions]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/journal/:user/:campaign"
            element={
              <Journal
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sessionsState={[sessions, setSessions, loadingSessions]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/characters/*"
            element={
              <Characters
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                charactersState={[characters, setCharacters, loadingCharacters]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/characters/:user/:campaign"
            element={
              <Characters
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                charactersState={[characters, setCharacters, loadingCharacters]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/locations/*"
            element={
              <Locations
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                locationsState={[locations, setLocations, loadingLocations]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/locations/:user/:campaign"
            element={
              <Locations
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                locationsState={[locations, setLocations, loadingLocations]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
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
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sessionsState={[sessions, setSessions, loadingSessions]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
                setCurrentTab={setCurrentTab}
              />
            }
          />
          <Route
            exact
            path="/stats/:user/:campaign"
            element={
              <Stats
                campaignsState={[campaigns]}
                currentCampaignState={[currentCampaign, setCurrentCampaign]}
                sessionsState={[sessions, setSessions, loadingSessions]}
                sideBarHidden={sideBarHidden}
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
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
