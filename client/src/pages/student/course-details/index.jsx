import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  createPaymentService,
  fetchStudentViewCourseDetailsService,
} from "@/services";
import { CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function StudentViewCourseDetailsPage() {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const { auth } = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialog] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  async function fetchStudentViewCourseDetails() {
    // const checkCoursePurchaseInfoResponse =
    //   await checkCoursePurchaseInfoService(
    //     currentCourseDetailsId,
    //     auth?.user._id
    //   );

    // if (
    //   checkCoursePurchaseInfoResponse?.success &&
    //   checkCoursePurchaseInfoResponse?.data
    // ) {
    //   navigate(`/course-progress/${currentCourseDetailsId}`);
    //   return;
    // }

    const response = await fetchStudentViewCourseDetailsService(
      currentCourseDetailsId
    );

    if (response?.success) {
      setStudentViewCourseDetails(response?.data);
      setLoadingState(false);
    } else {
      setStudentViewCourseDetails(null);
      setLoadingState(false);
    }
  }

  function handleSetFreePreview(getCurrentVideoInfo) {
    console.log(getCurrentVideoInfo);
    setDisplayCurrentVideoFreePreview(getCurrentVideoInfo?.videoUrl);
  }

  async function handleCreatePayment() {
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail: auth?.user?.userEmail,
      orderStatus: "pending",
      paymentMethod: "paypal",
      paymentStatus: "initiated",
      orderDate: new Date(),
      paymentId: "",
      payerId: "",
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    };

    console.log(paymentPayload, "paymentPayload");
    const response = await createPaymentService(paymentPayload);

    if (response.success) {
      sessionStorage.setItem(
        "currentOrderId",
        JSON.stringify(response?.data?.orderId)
      );
      setApprovalUrl(response?.data?.approveUrl);
    }
  }

  useEffect(() => {
    if (displayCurrentVideoFreePreview !== null) setShowFreePreviewDialog(true);
  }, [displayCurrentVideoFreePreview]);

  useEffect(() => {
    if (currentCourseDetailsId !== null) fetchStudentViewCourseDetails();
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (id) setCurrentCourseDetailsId(id);
  }, [id]);

  useEffect(() => {
    if (!location.pathname.includes("course/details"))
      setStudentViewCourseDetails(null),
        setCurrentCourseDetailsId(null),
        setCoursePurchaseId(null);
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  if (approvalUrl !== "") {
    window.location.href = approvalUrl;
  }

  const getIndexOfFreePreviewUrl =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
        (item) => item.freePreview
      )
      : -1;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Course Hero Section */}
      <section className="bg-[#1c1d1f] text-white py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-sm">
                Best Seller
              </span>
              <span className="text-indigo-400 font-bold text-sm uppercase tracking-wider">
                {studentViewCourseDetails?.category.replace("-", " ")}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {studentViewCourseDetails?.title}
            </h1>
            <p className="text-xl text-gray-300 font-medium leading-relaxed">
              {studentViewCourseDetails?.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold pt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                  <span className="text-indigo-400">👤</span>
                </div>
                <span>Created by <span className="text-indigo-400 underline decoration-indigo-500/50 underline-offset-4">{studentViewCourseDetails?.instructorName}</span></span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-400" />
                <span>{studentViewCourseDetails?.primaryLanguage}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span>Last updated {studentViewCourseDetails?.date.split("T")[0]}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 lg:px-8 -mt-20 lg:-mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 space-y-8 order-2 lg:order-1 pt-32 lg:pt-0">
            {/* Objectives */}
            <Card className="rounded-2xl border-gray-100 shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-2xl font-black text-gray-900">What you'll learn</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {studentViewCourseDetails?.objectives
                    .split(",")
                    .map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="mt-1 h-5 w-5 text-indigo-600 flex-shrink-0" />
                        <span className="text-gray-700 font-medium leading-relaxed">{objective}</span>
                      </li>
                    ))}
                </ul>
              </CardContent>
            </Card>

            {/* Curriculum */}
            <Card className="rounded-2xl border-gray-100 shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-2xl font-black text-gray-900">Course Content</CardTitle>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {studentViewCourseDetails?.curriculum?.length} sections • {studentViewCourseDetails?.curriculum?.length} lectures
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {studentViewCourseDetails?.curriculum?.map((curriculumItem, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-6 transition-colors ${curriculumItem?.freePreview ? "hover:bg-indigo-50/50 cursor-pointer" : ""
                        }`}
                      onClick={curriculumItem?.freePreview ? () => handleSetFreePreview(curriculumItem) : null}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                          {curriculumItem?.freePreview ? <PlayCircle className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                        </div>
                        <span className="font-bold text-gray-800">{curriculumItem?.title}</span>
                      </div>
                      {curriculumItem?.freePreview && (
                        <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
                          Preview
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="rounded-2xl border-gray-100 shadow-sm bg-white">
              <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                <CardTitle className="text-2xl font-black text-gray-900">Course Description</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="prose prose-indigo max-w-none text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
                  {studentViewCourseDetails?.description}
                </div>
              </CardContent>
            </Card>
          </main>

          {/* Checkout Sidebar */}
          <aside className="w-full lg:w-[420px] order-1 lg:order-2">
            <Card className="sticky top-28 rounded-3xl border-gray-100 shadow-2xl bg-white overflow-hidden transform hover:-translate-y-1 transition-transform">
              <div className="p-2">
                <div className="aspect-video rounded-2xl overflow-hidden relative group">
                  <VideoPlayer
                    url={
                      getIndexOfFreePreviewUrl !== -1
                        ? studentViewCourseDetails?.curriculum[getIndexOfFreePreviewUrl].videoUrl
                        : ""
                    }
                    width="100%"
                    height="100%"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <PlayCircle className="w-16 h-16 text-white" />
                    <p className="text-white font-bold mt-2">Preview this course</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-black text-gray-900">₹{studentViewCourseDetails?.pricing}</span>
                  <span className="text-gray-400 font-bold line-through">₹{(studentViewCourseDetails?.pricing * 4).toFixed(0)}</span>
                  <span className="text-indigo-600 font-black text-sm ml-auto">75% OFF</span>
                </div>

                <div className="space-y-4">
                  <Button onClick={handleCreatePayment} className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-100 transition-all">
                    Enroll Now
                  </Button>
                  <Button variant="outline" className="w-full h-14 rounded-xl border-2 font-black text-gray-800">
                    Add to Wishlist
                  </Button>
                </div>

                <div className="mt-8 space-y-4 border-t border-gray-100 pt-8">
                  <p className="font-bold text-gray-900">This course includes:</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <PlayCircle className="h-4 w-4" />
                      <span>{studentViewCourseDetails?.curriculum?.length} Lectures</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Full lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                      <Globe className="h-4 w-4" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Free Preview Dialog */}
      <Dialog
        open={showFreePreviewDialog}
        onOpenChange={() => {
          setShowFreePreviewDialog(false);
          setDisplayCurrentVideoFreePreview(null);
        }}
      >
        <DialogContent className="max-w-4xl p-0 bg-black overflow-hidden rounded-3xl border-none">
          <div className="aspect-video w-full">
            <VideoPlayer
              url={displayCurrentVideoFreePreview}
              width="100%"
              height="100%"
            />
          </div>
          <div className="p-8 bg-white max-h-[300px] overflow-y-auto">
            <h3 className="text-xl font-black text-gray-900 mb-4">Free Previews</h3>
            <div className="space-y-3">
              {studentViewCourseDetails?.curriculum
                ?.filter((item) => item.freePreview)
                .map((filteredItem, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSetFreePreview(filteredItem)}
                    className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${displayCurrentVideoFreePreview === filteredItem?.videoUrl
                        ? "bg-indigo-50 border border-indigo-200"
                        : "hover:bg-gray-50 border border-transparent"
                      }`}
                  >
                    <PlayCircle className={`h-5 w-5 ${displayCurrentVideoFreePreview === filteredItem?.videoUrl ? "text-indigo-600" : "text-gray-400"}`} />
                    <span className={`font-bold ${displayCurrentVideoFreePreview === filteredItem?.videoUrl ? "text-indigo-700" : "text-gray-700"}`}>
                      {filteredItem?.title}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseDetailsPage;
