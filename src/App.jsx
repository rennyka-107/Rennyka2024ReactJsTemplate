import "./App.css";
import RouteList from "./routers";
import { BrowserRouter } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <RouteList></RouteList>
    </BrowserRouter>
  );
}

export default App;
