import BaseButton from "@/components/Button";
import BaseInput from "@/components/Form/BaseInput";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="flex flex-col justify-center w-1/3 mx-auto gap-2 py-2">
      <BaseButton title="LoginPage" />
      <BaseButton uiType="secondary" title="LoginPage" />
      <BaseButton uiType="white" title="LoginPage" />
      Login here
      <BaseInput label="Username" />
      <BaseInput label="Password" />
    </div>
  );
};

export default LoginPage;
