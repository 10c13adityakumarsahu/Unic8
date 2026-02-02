import { courseCategories } from "@/config";
import banner from "../../../../public/banner-img.png";
import { Button } from "@/components/ui/button";
import { useContext, useEffect } from "react";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { AuthContext } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

function StudentHomePage() {
  const { studentViewCoursesList, setStudentViewCoursesList } =
    useContext(StudentContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  function handleNavigateToCoursesPage(getCurrentId) {
    console.log(getCurrentId);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      category: [getCurrentId],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    navigate("/courses");
  }

  async function fetchAllStudentViewCourses() {
    const response = await fetchStudentViewCourseListService();
    if (response?.success) setStudentViewCoursesList(response?.data);
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    if (!auth?.user?._id) {
      navigate(`/course/details/${getCurrentCourseId}`);
      return;
    }

    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  useEffect(() => {
    fetchAllStudentViewCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between relative z-10">
          <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
              Learning that <span className="text-indigo-600">gets you.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 font-medium">
              Skills for your present and your future. Get started with over 3,000+ courses
              curated by industry leading experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button onClick={() => navigate("/courses")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl text-lg font-bold shadow-xl hover:shadow-indigo-200 transition-all transform hover:-translate-y-1">
                Join For Free
              </Button>
              <Button onClick={() => navigate("/mentors")} variant="outline" className="px-8 py-6 rounded-xl text-lg font-bold border-2 hover:bg-gray-50 transition-all border-indigo-100 text-indigo-600">
                Find Mentors
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <img
              src={banner}
              className="relative w-full h-auto rounded-3xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 border-8 border-white"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 lg:px-8 bg-gray-50/50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Explore Categories</h2>
              <p className="text-gray-500 font-medium">Pick a category to jumpstart your learning</p>
            </div>
            <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50" onClick={() => navigate("/courses")}>
              View All Categories
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {courseCategories.map((categoryItem) => (
              <Button
                className="h-32 flex flex-col items-center justify-center gap-3 bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group overflow-hidden relative"
                variant="outline"
                key={categoryItem.id}
                onClick={() => handleNavigateToCoursesPage(categoryItem.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="text-gray-900 group-hover:text-indigo-600 font-bold transition-colors">
                  {categoryItem.label}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-24 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Featured Courses</h2>
              <p className="text-gray-500 font-medium">Handpicked courses designed to help you excel</p>
            </div>
            <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50" onClick={() => navigate("/courses")}>
              View All Courses
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
              studentViewCoursesList.map((courseItem) => (
                <div
                  key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                  className="bg-white group cursor-pointer border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={courseItem?.image}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[12px] font-bold text-indigo-600 uppercase tracking-wider">
                      {courseItem?.category.replace("-", " ")}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {courseItem?.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mb-4">
                      By <span className="text-gray-800">{courseItem?.instructorName}</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <p className="font-black text-xl text-gray-900">
                        ₹{courseItem?.pricing}
                      </p>
                      <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-4 w-4 fill-current" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <h3 className="text-xl font-bold text-gray-400">No Courses Available Yet</h3>
                <p className="text-gray-400 mt-2">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default StudentHomePage;
