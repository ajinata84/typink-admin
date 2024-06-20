import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import Breadcrumb from "../Navigation/Breadcrumb"; // Sesuaikan path yang benar
import TypinkWhiteLogo from "@/assets/TypinkWhiteLogo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    Cookies.remove("token");
    navigate("/auth");
  };

  // Generate breadcrumb items based on current route
  const generateBreadcrumbItems = () => {
    const paths = location.pathname.split("/").filter((path) => path !== "");
    const breadcrumbItems = [{ name: "Home", path: "/" }];

    paths.reduce((prevPath, currentPath) => {
      const fullPath = `${prevPath}/${currentPath}`;
      breadcrumbItems.push({
        name: currentPath.charAt(0).toUpperCase() + currentPath.slice(1), // Capitalize first letter
        path: fullPath,
      });
      return fullPath;
    }, "");

    return breadcrumbItems;
  };

  return (
    <div className="w-full min-h-screen flex relative bg-gray-200 text-black">
      <div className="w-[20%] flex flex-col gap-4 border-r border-gray-400 bg-gray-800 min-h-screen">
        <div className="mt-10">
          <TypinkWhiteLogo />
        </div>
        <div className="mt-6 flex flex-col space-y-4 pl-3 flex-1 text-white">
          <Link to={"/"} className="font-bold text-xl hover:text-customGreen">
            Home
          </Link>
          {/* Forum */}
          <p className="text-sm font-bold text-customGreen">Forum</p>
          <div className="flex flex-col space-y-2 pl-4">
            <Link to={"/announcements"} className="hover:text-customGreen">
              Announcements
            </Link>
            <Link to={"/create-announcement"} className="mb-6 hover:text-customGreen">
              Create Announcement
            </Link>
            <Link to={"/forum"} className="hover:text-customGreen">
              Forum
            </Link>
            <Link to={"/forum-comments"} className="hover:text-customGreen">
              Forum Comments
            </Link>
          </div>
          {/* Literature */}
          <p className="text-sm font-bold text-customGreen">Literature</p>
          <div className="flex flex-col space-y-2 pl-4">
            <Link to={"/literature"} className="hover:text-customGreen">
              Literature
            </Link>
            <Link to={"/literature-comments"} className="hover:text-customGreen">
              Literature Comments
            </Link>
            <Link to={"/chapter"} className="hover:text-customGreen">
              Chapter
            </Link>
            <Link to={"/chapter-comments"} className="hover:text-customGreen">
              Chapter Comments
            </Link>
          </div>
        </div>
        {/* button logout */}
        <Button variant={"destructive"} onClick={() => logout()} className="w-20 h-8 mt-auto mb-6 mx-3">
          Log out
        </Button>
      </div>
      <div className="w-full ml-4 p-6">
        <Breadcrumb items={generateBreadcrumbItems()} />
        {children}
      </div>
    </div>
  );
}
