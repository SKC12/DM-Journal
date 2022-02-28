import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { useParams } from "react-router-dom";
import {
  searchFirebaseForSessionName,
  writeSessionToFirebase,
  sortSessionsByDate,
  deleteSessionFromFirebase,
  containsInvalidCharacters,
} from "../helpers.js";

const LABEL_STYLE = "w-52 block text-gray-700 font-bold py-2";
const INPUT_STYLE =
  "bg-gray-200 appearance-none border-2 border-gray-200 rounded p-1 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-700";

function JournalInfo(props) {
  //console.log(props);
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
    props.session.color ? props.session.color : "#b3b3b3"
  );
  const [partyLevel, setPartyLevel] = useState(
    props.session.partyLevel ? props.session.partyLevel : 1
  );
  const [errorMsg, setErrorMsg] = useState(false);
  const [dateErrorMsg, setDateErrorMsg] = useState(false);

  const params = useParams();

  const uid = props.session.uid;

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  useEffect(() => {
    setDateErrorMsg(false);
  }, [date]);

  //Adds session to Database
  async function createSession(e) {
    e.preventDefault();

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
      const docs = await searchFirebaseForSessionName(
        props.user.uid,
        props.campaign.name,
        name
      );
      if (docs.docs.length === 0) {
        await writeSessionToFirebase(
          props.user.uid,
          props.campaign.name,
          session
        );
        let newSessions = sortSessionsByDate(props.sessions.concat(session));
        props.setSessions(newSessions);
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
  async function editSession(e) {
    e.preventDefault();
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
      await writeSessionToFirebase(
        props.user.uid,
        props.campaign.name,
        session
      );
      let newArr = props.sessions.map((entry) => {
        return entry.uid === uid ? session : entry;
      });
      props.setSessions(sortSessionsByDate(newArr));
    }
  }

  //Deletes session
  async function deleteSession(e) {
    e.preventDefault();
    try {
      await deleteSessionFromFirebase(props.user.uid, props.campaign.name, uid);

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

  let titleErrorMessage = () => {
    return errorMsg ? (
      <p className="text-red-500 text-sm pt-1 pl-1">
        Session names must be unique and cannot contain forward slashes ("/")
      </p>
    ) : null;
  };

  let dateErrorMessage = () => {
    return dateErrorMsg ? (
      <p className="text-red-500 text-sm pt-1 pl-1">Invalid session date</p>
    ) : null;
  };

  const buttons = (entry) => (
    <div className="flex justify-center h-10 items-stretch">
      {entry === "new" ? (
        <button
          className="px-2 md:w-40 md:h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          onClick={(e) => createSession(e)}
        >
          Create Session
        </button>
      ) : (
        <>
          <button
            className="mx-3 px-2 md:w-40 md:h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
            onClick={(e) => editSession(e)}
          >
            Edit Session
          </button>
          <button
            className="mx-3 px-2 md:w-40 md:h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
            onClick={(e) => deleteSession(e)}
          >
            Delete Session
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
      return;
    } else {
      return (
        <div>
          <form className="md:pl-20 md:pt-12 md:max-w-4xl">
            <div className="md:flex ">
              <div className="flex-col items-center">
                <label className={LABEL_STYLE} htmlFor="info-session-name">
                  Session title{" "}
                </label>

                <input
                  className={`${INPUT_STYLE} md:w-96 mr-8`}
                  id="info-session-name"
                  value={name}
                  maxLength="50"
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>

              <div className="flex-col items-center">
                <label className={LABEL_STYLE} htmlFor="info-session-color">
                  Color{" "}
                </label>

                <input
                  type="color"
                  className={`${INPUT_STYLE} h-10`}
                  id="info-session-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                ></input>
              </div>
            </div>

            {titleErrorMessage()}

            <div className="md:flex md:pt-6">
              <div className="flex-col items-center ">
                <label className={LABEL_STYLE} htmlFor="info-session-date">
                  Session date{" "}
                </label>

                <input
                  type="date"
                  className={`${INPUT_STYLE}`}
                  id="info-session-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                ></input>
              </div>

              <div className="flex-col items-center ">
                <label className={LABEL_STYLE} htmlFor="info-session-time">
                  Ingame duration{" "}
                </label>

                <span className="text-gray-700 font-bold">
                  <input
                    type="number"
                    className={`${INPUT_STYLE} w-16 mr-2`}
                    id="info-session-time"
                    value={ingameTime}
                    min="0"
                    max="9999"
                    onChange={(e) => setIngameTime(e.target.value)}
                  ></input>
                  days
                </span>
              </div>

              <div className="flex-col items-center ">
                <label className={LABEL_STYLE} htmlFor="info-session-level">
                  Party level{" "}
                </label>

                <input
                  type="number"
                  className={`${INPUT_STYLE} w-16`}
                  id="info-session-level"
                  value={partyLevel}
                  min="0"
                  max="99"
                  onChange={(e) => setPartyLevel(e.target.value)}
                ></input>
              </div>
            </div>
            {dateErrorMessage()}

            <div className="flex-col items-center pb-6 md:pt-6 md:pr-6">
              <label className={LABEL_STYLE} htmlFor="info-session-description">
                Session description{" "}
              </label>
              <textarea
                className={`${INPUT_STYLE} w-full h-32 md:h-60 resize-none`}
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

  return <div className="p-3 bg-gray-300 grow ">{populate(props.session)}</div>;
}

export default JournalInfo;
