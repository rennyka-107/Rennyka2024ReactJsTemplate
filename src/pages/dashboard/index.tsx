import { useEffect } from "react";
import { useUserStore } from "../authenticate/state"
import "./style.scss"
import { useNavigate } from "react-router-dom";

type Props = {}

const DashboardPage = (props: Props) => {
  const user = useUserStore(state => state.user);
  const navigate = useNavigate();
  console.log(user, ":dash board user")
  useEffect(() => {
    navigate("/chat");
  }, [])
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage