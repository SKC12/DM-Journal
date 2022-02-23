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
      className={`flex justify-between items-center cursor-pointer  my-0.5 text-gray-700 text-sm {
        ${isSelected() ? SELECT_COLOR : "bg-gray-100"}`}
      onClick={() => props.onClickEvent(props.session)}
    >
      <div
        style={{
          backgroundColor: props.session.color,
        }}
        className="self-stretch shrink-0 w-2 "
      ></div>
      <div
        className={`shrink-0 whitespace-nowrap pl-2 py-1 ${
          isSelected() ? SELECT_COLOR : ""
        }`}
      >
        {props.sessionNumber} -
      </div>
      <div className={`pl-1 grow ${isSelected() ? SELECT_COLOR : ""}`}>
        {" "}
        {props.session.name}
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
