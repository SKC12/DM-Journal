import { useState } from "react";
import "../style/Accordion.css";

function Accordion(props) {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="Accordion__container">
      <div className="Accordion__title" onClick={() => setIsActive(!isActive)}>
        <div className="Accordion__text">{isActive ? "-" : "+"}</div>
        <div className="Accordion__text">{props.title}</div>
      </div>
      {isActive && <div className="Accordion__content">{props.content}</div>}
    </div>
  );
}

export default Accordion;
