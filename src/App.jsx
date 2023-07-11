import "./App.css";
import { Provider } from "./provider/Provider";
import Router from "./Router";

function App() {
  return (
    <div className="App">
      <Provider>
        <Router />
      </Provider>
    </div>
  );
}

export default App;
