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
async function loadCampaignsFromDatabase(userID) {
  let campArray = [];
  const query = await getDocs(collection(db, "users/" + userID + "/campaigns"));
  query.forEach((doc) => {
    campArray.push(doc.data());
  });
  return campArray;
}

//Loads session array from Database, sorted by Date
async function loadSessionsFromDatabase(userID, campName) {
  let sessionsArray = [];
  const query = await getDocs(
    collection(db, "users/" + userID + "/campaigns/" + campName + "/sessions")
  );
  query.forEach((doc) => {
    sessionsArray.push(doc.data());
  });
  sortSessionsByDate(sessionsArray);
  return sessionsArray;
}

function sortSessionsByDate(sessionsArray) {
  return sessionsArray.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
}

async function searchFirebaseForCampaignName(userID, name) {
  const q = query(
    collection(db, "users/" + userID + "/campaigns"),
    where("name", "==", name)
  );
  const docs = await getDocs(q);
  return docs;
}

async function writeCampaignToFirebase(userID, campaignName, campaign) {
  await setDoc(
    doc(db, "users/" + userID + "/campaigns", campaignName),
    campaign
  );
}

async function searchFirebaseForSessionName(userID, campaignName, sessionName) {
  const q = query(
    collection(
      db,
      "users/" + userID + "/campaigns/" + campaignName + "/sessions"
    ),
    where("name", "==", sessionName)
  );
  const docs = await getDocs(q);
  return docs;
}

// Writes session to Firebase.
async function writeSessionToFirebase(userID, campaignName, session) {
  console.log(userID, campaignName, session);
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
  await deleteDoc(
    doc(
      db,
      "users/" + userID + "/campaigns/" + campaignName + "/sessions",
      sessionID
    )
  );
}

async function deleteCampaignFromFirebase(userID, name) {
  await deleteDoc(doc(db, "users/" + userID + "/campaigns", name));
}

function containsInvalidCharacters(string) {
  return string.includes("/");
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
};
