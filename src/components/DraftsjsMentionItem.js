import { useEffect, useState } from "react";
import { usePopper } from "react-popper";

export default function DraftjsMentionItem(props) {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: "right-end",
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

  useEffect(() => {
    async function updatePopper() {
      await update();
    }
    if (update) {
      updatePopper();
    }
  }, [isPopout, update]);

  //console.log(props);

  return (
    <>
      <span
        className="popper__linked-element"
        ref={setReferenceElement}
        // eslint-disable-next-line no-alert
        onClick={() => console.log("Clicked on the Mention!")}
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
      </div>
    </>
  );
}
