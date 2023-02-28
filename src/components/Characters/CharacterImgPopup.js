import { useState } from "react";

function CharacterImagePopup(props) {
  const [url, setUrl] = useState(
    props.img === props.genericImage ? "" : props.img
  );
  return (
    <div
      className="ImgPopup__outer-container"
      onClick={() => props.isVisible(false)}
    >
      <div className="ImgPopup__container" onClick={(e) => e.stopPropagation()}>
        <form className="ImgPopup__form">
          <div className="ImgPopup__top">
            <label className="ImgPopup__label" htmlFor="ImgPopup-input">
              Image url:
            </label>
            <input
              className="ImgPopup__input"
              type="url"
              id="ImgPopup-input"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            ></input>
          </div>
          <div className="ImgPopup__bot">
            <button
              className="ImgPopup__button"
              onClick={(e) => {
                e.preventDefault();
                props.setImg(url);
                props.isVisible(false);
              }}
            >
              Update
            </button>
            <button
              className="ImgPopup__button"
              onClick={(e) => {
                e.preventDefault();
                props.setImg(props.genericImage);
                props.isVisible(false);
              }}
            >
              Remove
            </button>
            <button
              className="ImgPopup__button"
              onClick={(e) => {
                e.preventDefault();
                setUrl("");
                props.isVisible(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CharacterImagePopup;
