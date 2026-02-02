import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import InstructorMeetings from "@/components/instructor-view/meetings";
import InstructorProfile from "@/components/instructor-view/profile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService, fetchInstructorMeetingsService } from "@/services";
import { BarChart, Book, LogOut, Video, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { resetCredentials, auth } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);
  const [instructorMeetings, setInstructorMeetings] = useState([]);

  async function fetchAllData() {
    const coursesResponse = await fetchInstructorCourseListService();
    if (coursesResponse?.success) setInstructorCoursesList(coursesResponse?.data);

    if (auth?.user?._id) {
      const meetingsResponse = await fetchInstructorMeetingsService(auth.user._id);
      if (meetingsResponse?.success) setInstructorMeetings(meetingsResponse.data);
    }
  }

  useEffect(() => {
    fetchAllData();
  }, [auth]);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} listOfMeetings={instructorMeetings} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Video,
      label: "Meetings",
      value: "meetings",
      component: <InstructorMeetings />,
    },
    {
      icon: User,
      label: "Profile",
      value: "profile",
      component: <InstructorProfile />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  console.log(instructorCoursesList, "instructorCoursesList");

  return (
    <div className="flex h-full min-h-screen bg-[#f8fafc]">
      <aside className="w-80 bg-white border-r border-gray-100 hidden lg:block sticky top-0 h-screen overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Book className="text-white h-6 w-6" />
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Instructor Panel</h2>
            </div>

            <nav className="space-y-2">
              {menuItems.map((menuItem) => (
                <Button
                  key={menuItem.value}
                  variant="ghost"
                  className={`w-full justify-start h-14 rounded-xl px-4 transition-all duration-200 group ${activeTab === menuItem.value
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  onClick={
                    menuItem.value === "logout"
                      ? handleLogout
                      : () => setActiveTab(menuItem.value)
                  }
                >
                  <menuItem.icon className={`mr-3 h-5 w-5 transition-colors ${activeTab === menuItem.value ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-900"
                    }`} />
                  <span className="font-bold text-[15px]">{menuItem.label}</span>
                  {activeTab === menuItem.value && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 shadow-sm"></div>
                  )}
                </Button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 border-t border-gray-50">
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black">
                {instructorCoursesList?.[0]?.instructorName?.[0] || 'I'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-black text-gray-900 truncate">Instructor Admin</p>
                <p className="text-xs font-bold text-gray-400 truncate">Verified Educator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight capitalize">
            {activeTab}
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="rounded-xl font-bold border-gray-100 hidden sm:flex">
              Documentation
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            {menuItems.map((menuItem) => (
              <TabsContent key={menuItem.value} value={menuItem.value} className="mt-0 focus-visible:outline-none">
                {menuItem.component !== null ? menuItem.component : null}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}

export default InstructorDashboardpage;
