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

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Main />} />
          <Route exact path="/campaign" element={<Campaign />} />
          <Route exact path="/journal" element={<Journal />} />
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
