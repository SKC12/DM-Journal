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

function CampaignInfo(props) {
  //console.log(props);
  const [name, setName] = useState(
    props.campaign.name ? props.campaign.name : ""
  );
  const [description, setDescription] = useState(
    props.campaign.description ? props.campaign.description : ""
  );
  const [isPrivate, setIsPrivate] = useState(
    props.campaign.private ? props.campaign.private : false
  );
  const [errorMsg, setErrorMsg] = useState(false);

  useEffect(() => {
    setErrorMsg(false);
  }, [name]);

  async function createCampaign(e) {
    e.preventDefault();
    const q = query(
      collection(db, "users/" + props.user.uid + "/campaigns"),
      where("name", "==", name)
    );
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      let campaign = {
        name: name,
        description: description,
        private: isPrivate,
      };
      //console.log(campaign);
      await setDoc(
        doc(db, "users/" + props.user.uid + "/campaigns", campaign.name),
        campaign
      );
      console.log("Document written");
      window.location.reload();
    } else {
      setErrorMsg(true);
    }

    //console.log(props.user);
  }

  async function editCampaign(e) {
    e.preventDefault();
    let campaign = {
      name: name,
      description: description,
      private: isPrivate,
    };
    await setDoc(
      doc(db, "users/" + props.user.uid + "/campaigns", campaign.name),
      campaign
    );
    console.log("Document written");
    window.location.reload();
  }

  async function deleteCampaign(e) {
    e.preventDefault();
    await deleteDoc(doc(db, "users/" + props.user.uid + "/campaigns", name));

    // const q = query(
    //   collection(db, "users/" + props.user.uid + "/campaigns"),
    //   where("name", "==", name)
    // );
    // const docs = await getDocs(q);
    // docs.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
    // console.log(docs);

    window.location.reload();
  }

  let errorMessage = () => {
    return errorMsg ? (
      <p className="text-red-500 text-sm pt-1 pl-5">
        Campaign names must be unique
      </p>
    ) : (
      <p></p>
    );
  };

  //console.log(props.campaign);
  function populate(campaign) {
    if (campaign === "") {
      return;
    } else {
      return (
        <div>
          <form className="pl-24 pt-12 max-w-4xl">
            <div className="flex-col items-center pb-6">
              <label className={LABEL_STYLE} htmlFor="info-campaign-name">
                Campaign name{" "}
              </label>

              <input
                className={`${INPUT_STYLE} w-96`}
                id="info-campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
              {errorMessage()}
            </div>

            <div className="flex-col items-center pb-6 pr-6">
              <label
                className={LABEL_STYLE}
                htmlFor="info-campaign-description"
              >
                Campaign description{" "}
              </label>
              <textarea
                className={`${INPUT_STYLE} w-full h-60 resize-none`}
                id="info-campaign-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex items-center pb-6">
              <label
                className={`${LABEL_STYLE} pb-0 max-w-fit`}
                htmlFor="info-campaign-private"
              >
                Private?
              </label>
              <input
                id="info-campaign-private"
                className="form-checkbox ml-4 h-4 w-4 accent-gray-700"
                type="checkbox"
                checked={isPrivate}
                onChange={() => setIsPrivate(!isPrivate)}
              />
            </div>

            <div className="flex justify-center">
              {campaign === "new" ? (
                <button
                  className="w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                  onClick={(e) => createCampaign(e)}
                >
                  Create Campaign
                </button>
              ) : (
                <>
                  <button
                    className="mx-3 w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                    onClick={(e) => editCampaign(e)}
                  >
                    Edit Campaign
                  </button>
                  <button
                    className="mx-3 w-40 h-10 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
                    onClick={(e) => deleteCampaign(e)}
                  >
                    Delete Campaign
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      );
    }
  }
  return <div className="p-3 bg-gray-300 grow">{populate(props.campaign)}</div>;
}

export default CampaignInfo;
