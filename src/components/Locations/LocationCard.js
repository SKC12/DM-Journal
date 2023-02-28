function LocationCard(props) {
  function isSelected() {
    if (props.current) {
      return props.current.name === props.location.name;
    }
    return false;
  }

  return (
    <div
      className={`Accordion__item ${isSelected() ? "Accordion__selected" : ""}`}
      onClick={() => props.onClickEvent(props.location)}
    >
      <p>{props.location.name}</p>
    </div>
  );
}

export default LocationCard;
