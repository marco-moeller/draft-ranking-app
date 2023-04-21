import { useState } from "react";
import { useGlobalContext } from "../context";

const CardModal = () => {
  const { selectedCard, toggleShowModal } = useGlobalContext();
  const [side, setSide] = useState(selectedCard.front);

  const [rotate, setRotate] = useState(selectedCard.sides === 2);

  const handleFlip = () => {
    setSide((prevSide) =>
      prevSide === selectedCard.front ? selectedCard.back : selectedCard.front
    );
    setRotate((prevRotate) => !prevRotate);
  };

  return (
    <aside className="modal--overlay" onClick={() => toggleShowModal(false)}>
      <div className="modal--container">
        <div className="card--container">
          <img
            key={selectedCard.id}
            className={rotate ? "card--img--modal rotate" : "card--img--modal"}
            src={side}
            alt="card img"
          />
          {selectedCard.sides === 2 && (
            <button
              className="card--btn flip--btn"
              onClick={(e) => {
                e.stopPropagation();
                handleFlip();
              }}
            >
              <img
                className="flip--icon"
                src={require("../images/flip.png")}
                alt="Flip"
              />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default CardModal;
