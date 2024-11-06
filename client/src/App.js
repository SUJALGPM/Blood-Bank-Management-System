import ApiContext from "./context/ApiContext";
import AppRouter from "./routes/route";
// Import the ApiContext

function App() {
  return (
    <ApiContext>
      <div className="App overflow-x-hidden font-inter">
        <AppRouter />
      </div>
    </ApiContext>
  );
}

export default App;
