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

//Load campaigns array from database
async function loadCampaignsFromDatabase(userID, navigate) {
  let campArray = [];
  try {
    const query = await getDocs(
      collection(db, "users/" + userID + "/campaigns")
    );
    query.forEach((doc) => {
      campArray.push(doc.data());
    });
  } catch (e) {
    console.log(e);
    navigate("/error");
  }

  //console.log("LOADING CAMPAIGNS FROM DB");

  return campArray;
}

//Loads category array from Firebase
async function loadFromFirebase(categoryString, userID, campName, navigate) {
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
    navigate("/error");
  }

  //console.log("LOADING ITEMS FROM DB");

  return itemsArray;
}

function sortSessionsByDate(sessionsArray) {
  return sessionsArray.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

async function searchFirebaseForCampaignName(userID, name) {
  try {
    const q = query(
      collection(db, "users/" + userID + "/campaigns"),
      where("name", "==", name)
    );
    const docs = await getDocs(q);
    return docs;
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

async function writeCampaignToFirebase(userID, campaignName, campaign) {
  try {
    await setDoc(
      doc(db, "users/" + userID + "/campaigns", campaignName),
      campaign
    );
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

//Searches Firebase on given category to check if itemName exists
async function searchFirebaseForName(
  categoryString,
  userID,
  campaignName,
  itemName
) {
  try {
    const q = query(
      collection(
        db,
        "users/" + userID + "/campaigns/" + campaignName + `/${categoryString}`
      ),
      where("name", "==", itemName)
    );
    const docs = await getDocs(q);
    return docs;
  } catch (e) {
    console.log(e);
    alert(e);
  }

  //console.log("SEARCHING FIREBASE FOR NAME")
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
    alert(e);
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
    alert(e);
  }
}

async function deleteCampaignFromFirebase(userID, name) {
  try {
    const q = query(
      collection(db, "users/" + userID + "/campaigns/" + name + "/sessions")
    );
    const docs = await getDocs(q);

    const deletions = [];
    docs.forEach((doc) => {
      deletions.push(deleteDoc(doc.ref));
    });

    Promise.all(deletions).then();

    await deleteDoc(doc(db, "users/" + userID + "/campaigns", name));
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

function containsInvalidCharacters(string) {
  return string.includes("/");
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
  searchFirebaseForCampaignName,
  writeCampaignToFirebase,
  loadFromFirebase,
  loadCampaignsFromDatabase,
  searchFirebaseForName,
  writeToFirebase,
  sortSessionsByDate,
  deleteFromFirebase,
  deleteCampaignFromFirebase,
  containsInvalidCharacters,
  isOwner,
};
