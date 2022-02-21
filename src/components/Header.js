import { useNavigate } from "react-router-dom";

// import annalData from "../entries.json";

// import { nanoid } from "nanoid";

// import {
//   collection,
//   doc,
//   setDoc,
//   query,
//   where,
//   getDocs,
//   deleteDoc,
// } from "firebase/firestore";
// import { db } from "../firebase";

const NAV_ITEM_STYLE =
  "w-32 text-gray-600 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-lg flex items-center justify-center";

function Header() {
  const navigate = useNavigate();

  // async function testFunction() {
  //   // console.log(annalData);
  //   // console.log(annalData[1]);
  //   // console.log(annalData[1].sessionDate);
  //   // console.log(new Date(annalData[1].sessionDate));

  //   // let d = annalData[1].sessionDate.split("/");
  //   // let d2 = `${d[1]}/${d[0]}/${d[2]}`;
  //   // console.log(d2);
  //   // console.log(new Date(d2));

  //   let newAnnals = [];
  //   annalData.map((entry) => {
  //     let d = entry.sessionDate.split("/");
  //     let d2 = `${d[2]}-${d[1]}-${d[0]}`;
  //     let session = {
  //       name: entry.name,
  //       color: "#b5b5b5",
  //       date: d2,
  //       ingameTime: 0,
  //       partyLevel: 1,
  //       description: entry.description,
  //       uid: nanoid(),
  //     };
  //     newAnnals.push(session);
  //   });
  //   for (let i = 0; i < newAnnals.length; i++) {
  //     let session = newAnnals[i];
  //     await setDoc(
  //       doc(
  //         db,
  //         "/users/Bd9wDUpfplcwS5JFroPs14mVb1K3/campaigns/Companhia de Khatovar/sessions",
  //         session.uid
  //       ),
  //       session
  //     );
  //   }

  //   console.log(newAnnals);
  // }

  return (
    <nav className="md:flex flex-row items-center justify-between px-9 h-[5vh] bg-gray-50">
      <span className="text-5xl text-gray-800 -mb-1"></span>
      <ul className="flex flex-row self-center h-12">
        <li className={NAV_ITEM_STYLE} onClick={() => navigate("/journal")}>
          Journal
        </li>
        <li className={NAV_ITEM_STYLE} onClick={() => navigate("/stats")}>
          Stats
        </li>
        <li className={NAV_ITEM_STYLE} onClick={() => navigate("/campaign")}>
          Campaign
        </li>
      </ul>
      {/* <button onClick={() => testFunction()}>TEST</button> */}
      <button
        className="w-20 bg-white hover:bg-gray-50 border-2 border-gray-900 text-sm text-gray-900 py-1 px-3 rounded-lg font-medium tracking-wide leading-none"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </nav>
  );
}

export default Header;
