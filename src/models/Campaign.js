import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export class Campaign {
  constructor({ name, description, isPrivate = true, options }, userID) {
    this.userID = userID;
    this.name = name;
    this.description = description;
    this.private = isPrivate;
    this.options = {
      ingameTime: options.ingameTime || true,
      level: options.level || true,
      arc: options.arc || true,
    };
  }

  async saveToDB() {
    try {
      await setDoc(doc(db, "users/" + this.userID + "/campaigns", this.name), {
        name: this.name,
        description: this.description,
        private: this.private,
        options: this.options,
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async existsInDB() {
    try {
      const q = query(
        collection(db, "users/" + this.userID + "/campaigns"),
        where("name", "==", this.name)
      );
      const docs = await getDocs(q);
      return !docs.docs.length === 0;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteFromDB() {
    try {
      const q = query(
        collection(
          db,
          "users/" + this.userID + "/campaigns/" + this.name + "/sessions"
        )
      );
      const docs = await getDocs(q);

      const deletions = [];
      docs.forEach((doc) => {
        deletions.push(deleteDoc(doc.ref));
      });

      Promise.all(deletions).then();
      await deleteDoc(
        doc(db, "users/" + this.userID + "/campaigns", this.name)
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
