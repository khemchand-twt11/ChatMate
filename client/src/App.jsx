import { UserContextProvider } from "./UserContext";
import axios from "axios";
import Routes from "./components/Routes";
function App() {
  // to make the url default for each subsequent request to the server
  axios.defaults.baseURL = "http://localhost:8080";
  // enables sending cookies along with Axios requests.
  axios.defaults.withCredentials = true;
  return (
    <div>
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  );
}

export default App;
