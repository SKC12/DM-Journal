import { useEffect, useState } from "react";
import "../../style/ChaLocInfo.css";
import genericImage from "../../img/bx-image.svg";
import zoomInImage from "../../img/bx-zoom-in.svg";
import zoomOutImage from "../../img/bx-zoom-out.svg";
import { confirmAlert } from "react-confirm-alert";
import CharacterImagePopup from "../Characters/CharacterImgPopup";
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
import DraftjsMentions from "../DraftjsMentions";
import { Location } from "../../models/Location";

function LocationInfo(props) {
  const [img, setImg] = useState(
    props.location.img ? props.location.img : genericImage
  );
  const [name, setName] = useState(
    props.location.name ? props.location.name : ""
  );
  const [folder, setFolder] = useState(
    props.location.location ? props.location.location : ""
  );
  const [description, setDescription] = useState(
    props.location.description ? props.location.description : ""
  );
  const [descriptionEditorState, setDescriptionEditorState] = useState(() =>
    getEditorStateFromStringOrRaw(description)
  );
  const [privateDescription, setPrivateDescription] = useState(
    props.location.privateDescription ? props.location.privateDescription : ""
  );
  const [isBigImage, setIsBigImage] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [isImgPopup, setIsImgPopup] = useState(false);
  const [zoomImg, setZoomImg] = useState(zoomInImage);
  const [isEditable, setIsEditable] = useState(false);
  const params = props.params;

  const user = props.user;
  const navigate = props.navigate;

  const uid = props.location.uid;

  //Allows the Editor to accept descripts both in String and Raw Draftjs format
  function getEditorStateFromStringOrRaw(description) {
    if (typeof description === "string") {
      return EditorState.createWithContent(
        ContentState.createFromText(description)
      );
    } else {
      return EditorState.createWithContent(convertFromRaw(description));
    }
  }

  useEffect(() => {
    if (props.location === "new") {
      setIsEditable(true);
    }
  }, [props.location]);

  useEffect(() => {
    isBigImage ? setZoomImg(zoomOutImage) : setZoomImg(zoomInImage);
  }, [isBigImage]);

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  //Adds character to Database
  async function createLocation() {
    let location = new Location(
      {
        name: name,
        img: img,
        location: folder,
        description: convertToRaw(descriptionEditorState.getCurrentContent()),
        privateDescription: privateDescription,
      },
      props.user.uid,
      props.campaign.name
    );

    if (location.isValid()) {
      if (
        props.locations.filter((e) => e.name === location.name).length === 0
      ) {
        try {
          await location.saveToDB();
          let newLocations = props.locations.concat(location);
          props.setLocations(newLocations);
          props.setLocation(location);
          navigate(
            "/locations/" +
              user.uid +
              "/" +
              props.campaign.name +
              "/" +
              location.name
          );
        } catch (e) {
          console.log(e);
          navigate("/error");
        }
      } else {
        setErrorMsg(true);
      }
    } else {
      setErrorMsg(true);
    }
  }

  //Edits character
  async function editLocation() {
    let location = new Location(
      {
        name: name,
        img: img,
        location: folder,
        description: convertToRaw(descriptionEditorState.getCurrentContent()),
        privateDescription: privateDescription,
        uid: uid,
      },
      props.user.uid,
      props.campaign.name
    );
    if (location.isValid()) {
      if (
        name === props.location.name ||
        props.locations.filter((e) => e.name === location.name).length === 0
      ) {
        try {
          await location.saveToDB();
          let newArr = props.locations.map((entry) => {
            return entry.uid === uid ? location : entry;
          });
          props.setLocations(newArr);
          props.setLocation(location);
        } catch (e) {
          console.log(e);
          navigate("/error");
        }
      } else {
        setErrorMsg(true);
      }
    }
  }

  //Deletes location
  async function deleteLocation() {
    try {
      await props.location.deleteFromDB();

      //Removes location from state
      props.setLocations(
        props.locations.filter((entry) => {
          return entry.name !== name;
        })
      );
      props.setLocation("");
    } catch (e) {
      console.log(e);
      navigate("/error");
    }
  }

  //Alert for deletion confirmation
  const locationDeleteAlert = (e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui JournalInfo__delete-alert-container">
            <div className="JournalInfo__delete-alert-text-container">
              <p className="">Are you sure you want to delete this location?</p>
              <p className="">The process is irreversible.</p>
            </div>

            <div className="JournalInfo__delete-alert-button-container">
              <button
                onClick={() => {
                  deleteLocation(e);
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

  let nameErrorMessage = () => {
    return errorMsg ? (
      <p className="generic__alert-text">
        Location names must be unique and cannot contain forward slashes ("/")
        or carets ("^")
      </p>
    ) : null;
  };

  function returnToInitialValues() {
    setImg(props.location.img);
    setName(props.location.name);
    setFolder(props.location.folder);
    setDescription(props.location.description);
    setPrivateDescription(props.location.privateDescription);
    setDescriptionEditorState(
      getEditorStateFromStringOrRaw(props.location.description)
    );
  }

  function isOwner() {
    if (!props.user) {
      return false;
    } else if (props.user.uid === params.user) {
      return true;
    }
    return false;
  }

  const buttons = (entry) => (
    <div className="flex justify-center h-10 items-stretch gap-3">
      {entry === "new" ? (
        <button
          className="generic__buttons"
          onClick={(e) => {
            e.preventDefault();
            createLocation();
          }}
        >
          Create Location
        </button>
      ) : (
        <>
          <button
            className="generic__buttons"
            onClick={(e) => {
              e.preventDefault();
              if (isEditable) {
                editLocation();
                setIsEditable(false);
              } else {
                setIsEditable(true);
              }
            }}
          >
            {isEditable ? "Save" : "Edit Location"}
          </button>
          <button
            className="generic__buttons"
            onClick={(e) => {
              e.preventDefault();
              if (isEditable) {
                returnToInitialValues();
                setIsEditable(false);
              } else {
                locationDeleteAlert(e);
              }
            }}
          >
            {isEditable ? "Cancel" : "Delete Location"}
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="grow overflow-auto">
      {props.location === "" || props.campaign === "" ? null : (
        <>
          {isImgPopup && (
            <CharacterImagePopup
              setImg={setImg}
              img={img}
              isVisible={setIsImgPopup}
              genericImage={genericImage}
            />
          )}
          <div className="animate__animated animate__fadeIn h-full">
            <form className="generic__main-form">
              <div
                className={`ChaLocInfo__top-container ${
                  isBigImage ? "ChaLocInfo__big-img-container" : ""
                }`}
              >
                <div
                  className={`ChaLocInfo__img-container ${
                    isOwner() && isEditable ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (isOwner() && isEditable) setIsImgPopup(true);
                  }}
                >
                  <img
                    src={img}
                    className={`${
                      img === genericImage
                        ? "ChaLocInfo__genericImg"
                        : isBigImage
                        ? "ChaLocInfo__big-img"
                        : "ChaLocInfo__img"
                    }  `}
                    alt="Location"
                  />
                  {img === genericImage ? null : (
                    <div
                      className="ChaLocInfo__img-zoom"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsBigImage(!isBigImage);
                      }}
                    >
                      <img alt="" src={zoomImg} />
                    </div>
                  )}
                </div>
                <div className="ChaLocInfo__data-container">
                  <div className="ChaLocInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-location-name"
                    >
                      Name
                    </label>
                    <input
                      className="generic__input ChaLoc__input"
                      disabled={!isOwner() || !isEditable}
                      id="info-location-name"
                      value={name}
                      maxLength="25"
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  </div>
                  {nameErrorMessage()}
                  <div className="ChaLocInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-location-folder"
                    >
                      Folder
                    </label>
                    <input
                      className="generic__input ChaLoc__input"
                      disabled={!isOwner() || !isEditable}
                      id="info-location-folder"
                      value={folder}
                      maxLength="25"
                      onChange={(e) => setFolder(e.target.value)}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="ChaLocInfo__bot-container">
                <div className="ChaLocInfo__input-container">
                  <label
                    className="generic__label"
                    htmlFor="info-location-description"
                  >
                    Location description
                  </label>
                  <DraftjsMentions
                    readOnly={!isOwner() || !isEditable}
                    id="info-location-description"
                    editorStateArray={[
                      descriptionEditorState,
                      setDescriptionEditorState,
                    ]}
                    characters={props.characters}
                    locations={props.locations}
                    editorState={descriptionEditorState}
                    onChange={setDescriptionEditorState}
                    params={props.params}
                  ></DraftjsMentions>
                </div>
                {isOwner() ? (
                  <div className="ChaLocInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-location-private-description"
                    >
                      Private description
                    </label>
                    <textarea
                      disabled={!isOwner() || !isEditable}
                      className="generic__input ChaLocInfo__input-large "
                      id="info-location-private-description"
                      value={privateDescription}
                      maxLength="3000"
                      onChange={(e) => setPrivateDescription(e.target.value)}
                    ></textarea>
                  </div>
                ) : null}
              </div>
              {isOwner() ? buttons(props.location) : null}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default LocationInfo;
