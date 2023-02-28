import { nanoid } from "nanoid";
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { containsInvalidCharacters, sortSessionsByDate } from "../helpers";

export class Session {
  constructor(
    {
      name,
      color,
      date,
      arc,
      ingameTime,
      partyLevel,
      description = "",
      uid = nanoid(),
    },
    userID,
    campaignName
  ) {
    this.userID = userID;
    this.campaignName = campaignName;
    this.name = name;
    this.color = color;
    this.date = date;
    this.arc = arc;
    this.ingameTime = ingameTime;
    this.partyLevel = partyLevel;
    this.description = description;
    this.uid = uid;
  }

  isValidName() {
    if (
      this.name === "" ||
      this.name === "createnew" ||
      containsInvalidCharacters(this.name)
    ) {
      return false;
    }

    return true;
  }

  isValidDate() {
    let date = new Date(this.date);
    return date instanceof Date && !isNaN(date.valueOf());
  }

  async saveToDB() {
    try {
      await setDoc(
        doc(
          db,
          "users/" +
            this.userID +
            "/campaigns/" +
            this.campaignName +
            "/sessions",
          this.uid
        ),
        {
          name: this.name,
          color: this.color,
          date: this.date,
          arc: this.arc,
          ingameTime: this.ingameTime,
          partyLevel: this.partyLevel,
          description: this.description,
          uid: this.uid,
        }
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteFromDB() {
    try {
      await deleteDoc(
        doc(
          db,
          "users/" +
            this.userID +
            "/campaigns/" +
            this.campaignName +
            "/sessions",
          this.uid
        )
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async loadSessionsFromDB(userID, campaignName) {
    let sessionArray = [];
    try {
      const query = await getDocs(
        collection(
          db,
          "users/" + userID + "/campaigns/" + campaignName + "/sessions"
        )
      );
      query.forEach((doc) => {
        console.log(doc.data());
        sessionArray.push(new Session(doc.data(), userID, campaignName));
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    sortSessionsByDate(sessionArray);
    return sessionArray;
  }
}
