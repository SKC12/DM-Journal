import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { containsInvalidCharacters } from "../../helpers";
import { Campaign } from "../../models/Campaign";
import "../../confirmCSS.css";
import "animate.css";
import "../../style/CampaignInfo.css";

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
  const [isEditable, setIsEditable] = useState(false);
  const [options, setOptions] = useState(
    props.campaign.options
      ? props.campaign.options
      : {
          ingameTime: true,
          level: true,
          arc: true,
        }
  );
  const navigate = props.navigate;

  //Error msg initially not displayed
  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  useEffect(() => {
    if (props.campaign === "new") {
      setIsEditable(true);
    }
  }, [props.campaign]);

  async function createCampaign(e) {
    e.preventDefault();

    //Checks for invalid characters
    if (!containsInvalidCharacters(name)) {
      let campaign = new Campaign(
        { name, description, isPrivate, options },
        props.user.uid
      );
      //Queries if campaign already exists
      if (await campaign.existsInDB()) {
        setErrorMsg(true);
        // Saves to DB and inserts into campaign array
      } else {
        try {
          await campaign.saveToDB();
          let newCamps = props.campaigns.concat(campaign);
          props.setCampaigns(newCamps);
          props.setCampaign(campaign);
        } catch (e) {
          console.log(e);
          navigate("/error");
        }
      }
    } else {
      setErrorMsg(true);
    }
  }

  async function editCampaign() {
    let campaign = new Campaign(
      { name, description, isPrivate, options },
      props.user.uid
    );
    try {
      await campaign.saveToDB();
      let newArr = props.campaigns.map((entry) => {
        return entry.name === name ? campaign : entry;
      });
      props.setCampaigns(newArr);
      props.setCampaign(campaign);
    } catch (e) {
      console.log(e);
      navigate("/error");
    }
  }

  async function deleteCampaign(e) {
    e.preventDefault();
    try {
      await props.campaign.deleteFromDB();
      props.setCampaigns(
        props.campaigns.filter((entry) => {
          return entry.name !== name;
        })
      );
      props.setCampaign("");
    } catch (e) {
      console.log(e);
      navigate("/error");
    }
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

  function returnToInitialValues() {
    setName(props.campaign.name);
    setDescription(props.campaign.description);
    setIsPrivate(props.campaign.private);
    setOptions(props.campaign.options);
  }

  function populate(campaign) {
    if (campaign === "") {
      return null;
    } else {
      return (
        <div className="animate__animated animate__fadeIn h-full">
          <form className="generic__main-form">
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
                disabled={!isEditable}
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
                disabled={!isEditable}
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
            </div>

            <div className="flex-col items-center md:pb-3 md:pr-6">
              <label className="generic__label">Compaign tracked data</label>
              <div className="CampaignInfo__nested-table">
                <div className="flex items-center">
                  <label
                    className="CampaignInfo__nested-lable"
                    htmlFor="info-campaign-ingameTime"
                  >
                    Ingame time
                  </label>
                  <input
                    id="info-campaign-ingameTime"
                    className="form-checkbox ml-4 h-4 w-4 accent-gray-700"
                    type="checkbox"
                    disabled={!isEditable}
                    checked={options.ingameTime}
                    onChange={() =>
                      setOptions((prev) => ({
                        ...prev,
                        ingameTime: !options.ingameTime,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="CampaignInfo__nested-lable"
                    htmlFor="info-campaign-level"
                  >
                    Levels
                  </label>
                  <input
                    id="info-campaign-level"
                    className="form-checkbox ml-4 h-4 w-4 accent-gray-700"
                    type="checkbox"
                    disabled={!isEditable}
                    checked={options.level}
                    onChange={() =>
                      setOptions((prev) => ({
                        ...prev,
                        level: !options.level,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="CampaignInfo__nested-lable"
                    htmlFor="info-campaign-arc"
                  >
                    Arcs
                  </label>
                  <input
                    id="info-campaign-arc"
                    className="form-checkbox ml-4 h-4 w-4 accent-gray-700"
                    type="checkbox"
                    disabled={!isEditable}
                    checked={options.arc}
                    onChange={() =>
                      setOptions((prev) => ({
                        ...prev,
                        arc: !options.arc,
                      }))
                    }
                  />
                </div>
              </div>
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
                    onClick={(e) => {
                      e.preventDefault();
                      if (isEditable) {
                        editCampaign();
                        setIsEditable(false);
                      } else {
                        setIsEditable(true);
                      }
                    }}
                  >
                    {isEditable ? "Save" : "Edit Campaign"}
                  </button>
                  <button
                    className="generic__buttons"
                    onClick={(e) => {
                      e.preventDefault();
                      if (isEditable) {
                        returnToInitialValues();
                        setIsEditable(false);
                      } else {
                        campaignDeleteAlert(e);
                      }
                    }}
                  >
                    {isEditable ? "Cancel" : "Delete Campaign"}
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
