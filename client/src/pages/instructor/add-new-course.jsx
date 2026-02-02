import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();

  console.log(params);

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (isEmpty(courseLandingFormData[key])) {
        return false;
      }
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    return hasFreePreview;
  }

  async function handleCreateCourse() {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublised: true,
    };

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
          currentEditedCourseId,
          courseFinalFormData
        )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }

    console.log(courseFinalFormData, "courseFinalFormData");
  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      console.log(setCourseFormData, response?.data, "setCourseFormData");
      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }

    console.log(response, "response");
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);

  console.log(params, currentEditedCourseId, "params");

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Creation Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-12 w-12 rounded-xl p-0 hover:bg-gray-50"
            >
              <ChevronLeft className="h-6 w-6 text-gray-400" />
            </Button>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              {currentEditedCourseId ? "Edit Course" : "Create New Course"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="rounded-xl h-12 px-6 font-bold border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              disabled={!validateFormData()}
              onClick={handleCreateCourse}
              className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-xl font-black shadow-lg shadow-indigo-100 transition-all disabled:opacity-50 disabled:shadow-none"
            >
              Publish Course
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-12 max-w-5xl">
        <Card className="border-none shadow-2xl shadow-gray-100 rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <Tabs defaultValue="curriculum" className="w-full">
              <TabsList className="w-full justify-start h-20 bg-gray-50/50 border-b border-gray-100 p-2 gap-2">
                <TabsTrigger
                  value="curriculum"
                  className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                >
                  Curriculum
                </TabsTrigger>
                <TabsTrigger
                  value="course-landing-page"
                  className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                >
                  Landing Page
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-xl px-8 h-12 font-bold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm transition-all"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="p-8 lg:p-12">
                <TabsContent value="curriculum" className="mt-0 focus-visible:outline-none">
                  <div className="max-w-4xl mx-auto">
                    <CourseCurriculum />
                  </div>
                </TabsContent>
                <TabsContent value="course-landing-page" className="mt-0 focus-visible:outline-none">
                  <div className="max-w-4xl mx-auto">
                    <CourseLanding />
                  </div>
                </TabsContent>
                <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                  <div className="max-w-4xl mx-auto">
                    <CourseSettings />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AddNewCoursePage;
