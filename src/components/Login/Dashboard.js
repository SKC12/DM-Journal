import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { auth, db, logout } from "../../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setName(data.name);
      } catch (err) {
        console.error(err);
        alert("An error occured while fetching user data");
      }
    };
    if (error) return;
    if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, error]);
  return (
    <div className="flex items-center justify-center h-[95vh] w-full bg-gray-300">
      <div className="flex flex-col text-center bg-gray-200 p-8">
        Logged in as
        <div>{name}</div>
        <div>{user?.email}</div>
        <button
          className="p-2 text-lg my-3 border-0 text-white bg-gray-700"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
export default Dashboard;
