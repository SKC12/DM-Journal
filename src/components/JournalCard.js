function JounalCard(props) {
  //console.log(props.session);

  return (
    <div
      className="flex justify-between items-center cursor-pointer  my-0.5 text-gray-700 bg-gray-100 text-sm"
      onClick={() => props.onClickEvent(props.session)}
    >
      <div
        style={{
          backgroundColor: props.session.color,
        }}
        className="self-stretch shrink-0 w-2 "
      ></div>
      <div className="shrink-0 whitespace-nowrap pl-2 py-1">
        {props.sessionNumber} -
      </div>
      <div className="pl-1 grow"> {props.session.name}</div>
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
