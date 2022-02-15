import { useEffect, useState } from "react";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const LABEL_STYLE = "w-52 block text-gray-700 font-bold pb-3";
const INPUT_STYLE =
  "bg-gray-200 appearance-none border-2 border-gray-200 rounded p-1 text-gray-700 leading-tight focus:outline-none focus:bg-gray-100 focus:border-gray-700";

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
    props.session.color ? props.session.color : "#b3b3b3"
  );
  const [partyLevel, setPartyLevel] = useState(
    props.session.partyLevel ? props.session.partyLevel : 1
  );

  function createSession() {}

  function editSession() {}

  function deleteSession() {}

  function populate(entry) {
    if (entry === "" || props.campaign === "") {
      return;
    } else {
      return (
        <div>
          <form className="pl-24 pt-12 max-w-4xl">
            <div className="flex">
              <div className="flex-col items-center pb-6">
                <label className={LABEL_STYLE} htmlFor="info-session-name">
                  Session title{" "}
                </label>

                <input
                  className={`${INPUT_STYLE} w-96 mr-8`}
                  id="info-session-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>

              <div className="flex-col items-center pb-6">
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

            <div className="flex">
              <div className="flex-col items-center pb-6">
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

              <div className="flex-col items-center pb-6">
                <label className={LABEL_STYLE} htmlFor="info-session-time">
                  Ingame duration{" "}
                </label>

                <span className="text-gray-700 font-bold">
                  <input
                    type="number"
                    className={`${INPUT_STYLE} w-16 mr-2`}
                    id="info-session-time"
                    value={ingameTime}
                    onChange={(e) => setIngameTime(e.target.value)}
                  ></input>
                  days
                </span>
              </div>

              <div className="flex-col items-center pb-6">
                <label className={LABEL_STYLE} htmlFor="info-session-level">
                  Party level{" "}
                </label>

                <input
                  type="number"
                  className={`${INPUT_STYLE} w-16`}
                  id="info-session-level"
                  value={partyLevel}
                  onChange={(e) => setPartyLevel(e.target.value)}
                ></input>
              </div>
            </div>

            <div className="flex-col items-center pb-6 pr-6">
              <label className={LABEL_STYLE} htmlFor="info-session-description">
                Session description{" "}
              </label>
              <textarea
                className={`${INPUT_STYLE} w-full h-60 resize-none`}
                id="info-session-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-center">
              {entry === "new" ? (
                <button
                  className="w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                  onClick={(e) => createSession(e)}
                >
                  Create Session
                </button>
              ) : (
                <>
                  <button
                    className="mx-3 w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                    onClick={(e) => editSession(e)}
                  >
                    Edit Session
                  </button>
                  <button
                    className="mx-3 w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                    onClick={(e) => deleteSession(e)}
                  >
                    Delete Session
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      );
    }
  }

  return <div className="p-3 bg-gray-300 grow">{populate(props.session)}</div>;
}

export default JournalInfo;
