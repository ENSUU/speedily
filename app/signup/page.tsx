import Form from "next/form";
import Link from "next/link";

const SignupPage = () => {
  return (
    <div className="w-[400px]">
      <h1 className="font-bold text-3xl my-2">Sign Up</h1>
      <Form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="username">Username</label>
          <input id="username" type="text" className="border-2 rounded-sm" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            className="border-2 rounded-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="border-2 rounded-sm"
          />
        </div>
        <button className="w-full text-white font-bold bg-black px-6 py-2 rounded-md hover:scale-[1.1]">
          Sign Up
        </button>
        <p>
          Already have an account? Log in{" "}
          <Link href="login" className="text-blue-500">
            here.
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignupPage;
