import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit, Book } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  return (
    <Card className="border-none shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Manage Your Courses</CardTitle>
            <p className="text-gray-500 font-medium mt-1">Total {listOfCourses.length} courses published</p>
          </div>
          <Button
            onClick={() => {
              setCurrentEditedCourseId(null);
              setCourseLandingFormData(courseLandingInitialFormData);
              setCourseCurriculumFormData(courseCurriculumInitialFormData);
              navigate("/instructor/create-new-course");
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
          >
            Create New Course
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest min-w-[300px]">Course Information</TableHead>
                <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Enrollments</TableHead>
                <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest">Net Revenue</TableHead>
                <TableHead className="px-8 py-5 font-black text-gray-400 uppercase text-xs tracking-widest text-right">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0 ? (
                listOfCourses.map((course) => (
                  <TableRow key={course._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 group">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={course.image} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{course?.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <span className="font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-xs">
                        {course?.students?.length} Students
                      </span>
                    </TableCell>
                    <TableCell className="px-8 py-6">
                      <span className="font-black text-gray-900">₹{(course?.students?.length * course?.pricing).toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => navigate(`/instructor/edit-course/${course?._id}`)}
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        >
                          <Edit className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"
                        >
                          <Delete className="h-5 w-5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-8 py-32 text-center">
                    <div className="max-w-xs mx-auto">
                      <Book className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-xl font-black text-gray-400">No courses yet</h3>
                      <p className="text-gray-400 font-medium">Start sharing your knowledge with the world!</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
