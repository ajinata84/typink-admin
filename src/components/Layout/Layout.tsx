import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove("token");
    navigate("/auth");
  };

  return (
    <div className="w-[1366px] m-auto min-h-screen flex flex-row relative items-center">
      <div className="w-[20%] h-full flex flex-col gap-4 ">
        <Link to={"/"}>Home</Link>
        <Link to={"/announcements"} className="mt-4 font-semibold">
          Announcements
        </Link>
        <Link to={"/create-announcement"} className=" mb-6 font-semibold">
          Create Announcement
        </Link>
        <Link to={"/forum"}>Forum</Link>
        <Link to={"/forum-comments"}>Forum Comments</Link>
        <Link to={"/literature"}>Literature</Link>
        <Link to={"/literature-comments"}>Literature Comments</Link>
        <Link to={"/chapter"}>Chapter</Link>
        <Link to={"/chapter-comments"}>Chapter Comments</Link>

        <Button variant={"destructive"} onClick={() => logout()}>
          Log out
        </Button>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
