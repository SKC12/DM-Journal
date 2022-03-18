import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import {
  searchFirebaseForCampaignName,
  writeCampaignToFirebase,
  deleteCampaignFromFirebase,
  containsInvalidCharacters,
} from "../helpers";
import "../confirmCSS.css";
import "animate.css";
import "../style/CampaignInfo.css";

function CampaignInfo(props) {
  const [name, setName] = useState(
    props.campaign.name ? props.campaign.name : ""
  );
  const [description, setDescription] = useState(
    props.campaign.description ? props.campaign.description : ""
  );
  const [isPrivate, setIsPrivate] = useState(
    props.campaign.private ? props.campaign.private : false
  );
  const [errorMsg, setErrorMsg] = useState(false);

  //Error msg initially not displayed
  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  async function createCampaign(e) {
    e.preventDefault();

    //Checks for invalid characters
    if (!containsInvalidCharacters(name)) {
      //Queries if campaign already exists
      const docs = await searchFirebaseForCampaignName(props.user.uid, name);
      if (docs.docs.length === 0) {
        let campaign = {
          name: name,
          description: description,
          private: isPrivate,
        };

        //If it doesn't exists, writes to DB
        await writeCampaignToFirebase(props.user.uid, campaign.name, campaign);
        window.location.reload();
      } else {
        //If not, displays error msg
        setErrorMsg(true);
      }
    } else {
      setErrorMsg(true);
    }
  }

  async function editCampaign(e) {
    e.preventDefault();
    let campaign = {
      name: name,
      description: description,
      private: isPrivate,
    };
    await writeCampaignToFirebase(props.user.uid, campaign.name, campaign);
    window.location.reload();
  }

  async function deleteCampaign(e) {
    e.preventDefault();
    await deleteCampaignFromFirebase(props.user.uid, name);
    window.location.reload();
  }

  let errorMessage = () => {
    return errorMsg ? (
      <p className="generic__alert-text">
        Campaign names must be unique and cannot contain forward slashes "/"
      </p>
    ) : (
      <p></p>
    );
  };

  //Alert for deletion confirmation
  const campaignDeleteAlert = (e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui h-[150px] w-[350px] bg-gray-200 flex flex-col items-center">
            <div className="h-[100px] grow flex flex-col text-center justify-around items-center">
              <p className="">Are you sure you want to delete this campaign?</p>
              <p className="">The process is irreversible.</p>
            </div>

            <div className="h-[40px] w-full flex justify-evenly">
              <button
                onClick={() => {
                  deleteCampaign(e);
                  onClose();
                }}
                className="flex-1 bg-red-800"
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  onClose();
                }}
                className="flex-1 bg-gray-500"
              >
                Return
              </button>
            </div>
          </div>
        );
      },
    });
  };

  function populate(campaign) {
    if (campaign === "") {
      return null;
    } else {
      return (
        <div className="animate__animated animate__fadeIn">
          <form className="md:pl-20 md:pt-12 md:max-w-4xl">
            <div className="flex-col items-center md:pb-6">
              <label className="generic__label" htmlFor="info-campaign-name">
                Campaign name{" "}
              </label>

              <input
                className="generic__input generic__input-disabledBg md:w-96"
                id="info-campaign-name"
                value={name}
                maxLength="50"
                disabled={campaign !== "new"}
                onChange={(e) => setName(e.target.value)}
              ></input>
              {errorMessage()}
            </div>

            <div className="flex-col items-center md:pb-3 md:pr-6">
              <label
                className="generic__label"
                htmlFor="info-campaign-description"
              >
                Campaign description{" "}
              </label>
              <textarea
                className={`generic__input my-3 indent-6 w-full h-60 resize-none`}
                id="info-campaign-description"
                maxLength="1500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center pb-6">
              <label
                className={`generic__label pb-0 max-w-fit`}
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

            <div className="flex justify-center h-10 items-stretch gap-3">
              {campaign === "new" ? (
                <button
                  className="generic__buttons"
                  onClick={(e) => createCampaign(e)}
                >
                  Create Campaign
                </button>
              ) : (
                <>
                  <button
                    className="generic__buttons"
                    onClick={(e) => editCampaign(e)}
                  >
                    Edit
                  </button>
                  <button
                    className="generic__buttons"
                    onClick={(e) => campaignDeleteAlert(e)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      );
    }
  }
  return <div className="p-3 grow">{populate(props.campaign)}</div>;
}

export default CampaignInfo;
