import { useEffect, useState } from "react";
import "../style/CharacterInfo.css";
import genericImage from "../img/bxs-face.svg";
import { useParams } from "react-router-dom";
import { nanoid } from "nanoid";
import {
  searchFirebaseForCharacterName,
  writeCharacterToFirebase,
  deleteCharacterFromFirebase,
  containsInvalidCharacters,
} from "../helpers.js";
import { confirmAlert } from "react-confirm-alert";
import CharacterImagePopup from "./CharacterImgPopup";

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
  const [privateDescription, setPrivateDescription] = useState(
    props.character.privateDescription ? props.character.privateDescription : ""
  );
  const params = useParams();
  const [errorMsg, setErrorMsg] = useState(false);
  const [isImgPopup, setIsImgPopup] = useState(false);
  const uid = props.character.uid;

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  //Adds character to Database
  async function createCharacter(e) {
    e.preventDefault();

    let character = {
      name: name,
      img: img,
      location: location,
      description: description,
      privateDescription: privateDescription,
      uid: nanoid(),
    };

    if (isValidCharacter(character)) {
      const docs = await searchFirebaseForCharacterName(
        props.user.uid,
        props.campaign.name,
        name
      );
      if (docs.docs.length === 0) {
        await writeCharacterToFirebase(
          props.user.uid,
          props.campaign.name,
          character
        );
        let newCharacters = props.characters.concat(character);
        props.setCharacters(newCharacters);
      } else {
        setErrorMsg(true);
      }
    }
  }

  //Edits character
  async function editCharacter(e) {
    e.preventDefault();
    let character = {
      name: name,
      img: img,
      location: location,
      description: description,
      privateDescription: privateDescription,
      uid: uid,
    };
    if (isValidCharacter(character)) {
      await writeCharacterToFirebase(
        props.user.uid,
        props.campaign.name,
        character
      );
      let newArr = props.characters.map((entry) => {
        return entry.uid === uid ? character : entry;
      });
      props.setCharacters(newArr);
    }
  }

  //Deletes character
  async function deleteCharacter(e) {
    e.preventDefault();
    try {
      await deleteCharacterFromFirebase(
        props.user.uid,
        props.campaign.name,
        uid
      );

      //Removes character from state
      props.setCharacters(
        props.characters.filter((entry) => {
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
                  deleteCharacter(e);
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
      </p>
    ) : null;
  };

  function isValidCharacter(character) {
    if (character.name === "" || containsInvalidCharacters(character.name)) {
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
        <button
          className="generic__buttons"
          onClick={(e) => createCharacter(e)}
        >
          Create Character
        </button>
      ) : (
        <>
          <button
            className="generic__buttons"
            onClick={(e) => editCharacter(e)}
          >
            Edit Character
          </button>
          <button
            className="generic__buttons"
            onClick={(e) => characterDeleteAlert(e)}
          >
            Delete Character
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="p-3 grow">
      {props.character === "" || props.campaign === "" ? null : (
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
            <form className="md:pl-20 md:pt-12 md:max-w-4xl">
              <div className="CharacterInfo__top-container">
                <div
                  className="CharacterInfo__img-container"
                  onClick={() => setIsImgPopup(true)}
                >
                  <img
                    src={img}
                    className="CharacterInfo__img"
                    alt="Character"
                  />
                </div>
                <div className="CharacterInfo__data-container">
                  <div className="CharacterInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-character-name"
                    >
                      Name:
                    </label>
                    <input
                      className="generic__input"
                      disabled={!isOwner()}
                      id="info-character-name"
                      value={name}
                      maxLength="50"
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  </div>
                  {nameErrorMessage()}
                  <div className="CharacterInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-character-location"
                    >
                      Location:
                    </label>
                    <input
                      className="generic__input"
                      disabled={!isOwner()}
                      id="info-character-location"
                      value={location}
                      maxLength="50"
                      onChange={(e) => setLocation(e.target.value)}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="CharacterInfo__bot-container">
                <div className="CharacterInfo__input-container">
                  <label
                    className="generic__label"
                    htmlFor="info-character-description"
                  >
                    Character description:
                  </label>
                  <textarea
                    disabled={!isOwner()}
                    className="generic__input  CharacterInfo__input-large"
                    id="info-character-description"
                    value={description}
                    maxLength="3000"
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                {isOwner() ? (
                  <div className="CharacterInfo__input-container">
                    <label
                      className="generic__label"
                      htmlFor="info-private-description"
                    >
                      Private description:
                    </label>
                    <textarea
                      disabled={!isOwner()}
                      className="generic__input CharacterInfo__input-large "
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
        </div>
      )}
    </div>
  );
}

export default CharacterInfo;
