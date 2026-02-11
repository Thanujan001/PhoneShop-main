import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../Header/Header.jsx";

function Signup() {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${BACKEND_URL}/signup`, { name, email, password })
      .then(() => {
        Swal.fire(
          "Congratulations! You Have Successfully Registered with Us 😊",
          "",
          "success"
        );
        navigate("/login");
      })
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred. Please try again. 😔",
        })
      );
  };

  return (
    <>
      {/* <Header /> */}
      {/* <section className=" dark:bg-gray-900">
        <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
          <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
            <img
              alt=""
              src="/signup.jpg"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />

            <div className="hidden lg:relative lg:block lg:p-12">
              <a className="block text-white" href="#">
                <span className="sr-only">Home</span>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="gray"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="6"
                    y="2"
                    width="12"
                    height="20"
                    rx="2"
                    stroke="blue"
                  />
                  <circle cx="12" cy="18" r="1" fill="black" />
                </svg>
              </a>

              <h2 className="mt-6 text-2xl font-bold text-black sm:text-3xl md:text-4xl">
                Welcome to Squid
              </h2>

              <p className="mt-4 leading-relaxed text-white/90">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Eligendi nam dolorum aliquam, quibusdam aperiam voluptatum.
              </p>
            </div>
          </section>

          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <div className="relative -mt-16 block lg:hidden">
                <a
                  className="inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20 dark:bg-gray-900"
                  href="#"
                >
                  <span className="sr-only">Home</span>
                  <svg
                    className="h-8 sm:h-10"
                    viewBox="0 0 28 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.41 10.3847C1.14777 7.4194 2.85643 4.7861 5.2639 2.90424C7.6714 1.02234 10.6393 0 13.695 0C16.7507 0 19.7186 1.02234 22.1261 2.90424C24.5336 4.7861 26.2422 7.4194 26.98 10.3847H25.78C23.7557 10.3549 21.7729 10.9599 20.11 12.1147C20.014 12.1842 19.9138 12.2477 19.81 12.3047H19.67C19.5662 12.2477 19.466 12.1842 19.37 12.1147C17.6924 10.9866 15.7166 10.3841 13.695 10.3841C11.6734 10.3841 9.6976 10.9866 8.02 12.1147C7.924 12.1842 7.8238 12.2477 7.72 12.3047H7.58C7.4762 12.2477 7.376 12.1842 7.28 12.1147C5.6171 10.9599 3.6343 10.3549 1.61 10.3847H0.41ZM23.62 16.6547C24.236 16.175 24.9995 15.924 25.78 15.9447H27.39V12.7347H25.78C24.4052 12.7181 23.0619 13.146 21.95 13.9547C21.3243 14.416 20.5674 14.6649 19.79 14.6649C19.0126 14.6649 18.2557 14.416 17.63 13.9547C16.4899 13.1611 15.1341 12.7356 13.745 12.7356C12.3559 12.7356 11.0001 13.1611 9.86 13.9547C9.2343 14.416 8.4774 14.6649 7.7 14.6649C6.9226 14.6649 6.1657 14.416 5.54 13.9547C4.4144 13.1356 3.0518 12.7072 1.66 12.7347H0V15.9447H1.61C2.39051 15.924 3.154 16.175 3.77 16.6547C4.908 17.4489 6.2623 17.8747 7.65 17.8747C9.0377 17.8747 10.392 17.4489 11.53 16.6547C12.1468 16.1765 12.9097 15.9257 13.69 15.9447C14.4708 15.9223 15.2348 16.1735 15.85 16.6547C16.9901 17.4484 18.3459 17.8738 19.735 17.8738C21.1241 17.8738 22.4799 17.4484 23.62 16.6547ZM23.62 22.3947C24.236 21.915 24.9995 21.664 25.78 21.6847H27.39V18.4747H25.78C24.4052 18.4581 23.0619 18.886 21.95 19.6947C21.3243 20.156 20.5674 20.4049 19.79 20.4049C19.0126 20.4049 18.2557 20.156 17.63 19.6947C16.4899 18.9011 15.1341 18.4757 13.745 18.4757C12.3559 18.4757 11.0001 18.9011 9.86 19.6947C9.2343 20.156 8.4774 20.4049 7.7 20.4049C6.9226 20.4049 6.1657 20.156 5.54 19.6947C4.4144 18.8757 3.0518 18.4472 1.66 18.4747H0V21.6847H1.61C2.39051 21.664 3.154 21.915 3.77 22.3947C4.908 23.1889 6.2623 23.6147 7.65 23.6147C9.0377 23.6147 10.392 23.1889 11.53 22.3947C12.1468 21.9165 12.9097 21.6657 13.69 21.6847C14.4708 21.6623 15.2348 21.9135 15.85 22.3947C16.9901 23.1884 18.3459 23.6138 19.735 23.6138C21.1241 23.6138 22.4799 23.1884 23.62 22.3947Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>

                <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl dark:text-white">
                  Welcome to Squid 🦑
                </h1>

                <p className="mt-4 leading-relaxed text-gray-500 dark:text-gray-400">
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Eligendi nam dolorum aliquam, quibusdam aperiam voluptatum.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 grid grid-cols-6 gap-6"
              >
                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="FirstName"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    USER NAME
                  </label>

                  <input
                    type="text"
                    placeholder="USERNAME"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4 ">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="EMAIL"
                    required
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="col-span-6 sm:col-span-4">
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Password
                  </label>

                  <input
                    type="password"
                    name="pswd"
                    placeholder="PASSWORD"
                    required
                    value={password}
                    onChange={(e) => setpassword(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-200  text-sm text-gray-700 shadow-xs dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="col-span-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By creating an account, you agree to our
                    <a
                      href="#"
                      className="text-gray-700 underline dark:text-gray-200"
                    >
                      terms and conditions
                    </a>
                    and
                    <a
                      href="#"
                      className="text-gray-700 underline dark:text-gray-200"
                    >
                      privacy policy
                    </a>
                    .
                  </p>
                </div>

                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button
                    type="submit"
                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-cyan-700 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:ring-3 focus:outline-hidden dark:hover:bg-gray-700 dark:hover:text-white"
                  >
                    Create an account
                  </button>
                  <br />

                  <p className="mt-4 text-sm text-gray-500  dark:text-gray-400">
                    Already have an account?
                    <Link
                      to="/login"
                      className="text-gray-700 underline dark:text-gray-200"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section> */}

      <section className="relative py-12 bg-gray-900 sm:py-16 lg:py-12 ">
        <div className="absolute inset-0 overflow-hidden">
          <img
            className="object-cover object-bottom w-full h-full transform rotate-0 opacity-50"
            src="https://cdn.rareblocks.xyz/collection/clarity/images/features/6/background-pattern.png"
            alt=""
          />
        </div>

        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative max-w-md mx-auto mt-10 lg:max-w-xl">
            <div className="absolute inset-x-1.5 top-8 -inset-y-4">
              <div
                className="w-full h-full mx-auto rotate-180 rounded-3xl opacity-90 blur-xl filter"
                style={{
                  background:
                    "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
                }}
              ></div>
            </div>

            <div className="relative overflow-hidden bg-white rounded-2xl lg:rounded-3xl">
              <div className="px-6 py-7 sm:px-12 sm:py-10">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 font-pj sm:text-4xl xl:text-5xl">
                    Welcome to Your Account!
                  </h1>
                  <p className="mt-6 text-lg font-normal text-gray-600 font-pj">
                    Sign in to access your account and explore new opportunities
                  </p>

                  <a
                    href="#"
                    title=""
                    className="text-decoration-none flex items-center justify-center w-full px-8 py-4 mt-12 text-base font-bold  !text-gray-900 transition-all duration-200 bg-gray-100 border border-transparent rounded-xl hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 font-pj"
                    role="button"
                  >
                    <svg
                      className="w-5 h-5 mr-4"
                      viewBox="0 0 533.5 544.3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M533.5 278.4c0-17.4-1.5-34.1-4.3-50.4H272.1v95.3h146.9c-6.3 33.9-25 62.5-53.2 81.5v67.4h85.9c50.3-46.4 81.8-114.8 81.8-193.8z"
                        fill="#4285F4"
                      />
                      <path
                        d="M272.1 544.3c72.6 0 133.6-24 178.1-65.3l-85.9-67.4c-23.9 16-54.4 25.5-92.2 25.5-70.9 0-131-47.9-152.4-112.1H31.1v70.3c44.8 88.4 136.5 149 241 149z"
                        fill="#34A853"
                      />
                      <path
                        d="M119.7 324.9c-10.2-30.3-10.2-62.7 0-93L31.1 161.6C-10.4 243.4-10.4 355.9 31.1 437.7l88.6-68.1z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M272.1 107.7c39.5 0 75.1 13.6 103.2 40.2l77.4-77.4C405.7 25.5 344.7 0 272.1 0 167.6 0 75.9 60.6 31.1 149l88.6 70.3c21.5-64.2 81.6-111.6 152.4-111.6z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </a>

                  <p className="mt-8 text-sm font-normal text-center text-gray-600">
                    or sign in with email
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                  {/* Optional: Name field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="text-base font-medium text-gray-900 font-pj"
                    >
                      Name
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="text"
                        name="name"
                        required
                        id="name"
                        placeholder="Your name"
                        className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-base font-medium text-gray-900 font-pj"
                    >
                      Email
                    </label>
                    <div className="mt-2.5">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="text-base font-medium text-gray-900 font-pj"
                      >
                        Password
                      </label>
                      <a
                        href="#"
                        className="text-decoration-none text-base font-medium  !text-gray-500 rounded font-pj hover:text-gray-900 hover:underline focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="mt-2.5">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password (min. 8 characters)"
                        className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                        value={password}
                        onChange={(e) => setpassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-8 py-4 mt-5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent  !rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
                  >
                    Sign Up
                  </button>
                </form>

                <svg
                  className="w-auto h-4 mx-auto mt-8 text-gray-300"
                  viewBox="0 0 172 16"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Optional decorative lines */}
                </svg>

                <p className="mt-5 text-base font-normal text-center text-gray-900 font-pj">
                  have an account?{" "}
                  <a
                    href="/login"
                    title=""
                    className="text-decoration-none font-bold rounded focus:outline-none focus:ring-1 focus:ring-gray-900  focus:ring-offset-2"
                  >
                    Sign In
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signup;
