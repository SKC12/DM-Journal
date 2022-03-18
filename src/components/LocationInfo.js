import { useEffect, useState } from "react";
import "../style/ChaLocInfo.css";
import genericImage from "../img/bx-image.svg";
import zoomInImage from "../img/bx-zoom-in.svg";
import zoomOutImage from "../img/bx-zoom-out.svg";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import {
  writeToFirebase,
  deleteFromFirebase,
  containsInvalidCharacters,
} from "../helpers.js";
import { confirmAlert } from "react-confirm-alert";
import CharacterImagePopup from "./CharacterImgPopup";

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
  const [privateDescription, setPrivateDescription] = useState(
    props.location.privateDescription ? props.location.privateDescription : ""
  );
  const [isBigImage, setIsBigImage] = useState(false);
  const params = useParams();
  const [errorMsg, setErrorMsg] = useState(false);
  const [isImgPopup, setIsImgPopup] = useState(false);
  const [zoomImg, setZoomImg] = useState(zoomInImage);
  const uid = props.location.uid;

  useEffect(() => {
    console.log(isBigImage);
    isBigImage ? setZoomImg(zoomOutImage) : setZoomImg(zoomInImage);
  }, [isBigImage]);

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  //Adds character to Database
  async function createLocation(e) {
    e.preventDefault();

    let location = {
      name: name,
      img: img,
      location: folder,
      description: description,
      privateDescription: privateDescription,
      uid: nanoid(),
    };

    if (isValidLocation(location)) {
      if (
        props.locations.filter((e) => e.name === location.name).length === 0
      ) {
        await writeToFirebase(
          "locations",
          props.user.uid,
          props.campaign.name,
          location
        );
        let newLocations = props.locations.concat(location);
        props.setLocations(newLocations);
      } else {
        setErrorMsg(true);
      }
    }
  }

  //Edits character
  async function editLocation(e) {
    e.preventDefault();
    let location = {
      name: name,
      img: img,
      location: folder,
      description: description,
      privateDescription: privateDescription,
      uid: uid,
    };
    if (isValidLocation(location)) {
      if (
        name === props.location.name ||
        props.locations.filter((e) => e.name === location.name).length === 0
      ) {
        await writeToFirebase(
          "locations",
          props.user.uid,
          props.campaign.name,
          location
        );
        let newArr = props.locations.map((entry) => {
          return entry.uid === uid ? location : entry;
        });
        props.setLocations(newArr);
      } else {
        setErrorMsg(true);
      }
    }
  }

  //Deletes location
  async function deleteLocation(e) {
    e.preventDefault();
    try {
      await deleteFromFirebase(
        "locations",
        props.user.uid,
        props.campaign.name,
        uid
      );

      //Removes location from state
      props.setLocations(
        props.locations.filter((entry) => {
          return entry.name !== name;
        })
      );
      //TODO: ERROR
    } catch (e) {
      console.log(e);
      alert(e);
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
      </p>
    ) : null;
  };

  function isValidLocation(location) {
    if (location.name === "" || containsInvalidCharacters(location.name)) {
      setErrorMsg(true);
      return false;
    }

    return true;
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
        <button className="generic__buttons" onClick={(e) => createLocation(e)}>
          Create Location
        </button>
      ) : (
        <>
          <button className="generic__buttons" onClick={(e) => editLocation(e)}>
            Edit Location
          </button>
          <button
            className="generic__buttons"
            onClick={(e) => locationDeleteAlert(e)}
          >
            Delete Location
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="grow overflow-auto">
      {props.location === "" || props.campaign === "" ? null : (
        <div>
          {isImgPopup && (
            <CharacterImagePopup
              setImg={setImg}
              img={img}
              isVisible={setIsImgPopup}
              genericImage={genericImage}
            />
          )}
          <div className="animate__animated animate__fadeIn">
            <form className="p-3 md:pl-20 md:pt-12 md:max-w-4xl">
              <div
                className={`ChaLocInfo__top-container ${
                  isBigImage ? "ChaLocInfo__big-img-container" : ""
                }`}
              >
                <div
                  className={`ChaLocInfo__img-container ${
                    isOwner() ? "cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (isOwner()) setIsImgPopup(true);
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
                  <div
                    className="ChaLocInfo__img-zoom"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBigImage(!isBigImage);
                    }}
                  >
                    <img alt="" src={zoomImg} />
                  </div>
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
                      className="generic__input"
                      disabled={!isOwner()}
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
                      className="generic__input"
                      disabled={!isOwner()}
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
                  <textarea
                    disabled={!isOwner()}
                    className="generic__input  ChaLocInfo__input-large"
                    id="info-location-description"
                    value={description}
                    maxLength="3000"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
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
                      disabled={!isOwner()}
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
        </div>
      )}
    </div>
  );
}

export default LocationInfo;
