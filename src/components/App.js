import "../index.css";
//import SignIn from "./SignIn";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  //  Switch,
} from "react-router-dom";
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

function App() {
  const [currentUserID, setCurrentUserID] = useState("");
  const [currentCampaignID, setCurrentCampaignID] = useState("");
  const [currentTab, setCurrentTab] = useState("");
  const [sideBarHidden, setSideBarHidden] = useState("true");

  return (
    <div className="app">
      <Router>
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
      </Router>
    </div>
  );
}

export default App;
