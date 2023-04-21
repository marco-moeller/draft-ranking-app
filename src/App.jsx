import "./App.css";
import CardGrid from "./components/CardGrid";
import CardModal from "./components/CardModal";
import { useGlobalContext } from "./context";

function App() {
  const { showCardModal } = useGlobalContext();

  return (
    <div className="App">
      <CardGrid />
      {showCardModal && <CardModal />}
    </div>
  );
}

export default App;
