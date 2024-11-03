import { useUserStore } from "../authenticate/state"
import "./style.scss"

type Props = {}

const DashboardPage = (props: Props) => {
  const user = useUserStore(state => state.user);
  console.log(user,":dash board user")
  return (
    <div>DashboardPage</div>
  )
}

export default DashboardPage