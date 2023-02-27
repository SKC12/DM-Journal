import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

//Loads category array from Firebase
async function loadFromFirebase(categoryString, userID, campName) {
  let itemsArray = [];
  try {
    const query = await getDocs(
      collection(
        db,
        "users/" + userID + "/campaigns/" + campName + `/${categoryString}`
      )
    );
    query.forEach((doc) => {
      itemsArray.push(doc.data());
    });
  } catch (e) {
    console.log(e);
    throw e;
  }

  //console.log("LOADING " + categoryString + " FROM DB");

  return itemsArray;
}

// Writes to Firebase on given category.
async function writeToFirebase(categoryString, userID, campaignName, item) {
  try {
    await setDoc(
      doc(
        db,
        "users/" + userID + "/campaigns/" + campaignName + `/${categoryString}`,
        item.uid
      ),
      item
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
}

//Deletes from Firebase on given category.
async function deleteFromFirebase(
  categoryString,
  userID,
  campaignName,
  itemID
) {
  try {
    await deleteDoc(
      doc(
        db,
        "users/" + userID + "/campaigns/" + campaignName + `/${categoryString}`,
        itemID
      )
    );
  } catch (e) {
    console.log(e);
    throw e;
  }
}

function sortSessionsByDate(sessionsArray) {
  return sessionsArray.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

function containsInvalidCharacters(string) {
  return string.includes("/") || string.includes("^");
}

function isOwner(user, currentUserID) {
  if (!user) {
    return false;
  } else if (!currentUserID || user.uid === currentUserID) {
    return true;
  }
  return false;
}

export {
  //searchFirebaseForCampaignName,
  //writeCampaignToFirebase,
  //loadCampaignsFromDatabase,
  //deleteCampaignFromFirebase,
  writeToFirebase,
  loadFromFirebase,
  deleteFromFirebase,
  sortSessionsByDate,
  containsInvalidCharacters,
  isOwner,
};
