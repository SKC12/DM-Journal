import { useEffect, useState } from "react";
import "../../style/ChaLocInfo.css";
import genericImage from "../../img/bxs-face.svg";
import { confirmAlert } from "react-confirm-alert";
import CharacterImagePopup from "./CharacterImgPopup";
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from "draft-js";
import DraftjsMentions from "../DraftjsMentions";
import { Character } from "../../models/Character";

function CharacterInfo(props) {
  const [img, setImg] = useState(
    props.character.img ? props.character.img : genericImage
  );
  const [name, setName] = useState(
    props.character.name ? props.character.name : ""
  );
  const [location, setLocation] = useState(
    props.character.location ? props.character.location : ""
  );
  const [description, setDescription] = useState(
    props.character.description ? props.character.description : ""
  );
  const [descriptionEditorState, setDescriptionEditorState] = useState(() =>
    getEditorStateFromStringOrRaw(description)
  );
  const [privateDescription, setPrivateDescription] = useState(
    props.character.privateDescription ? props.character.privateDescription : ""
  );
  const params = props.params;
  const [errorMsg, setErrorMsg] = useState(false);
  const [isImgPopup, setIsImgPopup] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const navigate = props.navigate;
  const user = props.user;

  const uid = props.character.uid;

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
    if (props.character === "new") {
      setIsEditable(true);
    }
  }, [props.character]);

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  //Adds character to Database
  async function createCharacter() {
    let character = new Character(
      {
        name: name,
        img: img,
        location: location,
        description: convertToRaw(descriptionEditorState.getCurrentContent()),
        privateDescription: privateDescription,
      },
      props.user.uid,
      props.campaign.name
    );

    if (character.isValid()) {
      if (
        props.characters.filter(
          (e) =>
            e.name.replace(/[\^?]/g, "") ===
            character.name.replace(/[\^?]/g, "")
        ).length === 0
      ) {
        await character.saveToDB();
        let newCharacters = props.characters.concat(character);
        props.setCharacters(newCharacters);
        props.setCharacter(character);
        navigate(
          "/characters/" +
            user.uid +
            "/" +
            props.campaign.name +
            "/" +
            character.name
        );
      } else {
        setErrorMsg(true);
      }
    } else {
      setErrorMsg(true);
    }
  }

  //Edits character
  async function editCharacter() {
    let character = new Character(
      {
        name: name,
        img: img,
        location: location,
        description: convertToRaw(descriptionEditorState.getCurrentContent()),
        privateDescription: privateDescription,
        uid: uid,
      },
      props.user.uid,
      props.campaign.name
    );
    if (character.isValid()) {
      if (
        name === props.character.name ||
        character.name === "createnew" ||
        props.characters.filter((e) => e.name === character.name).length === 0
      ) {
        await character.saveToDB();
        let newArr = props.characters.map((entry) => {
          return entry.uid === uid ? character : entry;
        });
        props.setCharacters(newArr);
        props.setCharacter(character);
      } else {
        setErrorMsg(true);
      }
    } else {
      setErrorMsg(true);
    }
  }

  //Deletes character
  async function deleteCharacter() {
    try {
      await props.character.deleteFromDB();
      //Removes character from state
      props.setCharacters(
        props.characters.filter((entry) => {
          return entry.name !== name;
        })
      );
      props.setCharacter("");

      //TODO: ERROR
    } catch (e) {
      console.log(e);
      alert(e);
    }
  }

  //Alert for deletion confirmation
  const characterDeleteAlert = (e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui JournalInfo__delete-alert-container">
            <div className="JournalInfo__delete-alert-text-container">
              <p className="">
                Are you sure you want to delete this character?
              </p>
              <p className="">The process is irreversible.</p>
            </div>

            <div className="JournalInfo__delete-alert-button-container">
              <button
                onClick={() => {
                  deleteCharacter();
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
        Character names must be unique and cannot contain forward slashes ("/")
        or carets ("^")
      </p>
    ) : null;
  };

  function returnToInitialValues() {
    setImg(props.character.img);
    setName(props.character.name);
    setLocation(props.character.location);
    setDescription(props.character.description);
    setPrivateDescription(props.character.privateDescription);
    setDescriptionEditorState(
      getEditorStateFromStringOrRaw(props.character.description)
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
            createCharacter();
          }}
        >
          Create Character
        </button>
      ) : (
        <>
          <button
            className="generic__buttons"
            onClick={(e) => {
              e.preventDefault();
              if (isEditable) {
                editCharacter();
                setIsEditable(false);
              } else {
                setIsEditable(true);
              }
            }}
          >
            {isEditable ? "Save" : "Edit Character"}
          </button>
          <button
            className="generic__buttons"
            onClick={(e) => {
              e.preventDefault();
              if (isEditable) {
                returnToInitialValues();
                setIsEditable(false);
              } else {
                characterDeleteAlert(e);
              }
            }}
          >
            {isEditable ? "Cancel" : "Delete Character"}
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="grow overflow-auto">
      {props.character === "" || props.campaign === "" ? null : (
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
              <div className="ChaLocInfo__top-container">
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
                        : "ChaLocInfo__img"
                    } `}
                    alt="Character"
                  />
                </div>
                <div className="ChaLocInfo__data-container">
                  <div className="ChaLocInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-character-name"
                    >
                      Name
                    </label>
                    <input
                      className="generic__input ChaLoc__input"
                      disabled={!isOwner() || !isEditable}
                      id="info-character-name"
                      value={name}
                      maxLength="25"
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  </div>
                  {nameErrorMessage()}
                  <div className="ChaLocInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-character-location"
                    >
                      Location
                    </label>
                    <input
                      className="generic__input ChaLoc__input"
                      disabled={!isOwner() || !isEditable}
                      id="info-character-location"
                      value={location}
                      maxLength="25"
                      onChange={(e) => setLocation(e.target.value)}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="ChaLocInfo__bot-container">
                <div className="ChaLocInfo__input-container">
                  <label
                    className="generic__label"
                    htmlFor="info-character-description"
                  >
                    Character description
                  </label>
                  <DraftjsMentions
                    readOnly={!isOwner() || !isEditable}
                    id="info-character-description"
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
                      htmlFor="info-private-description"
                    >
                      Private description
                    </label>

                    <textarea
                      disabled={!isOwner() || !isEditable}
                      className="generic__input ChaLocInfo__input-large "
                      id="info-private-description"
                      value={privateDescription}
                      maxLength="3000"
                      onChange={(e) => setPrivateDescription(e.target.value)}
                    ></textarea>
                  </div>
                ) : null}
              </div>
              {isOwner() ? buttons(props.character) : null}
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default CharacterInfo;
