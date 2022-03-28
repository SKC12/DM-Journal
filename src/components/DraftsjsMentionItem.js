import { useEffect, useRef, useState } from "react";
import { usePopper } from "react-popper";
import { useNavigate } from "react-router-dom";

export default function DraftjsMentionItem(props) {
  const params = props.params;

  const navigate = useNavigate();
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const item = getItem(props.item.id);
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "right-end",
      container: "body",
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [-25, 0],
          },
        },
      ],
    }
  );
  const [isPopout, setIsPopout] = useState(false);
  const isMounted = useRef(false);

  function getItem(itemID) {
    if (props.characters) {
      //console.log(props.characters);
      let char = props.characters.find((item) => item.uid === itemID);
      //console.log(char);
      if (char) return char;
    }
    if (props.locations) {
      let loc = props.locations.find((item) => item.uid === itemID);
      //console.log(loc);

      if (loc) return loc;
    }

    // if (props.item.item) {
    //   // let item = props.item.item.find((item) => item.uid === itemID);
    //   console.log("ITEM", props.item.item);
    //   return props.item.item;
    // }

    //console.log("NOPE");

    return null;
  }

  function getNavigateUrl(params) {
    if (params.user && params.campaign) {
      return (
        "/" +
        props.item.type +
        "/" +
        params.user +
        "/" +
        params.campaign +
        "/" +
        props.item.name
      );
    }
  }

  //Updates Popper position. Necessary because it starts unmounted
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
      <span
        className="popper__linked-element"
        ref={setReferenceElement}
        onClick={() => navigate(getNavigateUrl(params))}
        onMouseOver={() => setIsPopout(true)}
        onMouseOut={() => setIsPopout(false)}
      >
        {props.content}
      </span>

      <div
        className="popper__main"
        hidden={!isPopout}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        <div className="popper__top">
          <img className="popper__img" alt="" src={props.item.avatar}></img>
          <p className="popper__name">{props.item.name}</p>
        </div>
        <p className="popper__folder">{props.item.folder}</p>
        <p className="popper__folder">{item ? item.location : "Not found"}</p>
      </div>
    </>
  );
}
