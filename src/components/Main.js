import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Main() {
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (error) return;
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (!user) navigate("/login");
    if (user) navigate("/journal");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, error]);

  return <div className="bg-gray-300"></div>;
}

export default Main;
