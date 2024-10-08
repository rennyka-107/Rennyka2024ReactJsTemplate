import BaseButton from "@/components/Button";
import BaseInput from "@/components/Form/BaseInput";
import axios from "axios";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import "./style.scss";
import { ILoginRequest, useUserStore } from "./state";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

type Props = {};

const LoginPage = (props: Props) => {
  const { handleSubmit, control, reset, watch } = useForm<ILoginRequest>({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const { login, is_logged } = useUserStore();

  useEffect(() => {
    if (is_logged) {
      navigate("/");
    }
  }, [is_logged]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[url('/assets/bg-3.jpg')] bg-no-repeat bg-full">
      <form
        onSubmit={handleSubmit(login)}
        className="desktop:w-1/4 laptop:w-1/2 tablet:w-1/2 w-2/3 flex flex-col justify-center mx-auto gap-2 py-[2rem] px-[2rem] rounded-[16px] glass-area"
      >
        <div className="">
          <img src="/assets/tachyon-purple.png" />
        </div>
        <p className="text-center text-[24px] mt-2 font-bold text-purple-800">
          MK System
        </p>
        <button
          className="hover:bg-purple-700 bg-purple-600"
          style={{ display: "none" }}
        >
          12
        </button>
        <label className="text-purple-600" style={{ display: "none" }}>
          12
        </label>
        {/* <input className="border-purple-600" style={{ display: "none" }} />{" "} */}
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <BaseInput label="Username" twColor="purple" {...field} />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <BaseInput
              label="password"
              twColor="purple"
              type="password"
              {...field}
            />
          )}
        />
        <BaseButton
          title="Login"
          twClassAddition="mt-2 button-shadow"
          twColor="purple"
          type="submit"
        />
      </form>
    </div>
  );
};

export default LoginPage;
