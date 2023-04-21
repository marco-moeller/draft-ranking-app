import { useState } from "react";
import { useGlobalContext } from "../context";

const Card = (props) => {
  const [side, setSide] = useState(props.card.front);
  const { updateSelectedCard, toggleShowModal } = useGlobalContext();

  const handleFlip = () => {
    setSide((prevSide) =>
      prevSide === props.card.front ? props.card.back : props.card.front
    );
  };

  return (
    <div className="card--container">
      <div className="card-btn--container">
        <button
          className="card--btn"
          onClick={() => props.moveToFirst(props.card.id)}
        >
          {"|<<"}
        </button>
        <button
          className="card--btn"
          onClick={() => props.moveLeft(props.card.id)}
        >
          {"<<<"}
        </button>
        <button
          className="card--btn"
          onClick={() => props.moveRight(props.card.id)}
        >
          {">>>"}
        </button>
        <button
          className="card--btn"
          onClick={() => props.moveToLast(props.card.id)}
        >
          {">>|"}
        </button>
      </div>
      <img
        key={props.card.id}
        className="card--img"
        src={side}
        alt="card img"
        onClick={() => {
          updateSelectedCard(props.card);
          toggleShowModal(true);
        }}
      />{" "}
      {props.card.sides === 2 && (
        <button className="card--btn flip--btn" onClick={handleFlip}>
          <img
            className="flip--icon"
            src={require("../images/flip.png")}
            alt="Flip"
          />
        </button>
      )}
    </div>
  );
};

export default Card;
