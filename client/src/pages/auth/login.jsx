import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

function Login() {
  const { loginForm, handleLogin } = useContext(AuthContext);
  const { register, handleSubmit } = loginForm;
  return (
    <div className="w-full mt-4">
      <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
        <Label htmlFor="email">Email</Label>
        <Input
          {...register("email")}
          placeholder="enter email"
          id={"email"}
        ></Input>

        <Label htmlFor="password">Password</Label>
        <Input
          {...register("password")}
          type={"password"}
          placeholder="enter password"
          id="password"
        ></Input>
        <Button type="submit" className={"w-full"}>
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Login;
