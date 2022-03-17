import { useEffect, useState } from "react";
import "../style/Accordion.css";

let chevronDown = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

let chevronRight = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

function Accordion(props) {
  const [isActive, setIsActive] = useState(false);

  //For cases where an Accordion should inilialize open
  useEffect(() => {
    if (props.startOpen === props.title) {
      setIsActive(true);
    }
  }, [props.startOpen, props.title]);

  return (
    <div className="Accordion__container">
      <div className="Accordion__title" onClick={() => setIsActive(!isActive)}>
        {isActive ? chevronDown : chevronRight}
        <div className="Accordion__text">{props.title}</div>
      </div>
      {isActive && <div className="Accordion__content">{props.content}</div>}
    </div>
  );
}

export default Accordion;
