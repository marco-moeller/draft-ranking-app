import { useEffect, useState } from "react";
import Card from "./Card";

const CREATURE_URL =
  "https://api.scryfall.com/cards/search?" +
  "as=grid&order=name&q=type%3Acreature+%28game%3Apaper+or+game%3Aarena%29+set%3Amom+-is%3Adoublesided";
const NO_CREATURE_URL =
  "https://api.scryfall.com/cards/search?" +
  "as=grid&order=name&q=-type%3Acreature+%28game%3Apaper+or+game%3Aarena%29+set%3Amom+-is%3Adoublesided";

const DOUBLE_FACE_URL =
  "https://api.scryfall.com/cards/search?" +
  "as=grid&order=name&q=%28game%3Apaper+or+game%3Aarena%29+set%3Amom+is%3Adoublesided";

const COLORS = [
  "white",
  "blue",
  "black",
  "red",
  "green",
  "colorless",
  "multicolor",
];

const RARITIES = ["common", "uncommon", "rare", "mythic"];

const CardGrid = () => {
  const [cards, setCards] = useState(
    JSON.parse(localStorage.getItem("momSetList")) || []
  );
  const [loading, setLoading] = useState(true);

  const [filterByRarity, setFilterByRarity] = useState([]);
  const [filterByColor, setFilterByColor] = useState([]);

  const isRarity = (rarity) => {
    return filterByRarity.indexOf(rarity) >= 0 || !filterByRarity.length;
  };

  const addRarityFilter = (rarity) => {
    return setFilterByRarity((prevFilter) => [...prevFilter, rarity]);
  };

  const removeRarityFilter = (rarity) => {
    return setFilterByRarity((prevFilter) =>
      prevFilter.filter((el) => el !== rarity)
    );
  };

  const isColor = (color) => {
    return filterByColor.indexOf(color) >= 0 || !filterByColor.length;
  };

  const addColorFilter = (color) => {
    setFilterByColor((prevFilter) => [...prevFilter, color]);
  };

  const removeColorFilter = (color) => {
    setFilterByColor((prevFilter) => {
      console.log(prevFilter.filter((el) => el !== color));
      return prevFilter.filter((el) => el !== color);
    });
  };

  const log = (string) => {
    console.log(string);
  };

  const moveLeft = (id) => {
    let thisCard = cards.filter((card) => card.id === id)[0];
    let previousCard = cards
      //filter by rarity
      .filter((card) => isRarity(card.rarity))
      //filter by color
      .filter((card) => isColor(card.color))
      //find card in rest array
      .filter(
        (card, index, filteredCards) =>
          index === filteredCards.indexOf(thisCard) - 1
      )[0];
    let previousCardIndex = cards.indexOf(previousCard);
    if (previousCardIndex >= 0) {
      let newCards = cards.filter((card) => card.id !== thisCard.id);
      newCards.splice(previousCardIndex, 0, thisCard);
      setCards(newCards);
    }
  };

  const moveRight = (id) => {
    let thisCard = cards.filter((card) => card.id === id)[0];
    let nextCard = cards
      //filter by rarity
      .filter((card) => isRarity(card.rarity))
      //filter by color
      .filter((card) => isColor(card.color))
      //find card in rest array
      .filter(
        (card, index, filteredCards) =>
          index === filteredCards.indexOf(thisCard) + 1
      )[0];
    let nextCardIndex = cards.indexOf(nextCard);
    if (nextCardIndex >= 0) {
      let newCards = cards.filter((card) => card.id !== thisCard.id);
      newCards.splice(nextCardIndex, 0, thisCard);
      setCards(newCards);
    }
  };

  const moveToFirst = (id) => {
    let thisCard = cards.filter((card) => card.id === id)[0];
    let firstCard = cards
      //filter by rarity
      .filter((card) => isRarity(card.rarity))
      //filter by color
      .filter((card) => isColor(card.color))[0];
    let lastCardIndex = cards.indexOf(firstCard);
    if (lastCardIndex >= 0) {
      let newCards = cards.filter((card) => card.id !== thisCard.id);
      newCards.splice(lastCardIndex, 0, thisCard);
      setCards(newCards);
    }
  };

  const moveToLast = (id) => {
    let thisCard = cards.filter((card) => card.id === id)[0];
    let filteredCards = cards
      //filter by rarity
      .filter((card) => isRarity(card.rarity))
      //filter by color
      .filter((card) => isColor(card.color));
    let lastCard = filteredCards[filteredCards.length - 1];
    let lastCardIndex = cards.indexOf(lastCard);
    if (lastCardIndex >= 0) {
      let newCards = cards.filter((card) => card.id !== thisCard.id);
      newCards.splice(lastCardIndex, 0, thisCard);
      setCards(newCards);
    }
  };

  const setColor = (colors) => {
    if (colors.length > 1) return "multicolor";

    switch (colors[0]) {
      case "W":
        return "white";
      case "U":
        return "blue";
      case "B":
        return "black";
      case "R":
        return "red";
      case "G":
        return "green";
      default:
        return "colorless";
    }
  };

  useEffect(() => {
    if (!cards.length)
      Promise.all([
        fetch(`${CREATURE_URL}`),
        fetch(`${NO_CREATURE_URL}`),
        fetch(`${DOUBLE_FACE_URL}`),
      ])
        .then(([res1, res2, res3]) =>
          Promise.all([res1.json(), res2.json(), res3.json()])
        )
        .then(([cards1, cards2, cards3]) => {
          setCards(
            cards1.data
              .map((card) => ({
                id: card.mtgo_id,
                front: card.image_uris.normal,
                back: "",
                color: setColor(card.color_identity),
                sides: 1,
                rarity: card.rarity,
              }))
              .concat(
                cards2.data.map((card) => ({
                  id: card.mtgo_id,
                  front: card.image_uris.normal,
                  back: "",
                  color: setColor(card.color_identity),
                  sides: 1,
                  rarity: card.rarity,
                }))
              )
              .concat(
                cards3.data.map((card) => ({
                  id: card.mtgo_id,
                  front: card.card_faces[0].image_uris.normal,
                  back: card.card_faces[1].image_uris.normal,
                  color: setColor(card.color_identity),
                  sides: 2,
                  rarity: card.rarity,
                }))
              )
          );
        });
    setLoading(false);
  }, []);

  useEffect(() => {
    log("saving...");
    localStorage.setItem("momSetList", JSON.stringify(cards));
  }, [cards]);

  return (
    <div className="card-grid--container">
      <div className="color--checkbox">
        {COLORS.map((color) => (
          <div className="color--container">
            <input
              key={color}
              className="filter--btn"
              type="checkbox"
              id={color}
              name={color}
              onClick={
                filterByColor.indexOf(color) < 0
                  ? () => addColorFilter(color)
                  : () => removeColorFilter(color)
              }
            />
            <label
              htmlFor={color}
              className={
                isColor(color)
                  ? "filter--btn--label selected"
                  : "filter--btn--label unselected"
              }
            >
              {color}
            </label>
          </div>
        ))}
      </div>
      <div className="rarity--checkbox">
        {RARITIES.map((rarity) => (
          <div className="rarety--container">
            <input
              key={rarity}
              className="filter--btn"
              type="checkbox"
              name={rarity}
              id={rarity}
              onClick={
                filterByRarity.indexOf(rarity) < 0
                  ? () => addRarityFilter(rarity)
                  : () => removeRarityFilter(rarity)
              }
            />
            <label
              htmlFor={rarity}
              className={
                isRarity(rarity)
                  ? "filter--btn--label selected"
                  : "filter--btn--label unselected"
              }
            >
              {rarity}
            </label>
          </div>
        ))}
      </div>
      {!loading && (
        <div className="cards--container">
          {cards
            .filter((card) => isRarity(card.rarity) && isColor(card.color))
            .map((card) => (
              <Card
                sides={card.sides}
                key={card.id}
                id={card.id}
                front={card.front}
                back={card.back}
                moveLeft={moveLeft}
                moveRight={moveRight}
                moveToFirst={moveToFirst}
                moveToLast={moveToLast}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default CardGrid;
