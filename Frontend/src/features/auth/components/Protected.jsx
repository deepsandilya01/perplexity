import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  if (loading) {
    return (
      <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(49,184,198,0.18),_transparent_24%),linear-gradient(180deg,_#090c12_0%,_#05070b_100%)] px-4 py-6 text-zinc-100 sm:py-10">
        <div className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl items-center justify-center sm:min-h-[85vh]">
          <div className="w-full max-w-md rounded-2xl border border-[#31b8c6]/25 bg-zinc-900/70 p-5 text-center shadow-2xl shadow-black/50 backdrop-blur sm:p-8">
            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[#31b8c6]/20 border-t-[#31b8c6]" />
            <h2 className="mt-6 text-xl font-bold text-[#31b8c6] sm:text-2xl">
              Loading Workspace
            </h2>
            <p className="mt-2 text-sm text-zinc-300">
              Checking your session and preparing your dashboard.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
