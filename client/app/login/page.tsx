/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
"use client";
import Navbar from "@/components/nav";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userLoginSchema } from "@/validation/userLogin";
import userLoginApi from "@/features/axios/api/userLogin";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface Inputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const showToast = (message: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    if (message === "success") {
      Toast.fire({
        icon: "success",
        title: "Signed in successfully",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: message,
      });
    }
  };

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<Inputs>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    //api call here
    userLoginApi(data)
      .then((response) => {
        localStorage.setItem("userToken", response?.token);
        showToast("success");
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      })
      .catch((err) => {
        showToast(err.message);
        console.error(err.message);
      });
  };

  const switchToSignUp = () => {
    router.push("/");
  };

  return (
    <><Navbar head={"LOGIN"} />
    <main className="flex min-h-screen flex-col items-center justify-between mt-20 bg-gray-100">
      
      <div className="flex w-full h-screen ">
        <div className="w-1/2  text-center">
          <img
            className="w-full h-auto my-20 mb-10 pt-16 lg:my-0 md:my-5 lg:max-w-lg mx-auto"
            src="https://res.cloudinary.com/dk4darniv/image/upload/v1706786769/animated%20svg/login-animate_1_uawu6p.svg"
            alt=""
          />
        </div>
        <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center">
          <div className='w-[30rem] h-[22rem] bg-white flex justify-center items-center rounded shadow-lg'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center items-center ">
              <h1 className="text-gray-700 text-2xl uppercase font-bold ">Login Form </h1>
            </div>
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium "
              >
                Email
              </label>
              <input
                {...register("email")}
                disabled={isSubmitting}
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-[24rem] p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="example@gmail.com"
              />
              {errors.email?.message && (
                <div className="text-red-500 text-sm">
                  {errors.email?.message}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium "
              >
                Password
              </label>
              <input
                {...register("password")}
                disabled={isSubmitting}
                type="password"
                id="password"
                name="password"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-[24rem] p-2.5  dark:border-gray-600 dark:placeholder-gray-400  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="****"
              />
              {errors.password?.message && (
                <div className="text-red-500 text-sm">
                  {errors.password?.message}
                </div>
              )}
            </div>
            <div className="flex justify-center items-center mt-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-[13.5rem] h-10 bg-sky-600 rounded-sm mt-5 uppercase"
              >
                submit
              </button>
            </div>
            <div className="flex justify-center items-center text-sm text-gray-600 my-2">
              Don't have an Account!
              <span
                className="text-sky-600 text-sm ms-1 underline cursor-pointer"
                onClick={() => switchToSignUp()}
              >
                {" "}
                Register
              </span>
              {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            </div>
          </form>
          </div>
        </div>
      </div>
    </main>
    </>
  );
};

export default Login;
