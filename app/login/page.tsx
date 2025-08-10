import Form from "next/form";

const LoginPage = () => {
  return (
    <div className="w-[400px]">
      <h1 className="font-bold text-3xl my-2">Login</h1>
      <Form className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="">Username</label>
          <input id="username" type="text" className="border-2 rounded-sm" />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Password</label>
          <input
            id="password"
            type="password"
            className="border-2 rounded-sm"
          />
        </div>
        <button className="w-full text-white font-bold bg-black px-6 py-2 rounded-md hover:scale-[1.1]">
          Log In
        </button>
      </Form>
    </div>
  );
};

export default LoginPage;
