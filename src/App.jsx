import "./App.css";
import RouteList from "./routers";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <><BrowserRouter>
      <RouteList></RouteList>
    </BrowserRouter> <ToastContainer />
    </>

  );
}

export default App;
