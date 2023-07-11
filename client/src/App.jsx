import { UserContextProvider } from "./UserContext";
import RegistrationComponent from "./components/RegistrationComponent";
import axios from "axios";
function App() {
  axios.defaults.baseURL = "http://localhost:8080";
  axios.defaults.withCredentials = true;
  return (
    <div>
      <UserContextProvider>
        <RegistrationComponent />
      </UserContextProvider>
    </div>
  );
}

export default App;
