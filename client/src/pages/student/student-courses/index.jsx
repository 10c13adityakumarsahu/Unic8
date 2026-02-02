import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import { fetchStudentBoughtCoursesService } from "@/services";
import { Watch, PlayCircle } from "lucide-react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function StudentCoursesPage() {
  const { auth } = useContext(AuthContext);
  const { studentBoughtCoursesList, setStudentBoughtCoursesList } =
    useContext(StudentContext);
  const navigate = useNavigate();

  async function fetchStudentBoughtCourses() {
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id);
    if (response?.success) {
      setStudentBoughtCoursesList(response?.data);
    }
    console.log(response);
  }
  useEffect(() => {
    if (auth?.user?._id) fetchStudentBoughtCourses();
  }, [auth]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-start gap-4 mb-12">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            My Courses
          </h1>
          <p className="text-gray-500 font-medium">
            Continue where you left off and keep growing
          </p>
        </div>

        {studentBoughtCoursesList && studentBoughtCoursesList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {studentBoughtCoursesList.map((course) => (
              <Card
                key={course._id || course.courseId}
                className="group flex flex-col bg-white border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => navigate(`/course-progress/${course?.courseId}`)}
              >
                <CardContent className="p-0 flex-grow">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={course?.courseImage}
                      alt={course?.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                      {course?.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      Instructor: <span className="text-gray-800 font-semibold">{course?.instructorName}</span>
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/course-progress/${course?.courseId}`);
                    }}
                    className="w-full bg-gray-900 hover:bg-black text-white font-bold py-6 rounded-xl transition-all shadow-md group-hover:bg-indigo-600"
                  >
                    <Watch className="mr-3 h-5 w-5" />
                    Continue Learning
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Watch className="w-12 h-12 text-gray-300" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-4">No enrolled courses yet</h2>
            <p className="text-gray-500 font-medium max-w-sm mb-8 leading-relaxed">
              Looks like you haven't started your learning journey.
              Explore our top-rated courses and find your next skill!
            </p>
            <Button
              onClick={() => navigate("/courses")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-xl font-black text-lg shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
            >
              Explore Courses
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentCoursesPage;
