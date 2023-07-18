import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
//creating context
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [username, setUserName] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    axios.get("/user/profile").then((response) => {
      console.log(response.data);
      setId(response.data.userId);
      setUserName(response.data.username);
    });
  }, []);
  return (
    <UserContext.Provider value={{ username, setUserName, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
