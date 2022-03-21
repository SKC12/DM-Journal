import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "animate.css";
import "../style/JournalInfo.css";

import {
  writeToFirebase,
  sortSessionsByDate,
  deleteFromFirebase,
  containsInvalidCharacters,
} from "../helpers.js";

function JournalInfo(props) {
  const [name, setName] = useState(
    props.session.name ? props.session.name : ""
  );
  const [date, setDate] = useState(
    props.session.date ? props.session.date : ""
  );
  const [ingameTime, setIngameTime] = useState(
    props.session.ingameTime ? props.session.ingameTime : 0
  );
  const [description, setDescription] = useState(
    props.session.description ? props.session.description : ""
  );
  const [color, setColor] = useState(
    props.session.color
      ? props.session.color
      : props.sessions.length > 0
      ? props.sessions[props.sessions.length - 1].color
      : "#729fcf"
  );
  const [partyLevel, setPartyLevel] = useState(
    props.session.partyLevel
      ? props.session.partyLevel
      : props.sessions.length > 0
      ? props.sessions[props.sessions.length - 1].partyLevel
      : 1
  );
  const [errorMsg, setErrorMsg] = useState(false);
  const [dateErrorMsg, setDateErrorMsg] = useState(false);
  const [isEditable, setIsEditable] = useState(false);

  const params = useParams();

  const uid = props.session.uid;

  useEffect(() => {
    if (props.session === "new") {
      setIsEditable(true);
    }
  }, [props.session]);

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  useEffect(() => {
    setDateErrorMsg(false);
  }, [date]);

  //Adds session to Database
  async function createSession() {
    let session = {
      name: name,
      color: color,
      date: date,
      ingameTime: ingameTime,
      partyLevel: partyLevel,
      description: description,
      uid: nanoid(),
    };

    if (isValidSession(session)) {
      if (props.sessions.filter((e) => e.name === session.name).length === 0) {
        await writeToFirebase(
          "sessions",
          props.user.uid,
          props.campaign.name,
          session
        );
        let newSessions = sortSessionsByDate(props.sessions.concat(session));
        props.setSessions(newSessions);
        props.setSession(session);
      } else {
        setErrorMsg(true);
      }
    }
  }

  function isValidSession(session) {
    if (session.name === "" || containsInvalidCharacters(session.name)) {
      setErrorMsg(true);
      return false;
    }
    let date = new Date(session.date);
    if (!(date instanceof Date && !isNaN(date.valueOf()))) {
      setDateErrorMsg(true);
      return false;
    }

    return true;
  }

  //Edits session
  async function editSession() {
    let session = {
      name: name,
      color: color,
      date: date,
      ingameTime: ingameTime,
      partyLevel: partyLevel,
      description: description,
      uid: uid,
    };
    if (isValidSession(session)) {
      if (
        name === props.session.name ||
        props.sessions.filter((e) => e.name === session.name).length === 0
      ) {
        await writeToFirebase(
          "sessions",
          props.user.uid,
          props.campaign.name,
          session
        );
        let newArr = props.sessions.map((entry) => {
          return entry.uid === uid ? session : entry;
        });
        props.setSessions(sortSessionsByDate(newArr));
      } else {
        setErrorMsg(true);
      }
    }
  }

  //Deletes session
  async function deleteSession() {
    try {
      await deleteFromFirebase(
        "sessions",
        props.user.uid,
        props.campaign.name,
        uid
      );

      //Removes session from state
      props.setSessions(
        props.sessions.filter((entry) => {
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
  const sessionDeleteAlert = (e) => {
    e.preventDefault();
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui JournalInfo__delete-alert-container">
            <div className="JournalInfo__delete-alert-text-container">
              <p className="">Are you sure you want to delete this session?</p>
              <p className="">The process is irreversible.</p>
            </div>

            <div className="JournalInfo__delete-alert-button-container">
              <button
                onClick={() => {
                  deleteSession(e);
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
    setName(props.session.name);
    setDate(props.session.date);
    setColor(props.session.color);
    setIngameTime(props.session.ingameTime);
    setPartyLevel(props.session.partyLevel);
    setDescription(props.session.description);
  }

  let titleErrorMessage = () => {
    return errorMsg ? (
      <p className="generic__alert-text">
        Session names must be unique and cannot contain forward slashes ("/")
      </p>
    ) : null;
  };

  let dateErrorMessage = () => {
    return dateErrorMsg ? (
      <p className="generic__alert-text">Invalid session date</p>
    ) : null;
  };

  const buttons = (entry) => (
    <div className="flex justify-center h-10 items-stretch gap-3">
      {entry === "new" ? (
        <button
          className="generic__buttons"
          onClick={(e) => {
            e.preventDefault();
            createSession();
          }}
        >
          Create Session
        </button>
      ) : (
        <>
          <button
            className="generic__buttons"
            onClick={(e) => {
              e.preventDefault();
              if (isEditable) {
                editSession();
                setIsEditable(false);
              } else {
                setIsEditable(true);
              }
            }}
          >
            {isEditable ? "Save" : "Edit Session"}
          </button>
          <button
            className="generic__buttons"
            onClick={(e) => {
              e.preventDefault();
              if (isEditable) {
                returnToInitialValues();
                setIsEditable(false);
              } else {
                sessionDeleteAlert();
              }
            }}
          >
            {isEditable ? "Cancel" : "Delete Session"}
          </button>
        </>
      )}
    </div>
  );

  function isOwner() {
    if (!props.user) {
      return false;
    } else if (props.user.uid === params.user) {
      return true;
    }
    return false;
  }

  function populate(entry) {
    if (entry === "" || props.campaign === "") {
      return null;
    } else {
      return (
        <div className="animate__animated animate__fadeIn">
          <form className="generic__main-form">
            <div className="md:flex">
              <div className="JournalInfo__input-container">
                <label className="generic__label" htmlFor="info-session-name">
                  Session title{" "}
                </label>

                <input
                  disabled={!isOwner() || !isEditable}
                  className="generic__input md:w-96 mr-8"
                  id="info-session-name"
                  value={name}
                  maxLength="50"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>

              <div className="JournalInfo__input-container">
                <label className="generic__label" htmlFor="info-session-color">
                  Color{" "}
                </label>

                <input
                  disabled={!isOwner() || !isEditable}
                  type="color"
                  className="generic__input w-12"
                  id="info-session-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                ></input>
              </div>
            </div>

            {titleErrorMessage()}

            <div className="md:flex md:pt-6">
              <div className="JournalInfo__input-container mr-4">
                <label className="generic__label" htmlFor="info-session-date">
                  Session date{" "}
                </label>

                <input
                  disabled={!isOwner() || !isEditable}
                  type="date"
                  className="generic__input"
                  id="info-session-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                ></input>
              </div>

              <div className="JournalInfo__input-container">
                <label className="generic__label" htmlFor="info-session-time">
                  Ingame duration{" "}
                </label>

                <span>
                  <input
                    disabled={!isOwner() || !isEditable}
                    type="number"
                    className={`generic__input text-right w-16 mr-2`}
                    id="info-session-time"
                    value={ingameTime}
                    min="0"
                    max="9999"
                    onChange={(e) => setIngameTime(e.target.value)}
                  ></input>
                  days
                </span>
              </div>

              <div className="JournalInfo__input-container">
                <label className="generic__label" htmlFor="info-session-level">
                  Party level{" "}
                </label>

                <input
                  disabled={!isOwner() || !isEditable}
                  type="number"
                  className="generic__input w-16"
                  id="info-session-level"
                  value={partyLevel}
                  min="0"
                  max="99"
                  onChange={(e) => setPartyLevel(e.target.value)}
                ></input>
              </div>
            </div>
            {dateErrorMessage()}

            <div className="JournalInfo__input-container pb-6 md:pt-6 md:pr-6">
              <label
                className="generic__label"
                htmlFor="info-session-description"
              >
                Session description{" "}
              </label>
              <textarea
                disabled={!isOwner() || !isEditable}
                className="generic__input w-full h-32 md:h-60 resize-none"
                id="info-session-description"
                value={description}
                maxLength="3000"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            {isOwner() ? buttons(entry) : null}
          </form>
        </div>
      );
    }
  }

  return <div className="grow overflow-auto">{populate(props.session)}</div>;
}

export default JournalInfo;
