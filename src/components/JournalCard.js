import "../style/JournalInfo.css";

function JounalCard(props) {
  const SELECT_COLOR = "bg-gray-200";
  function isSelected() {
    if (props.current) {
      return props.current.name === props.session.name;
    }
    return false;
  }

  return (
    <div
      className={`JournalCard__container
        ${isSelected() ? SELECT_COLOR : "bg-gray-100"}`}
      onClick={() => props.onClickEvent(props.session)}
    >
      <div
        style={{
          backgroundColor: props.session.color,
        }}
        className="self-stretch shrink-0 w-2 "
      ></div>
      <div className="JournalCard__text">
        <div
          className={`shrink-0 whitespace-nowrap pl-2 py-1 hover:bg-inherit ${
            isSelected() ? SELECT_COLOR : ""
          }`}
        >
          {props.sessionNumber} -
        </div>
        <div
          className={`pl-1 grow hover:bg-inherit ${
            isSelected() ? SELECT_COLOR : ""
          }`}
        >
          {" "}
          {props.session.name}
        </div>
      </div>

      <div
        style={{
          backgroundColor: props.session.color,
        }}
        className="self-stretch shrink-0 w-2"
      ></div>
    </div>
  );
}

export default JounalCard;
