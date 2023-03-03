import { useNavigate } from "react-router-dom";
import { isOwner } from "../helpers";
import CampaignSelector from "./Campaigns/CampaignSelector";
import "../style/Sidebar.css";
import { useRef, useEffect } from "react";

function Sidebar(props) {
  const campaigns = props.campaigns;
  const currentCampaign = props.currentCampaign;
  const handleSelectChange = props.handleSelectChange;
  const user = props.user;
  const currentUserID = props.currentUserID;
  const sideBarHidden = props.sideBarHidden;
  const setSideBarHidden = props.setSideBarHidden;

  const ref = useRef(null);

  const content = props.content;

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        if (!sideBarHidden) {
          setSideBarHidden(true);
        }
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [sideBarHidden, setSideBarHidden]);

  return (
    <div
      ref={ref}
      className={`${
        props.sideBarHidden ? "hidden" : "block"
      } Sidebar__sidebar `}
    >
      {isOwner(user, currentUserID) ? (
        <CampaignSelector
          campaigns={campaigns}
          currentCampaign={currentCampaign}
          handleSelectChange={handleSelectChange}
        />
      ) : user ? (
        <div
          className="py-4 italic text-lg cursor-pointer"
          onClick={() => {
            navigate(`/`);
            window.location.reload();
          }}
        >
          Return
        </div>
      ) : null}

      {content}
    </div>
  );
}

export default Sidebar;
