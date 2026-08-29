import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/context/auth-context";
import { useContext } from "react";

function Register() {
  const { registerForm, handleRegister } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = registerForm;
  return (
    <div className="w-full mt-4">
      <form className="space-y-4" onSubmit={handleSubmit(handleRegister)}>
        <Label htmlFor="name">Name</Label>
        <Input
          placeholder="enter name"
          id={"name"}
          {...register("name")}
        ></Input>

        <Label htmlFor="email">Email</Label>
        <Input
          placeholder="enter email"
          id={"email"}
          {...register("email")}
        ></Input>

        <Label htmlFor="password">Password</Label>
        <Input
          type={"password"}
          placeholder="enter password"
          id="password"
          {...register("password")}
        ></Input>

        <Label htmlFor="comfirmPassword">Password</Label>
        <Input
          type={"password"}
          placeholder="enter again password"
          id="comfirmPassword"
          {...register("confirmPassword")}
        ></Input>
        {errors.confirmPassword && (
          <p className="text-red-500">{errors.confirmPassword.message}</p>
        )}
        <Button className={"w-full"} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default Register;
