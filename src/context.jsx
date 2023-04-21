import { createContext, useContext, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  const updateSelectedCard = (card) => {
    setSelectedCard(card);
  };

  const toggleShowModal = (bool) => {
    setShowCardModal(bool);
  };

  return (
    <AppContext.Provider
      value={{
        toggleShowModal,
        updateSelectedCard,
        showCardModal,
        selectedCard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, AppContext };
