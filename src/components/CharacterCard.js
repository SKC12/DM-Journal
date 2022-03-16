function CharacterCard(props) {
  function isSelected() {
    if (props.current) {
      return props.current.name === props.character.name;
    }
    return false;
  }

  return (
    <div
      className={`Accordion__item ${isSelected() ? "Accordion__selected" : ""}`}
      onClick={() => props.onClickEvent(props.character)}
    >
      <p>{props.character.name}</p>
    </div>
  );
}

export default CharacterCard;
