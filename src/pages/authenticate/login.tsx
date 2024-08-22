import BaseButton from "@/components/Button";
import BaseInput from "@/components/Form/BaseInput";
import axios from "axios";

type Props = {};

const LoginPage = (props: Props) => {

  async function login() {
    try {
      const res = await axios.post("http://localhost:7777/api/v1/auth/login", {
        username: "admin",
        password: "123456"
      })
      console.log(res, "res")
    } catch(err) {
      console.log(err, "Err")
    }
  }

  async function getUsers() {
    try {
      const res = await axios.get("http://localhost:7777/api/v1/users/list")
      console.log(res, "res user")
    } catch(err) {
      console.log(err, "Err")
    }
  }
  

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[url('/assets/9099100.jpg')]">
      {/* <BaseButton title="LoginPage" />
      <BaseButton uiType="secondary" title="LoginPage" />
      <BaseButton uiType="white" title="LoginPage" /> */}
      <div className="w-1/5 flex flex-col justify-center mx-auto gap-2 py-2">
        <BaseInput label="Username" />
        <BaseInput label="Password" type="password" />
        <BaseButton title="Login" twClassAddition="mt-2" onClick={login} />
        <BaseButton title="Get users" twClassAddition="mt-2" onClick={getUsers} />
      </div>
    </div>
  );
};

export default LoginPage;
