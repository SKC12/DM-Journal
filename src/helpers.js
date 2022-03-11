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

//Loads session array from Database, sorted by Date
async function loadSessionsFromDatabase(userID, campName, navigate) {
  let sessionsArray = [];
  try {
    const query = await getDocs(
      collection(db, "users/" + userID + "/campaigns/" + campName + "/sessions")
    );
    query.forEach((doc) => {
      sessionsArray.push(doc.data());
    });
  } catch (e) {
    console.log(e);
    navigate("/error");
  }
  sortSessionsByDate(sessionsArray);

  //console.log("LOADING SESSIONS FROM DB");

  return sessionsArray;
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

async function searchFirebaseForSessionName(userID, campaignName, sessionName) {
  try {
    const q = query(
      collection(
        db,
        "users/" + userID + "/campaigns/" + campaignName + "/sessions"
      ),
      where("name", "==", sessionName)
    );
    const docs = await getDocs(q);
    return docs;
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

// Writes session to Firebase.
async function writeSessionToFirebase(userID, campaignName, session) {
  try {
    await setDoc(
      doc(
        db,
        "users/" + userID + "/campaigns/" + campaignName + "/sessions",
        session.uid
      ),
      session
    );
  } catch (e) {
    console.log(e);
    alert(e);
  }
}

async function deleteSessionFromFirebase(userID, campaignName, sessionID) {
  try {
    await deleteDoc(
      doc(
        db,
        "users/" + userID + "/campaigns/" + campaignName + "/sessions",
        sessionID
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
  loadSessionsFromDatabase,
  loadCampaignsFromDatabase,
  searchFirebaseForSessionName,
  writeSessionToFirebase,
  sortSessionsByDate,
  deleteSessionFromFirebase,
  deleteCampaignFromFirebase,
  containsInvalidCharacters,
  isOwner,
};
