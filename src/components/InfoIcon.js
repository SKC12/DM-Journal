import React, { useState, useRef, useEffect } from "react";
import { usePopper } from "react-popper";
import infoIcon from "../img/info-circle.svg";

const Info = (props) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [isPopout, setIsPopout] = useState(false);
  const isMounted = useRef(false);
  const content = props.content;

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "right-end",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [-10, 0],
          },
        },
      ],
    }
  );

  useEffect(() => {
    async function updatePopper() {
      await update();
    }
    isMounted.current = true;
    if (update && isMounted) {
      updatePopper();
    }
    return () => {
      isMounted.current = false;
    };
  }, [isPopout, update]);

  return (
    <>
      <img
        alt=""
        src={infoIcon}
        className="generic__infoIcon"
        ref={setReferenceElement}
        onMouseOver={() => setIsPopout(true)}
        onMouseOut={() => setIsPopout(false)}
        onClick={() => setIsPopout(!isPopout)}
      />

      <div
        className="popper__info"
        hidden={!isPopout}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {content}
      </div>
    </>
  );
};

export default Info;
