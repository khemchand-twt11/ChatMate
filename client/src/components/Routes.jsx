import { useContext } from "react";
import RegistrationComponent from "./RegisterAndLogin";
import { UserContext } from "../UserContext";
import Chat from "./Chat";

export default function Routes() {
  const { username, id } = useContext(UserContext);
  if (username && id) return <Chat />;
  return <RegistrationComponent />;
}
