import { useState } from "react";

const Card = (props) => {
  const [side, setSide] = useState(props.front);

  const handleFlip = () => {
    setSide((prevSide) =>
      prevSide === props.front ? props.back : props.front
    );
  };

  return (
    <dir className="card--container">
      <div className="card-btn--container">
        <button
          className="card--btn"
          onClick={() => props.moveToFirst(props.id)}
        >
          {"|<<"}
        </button>
        <button className="card--btn" onClick={() => props.moveLeft(props.id)}>
          {"<<<"}
        </button>

        {props.sides === 2 && (
          <button className="card--btn flip--btn" onClick={handleFlip}>
            Flip
          </button>
        )}
        <button className="card--btn" onClick={() => props.moveRight(props.id)}>
          {">>>"}
        </button>
        <button
          className="card--btn"
          onClick={() => props.moveToLast(props.id)}
        >
          {">>|"}
        </button>
      </div>
      <img key={props.id} className="card--img" src={side} alt="card img" />
    </dir>
  );
};

export default Card;
