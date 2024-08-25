import BaseButton from "@/components/Button";
import BaseInput from "@/components/Form/BaseInput";
import axios from "axios";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import "./login.scss";

type Props = {};

interface IFormLogin {
  username: string;
  password: string;
}

const LoginPage = (props: Props) => {
  const { handleSubmit, control, reset } = useForm<IFormLogin>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit: SubmitHandler<IFormLogin> = (data) => console.log(data);

  async function login() {
    try {
      const res = await axios.post("http://localhost:7777/api/v1/auth/login", {
        username: "admin",
        password: "123456",
      });
      console.log(res, "res");
    } catch (err) {
      console.log(err, "Err");
    }
  }

  async function getUsers() {
    try {
      const res = await axios.get("http://localhost:7777/api/v1/users/list");
      console.log(res, "res user");
    } catch (err) {
      console.log(err, "Err");
    }
  }

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[url('/assets/bg-3.jpg')] bg-no-repeat bg-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-1/4 flex flex-col justify-center mx-auto gap-2 py-[2rem] px-[2rem] rounded-[16px] glass-area"
      >
        <div className="">
          <img src="/assets/tachyon-purple.png" />
        </div>
        <p className="text-center text-[24px] mt-2 font-bold text-purple-800">
          MK System
        </p>
        {/* <button className="bg-purple-600" style={{ display: "none" }}>
          12
        </button>
        <label className="text-purple-600" style={{ display: "none" }}>
          12
        </label> */}
        {/* <input className="border-purple-600" style={{ display: "none" }} />{" "} */}
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <BaseInput label="Username" twColor="purple" />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <BaseInput label="password" twColor="purple" />
          )}
        />
        <BaseButton
          title="Login"
          twClassAddition="mt-2"
          twColor="purple"
          onClick={login}
          type="button"
        />
        <BaseButton
          title="Register"
          twClassAddition="mt-2"
          twColor="purple"
          onClick={login}
          type="button"
        />
      </form>
    </div>
  );
};

export default LoginPage;
