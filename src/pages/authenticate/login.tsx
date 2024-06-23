import BaseButton from "@/components/Button";

type Props = {};

const LoginPage = (props: Props) => {
  return (
    <div className="flex justify-center w-full gap-2 py-2">
      <BaseButton title="LoginPage" />
      <BaseButton uiType="secondary" title="LoginPage" />
      <BaseButton uiType="white" title="LoginPage" />
      Login here
    </div>
  );
};

export default LoginPage;
