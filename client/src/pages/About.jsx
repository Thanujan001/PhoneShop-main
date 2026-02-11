import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
function About() {
  return (
    <>
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <div className="relative h-full w-full bg-black [&amp;>div]:absolute [&amp;>div]:inset-0 [&amp;>div]:bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [&amp;>div]:bg-[size:14px_24px]">
            <div></div>
          </div>
        </div>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
          <div className="max-w-3xl text-center">
            <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-white">
              Your Next Great
              <span className="text-sky-400">Project</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300">
              Build modern and beautiful websites with this collection of
              stunning background patterns. Perfect for landing pages, apps, and
              dashboards.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button>
                <Link
                  to="/login"
                  className="!rounded-lg px-8 py-3 font-medium bg-sky-400 !text-slate-900 hover:bg-sky-300 !no-underline !text-decoration-none"
                >
                  Get Started
                </Link>
              </button>
              <button className="!rounded-lg border px-8 py-3 font-medium border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default About;
