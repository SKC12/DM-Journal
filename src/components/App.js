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

function App() {
  const [currentUserID, setCurrentUserID] = useState("");
  const [currentCampaignID, setCurrentCampaignID] = useState("");
  return (
    <div className="app">
      <Router>
        <Header
          currentUserID={currentUserID}
          setCurrentUserID={setCurrentUserID}
          currentCampaignID={currentCampaignID}
          setCurrentCampaignID={setCurrentCampaignID}
        />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/campaign" element={<Campaign />} />
          <Route
            exact
            path="/journal/*"
            element={
              <Journal
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
              />
            }
          />
          <Route
            exact
            path="/journal/:user/:campaign"
            element={
              <Journal
                currentUserID={currentUserID}
                setCurrentUserID={setCurrentUserID}
                currentCampaignID={currentCampaignID}
                setCurrentCampaignID={setCurrentCampaignID}
              />
            }
          />
          <Route exact path="/stats" element={<Stats />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
