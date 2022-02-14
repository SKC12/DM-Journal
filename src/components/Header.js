import { useNavigate } from "react-router-dom";

const NAV_ITEM_STYLE =
  "w-32 text-gray-600 hover:text-gray-700 cursor-pointer font-medium tracking-wide text-lg flex items-center justify-center";

function Header() {
  const navigate = useNavigate();

  return (
    <nav className="md:flex flex-row items-center justify-between px-9 h-[5vh] bg-gray-50">
      <span className="text-5xl text-gray-800 -mb-1"></span>
      <ul className="flex flex-row self-center h-12">
        <li className={NAV_ITEM_STYLE}>Journal</li>
        <li className={NAV_ITEM_STYLE}>Stats</li>
        <li className={NAV_ITEM_STYLE} onClick={() => navigate("/campaign")}>
          Campaign
        </li>
      </ul>
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
