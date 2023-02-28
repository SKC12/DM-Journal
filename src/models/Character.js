import { nanoid } from "nanoid";
import { db } from "../firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { containsInvalidCharacters } from "../helpers";

export class Character {
  constructor(
    { name, img, description, location, privateDescription },
    userID,
    campaignName
  ) {
    this.userID = userID;
    this.campaignName = campaignName;
    this.name = name;
    this.img = img;
    this.location = location;
    this.description = description;
    this.privateDescription = privateDescription;
    this.uid = nanoid();
  }

  isValid() {
    return !(this.name === "" || containsInvalidCharacters(this.name));
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
            "/characters",
          this.uid
        ),
        {
          name: this.name,
          img: this.img,
          location: this.location,
          description: this.description,
          privateDescription: this.privateDescription,
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
            "/characters",
          this.uid
        )
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async loadCharactersFromDB(userID, campaignName) {
    let charArray = [];
    try {
      const query = await getDocs(
        collection(
          db,
          "users/" + userID + "/campaigns/" + campaignName + "/characters"
        )
      );
      query.forEach((doc) => {
        charArray.push(new Character(doc.data(), userID, campaignName));
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    return charArray;
  }
}
