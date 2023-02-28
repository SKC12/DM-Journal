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

export class Location {
  constructor(
    { name, img, location, description, privateDescription },
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
            "/locations",
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
            "/locations",
          this.uid
        )
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  static async loadLocationsFromDB(userID, campaignName) {
    let locArray = [];
    try {
      const query = await getDocs(
        collection(
          db,
          "users/" + userID + "/campaigns/" + campaignName + "/locations"
        )
      );
      query.forEach((doc) => {
        locArray.push(new Location(doc.data(), userID, campaignName));
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
    return locArray;
  }
}
