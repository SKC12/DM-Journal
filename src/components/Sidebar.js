import { useNavigate } from "react-router-dom";
import { isOwner } from "../helpers";
import CampaignSelector from "./CampaignSelector";

function Sidebar(props) {
  const campaigns = props.campaigns;
  const currentCampaign = props.currentCampaign;
  const handleSelectChange = props.handleSelectChange;
  const user = props.user;
  const currentUserID = props.currentUserID;

  const content = props.content;

  const navigate = useNavigate();
  return (
    <div
      className={`${
        props.sideBarHidden ? "hidden" : "block"
      } absolute md:relative h-full p-3 md:block w-[250px] shrink-0 bg-gray-700 text-gray-200 font-bold z-50 `}
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
