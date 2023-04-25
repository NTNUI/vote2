import { useLocation } from "react-router-dom";
import { EditAssembly } from "../components/EditAssembly";

export function Assembly() {
  const { state } = useLocation();
  return <EditAssembly {...state} />;
}
