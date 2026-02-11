import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  axios.defaults.withCredentials = true;
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${BACKEND_URL}/login`, { email, password })
      .then((res) => {
        if (res.data.status === "success") {
          if (res.data.role === "admin") {
            navigate("/admin");
            Swal.fire(
              " You Have Successfully loggedin as Admin 😊",
              "",
              "success"
            );
          } else {
            navigate("/Customer");
            Swal.fire(
              "You Have Successfully loggedin as Customer 😊",
              "",
              "success"
            );
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "invalid Login Credintials",
          });
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Login failed. Please check your Email or password and try again.",
        });
      });
  };

  return (
    <>
      <section className="py-12 bg-gray-900 sm:py-16 lg:py-20">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative max-w-md mx-auto lg:max-w-lg">
            <div className="absolute -inset-2">
              <div
                className="w-full h-full mx-auto rounded-3xl opacity-30 blur-lg filter"
                style={{
                  background:
                    "linear-gradient(90deg, #44ff9a -0.55%, #44b0ff 22.86%, #8b44ff 48.36%, #ff6644 73.33%, #ebff70 99.34%)",
                }}
              ></div>
            </div>

            <div className="relative overflow-hidden bg-white shadow-xl rounded-xl">
              <div className="px-4 py-6 sm:px-8">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold text-gray-900 font-pj">
                    Welcome back
                  </h1>
                  <p className="text-base font-normal text-gray-900 font-pj">
                    New here?{" "}
                    <a
                      href="/signup"
                      className="font-bold rounded text-decoration-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                    >
                      Join us
                    </a>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-12">
                  <div className="space-y-4">
                    <div>
                      <label className="text-base font-medium text-gray-900 font-pj">
                        {" "}
                        Email{" "}
                      </label>
                      <div className="mt-2.5">
                        <input
                          type="email"
                          name="email"
                          placeholder="Your email address"
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                          className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-base font-medium text-gray-900 font-pj">
                          {" "}
                          Password{" "}
                        </label>
                        <a
                          href="#"
                          className="text-base font-medium !text-gray-500 rounded font-pj hover:text-gray-900 text-decoration-none focus:outline-none focus:ring-1 focus:ring-gray-900 focus:ring-offset-2"
                        >
                          Forgot your password?
                        </a>
                      </div>
                      <div className="mt-2.5">
                        <input
                          type="password"
                          required
                          placeholder="Your password (min. 8 characters)"
                          value={password}
                          onChange={(e) => setpassword(e.target.value)}
                          className="block w-full px-4 py-4 text-gray-900 placeholder-gray-600 bg-white border border-gray-400 rounded-xl focus:border-gray-900 focus:ring-gray-900 caret-gray-900"
                        />
                      </div>
                    </div>

                    <div className="relative flex items-center mt-4">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          name="terms"
                          id="terms"
                          className="w-5 h-5 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                        />
                      </div>

                      <div className="ml-3 text-base">
                        <label
                          htmlFor="terms"
                          className="font-normal text-gray-900 font-pj"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-8 py-4 mt-5 text-base font-bold text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-xl !rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 font-pj hover:bg-gray-600"
                  >
                    Sign in
                  </button>
                </form>

                <svg
                  className="w-auto h-4 mx-auto mt-8 text-gray-300"
                  viewBox="0 0 172 16"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* SVG Lines */}
                </svg>

                <a
                  href="#"
                  className="flex items-center justify-center w-full px-8 py-4 mt-8 text-base font-bold !text-gray-900  text-decoration-none transition-all duration-200 bg-gray-100 border border-transparent rounded-xl hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 font-pj"
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
