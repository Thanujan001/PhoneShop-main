import React from "react";
import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex justify-center p-32 align-middle h-screen bg-amber-50">
        <div className="bg-white p-32 text-center w-full ">
          <div className="rounded-full h-16 w-16 flex bg-green-400 justify-center items-center mx-auto mb-4 tran animate-bounce">
            &#10004;
          </div>
          <h1 className="font-sans text-green-500">Payment Successful!</h1>
          <p>
            Your transaction has been completed successfully.Thank you for your
            booking!
          </p>
          <button
            onClick={() => navigate("/customer")}
            className=" text-green-500 cursor-pointer hover:text-emerald-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}

export default Success;
