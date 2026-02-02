import { GraduationCap, TvMinimalPlay, Calendar } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

function StudentViewCommonHeader() {
  const navigate = useNavigate();
  const { resetCredentials } = useContext(AuthContext);

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-8">
          <Link to="/home" className="flex items-center gap-3 group transition-transform hover:scale-105">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="hidden md:block font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              UNIC8
            </span>
          </Link>

          <nav className="hidden md:flex items-center">
            <Button
              variant="ghost"
              onClick={() => {
                location.pathname.includes("/courses")
                  ? null
                  : navigate("/courses");
              }}
              className="text-gray-600 hover:text-indigo-600 font-semibold text-[15px] transition-colors"
            >
              Explore Courses
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                location.pathname.includes("/mentors")
                  ? null
                  : navigate("/mentors");
              }}
              className="text-gray-600 hover:text-indigo-600 font-semibold text-[15px] transition-colors"
            >
              Find Mentors
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6">
            <div
              onClick={() => navigate("/student-courses")}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="hidden sm:block text-gray-700 font-bold text-[15px] group-hover:text-indigo-600 transition-colors">
                My Courses
              </span>
              <TvMinimalPlay className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </div>

            <div
              onClick={() => navigate("/student-meetings")}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="hidden sm:block text-gray-700 font-bold text-[15px] group-hover:text-indigo-600 transition-colors">
                My Meetings
              </span>
              <Calendar className="w-6 h-6 text-gray-700 group-hover:text-indigo-600 transition-colors" />
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/profile")}
                variant="outline"
                className="hidden sm:flex border-gray-200 hover:border-indigo-600 hover:text-indigo-600 transition-all font-semibold rounded-lg px-6"
              >
                Profile
              </Button>
              <Button
                onClick={handleLogout}
                className="bg-gray-900 hover:bg-black text-white px-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header >
  );
}

export default StudentViewCommonHeader;
