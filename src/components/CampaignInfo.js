import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const LABEL_STYLE = "w-52 block text-gray-700 font-bold pb-3";
const INPUT_STYLE =
  "bg-gray-200 appearance-none border-2 border-gray-200 rounded p-1 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-700";

function CampaignInfo(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const navigate = useNavigate();

  async function createCampaign(e) {
    e.preventDefault();
    let campaign = {
      name: name,
      description: description,
      private: isPrivate,
    };
    console.log(campaign);
    const campaignRef = await addDoc(
      collection(db, "users/" + props.user.uid + "/campaigns"),
      campaign
    );
    console.log("Document written with ID: ", campaignRef.id);
    window.location.reload();
    //console.log(props.user);
  }

  //console.log(props.campaign);
  function populate(campaign) {
    if (campaign === undefined) {
      return;
    } else {
      return (
        <div>
          <form className="pl-24 pt-12 max-w-4xl">
            <div className="flex-col items-center pb-6">
              <label className={LABEL_STYLE} htmlFor="info-campaign-name">
                Campaign name{" "}
              </label>
              <input
                className={`${INPUT_STYLE} w-96`}
                id="info-campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>

            <div className="flex-col items-center pb-6 pr-6">
              <label
                className={LABEL_STYLE}
                htmlFor="info-campaign-description"
              >
                Campaign description{" "}
              </label>
              <textarea
                className={`${INPUT_STYLE} w-full h-60 resize-none`}
                id="info-campaign-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center pb-6">
              <label
                className={`${LABEL_STYLE} pb-0 max-w-fit`}
                htmlFor="info-campaign-private"
              >
                Private?
              </label>
              <input
                id="info-campaign-private"
                className="form-checkbox ml-4 h-4 w-4 accent-gray-700"
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
            </div>

            <div className="flex justify-center">
              <button
                className="w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                onClick={(e) => createCampaign(e)}
              >
                {campaign === "new" ? "Create Campaign" : "Edit Campaign"}
              </button>
            </div>
          </form>
        </div>
      );
    }
  }
  return <div className="p-3 bg-gray-300 grow">{populate(props.campaign)}</div>;
}

export default CampaignInfo;
