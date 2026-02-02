import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play, Lock } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
            lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  console.log(currentLecture, "currentLecture");

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {showConfetti && <Confetti recycles={false} numberOfPieces={500} gravity={0.1} />}

      {/* Cinematic Top Bar */}
      <header className="flex items-center justify-between px-6 h-20 bg-[#1e293b]/50 backdrop-blur-xl border-b border-slate-800/50 z-50">
        <div className="flex items-center gap-6">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all rounded-xl gap-2 p-2 h-12 w-12 lg:w-auto lg:px-4"
            variant="ghost"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="hidden lg:inline font-bold">Exit Classroom</span>
          </Button>
          <div className="h-8 w-[1px] bg-slate-800 hidden lg:block"></div>
          <div className="flex flex-col">
            <h1 className="text-sm lg:text-lg font-black text-white truncate max-w-[200px] lg:max-w-md leading-tight">
              {studentCurrentCourseProgress?.courseDetails?.title}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-32 lg:w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-1000"
                  style={{ width: `${(studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum?.length * 100) || 0}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {Math.round((studentCurrentCourseProgress?.progress?.filter(p => p.viewed).length / studentCurrentCourseProgress?.courseDetails?.curriculum?.length * 100) || 0)}% Complete
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => setIsSideBarOpen(!isSideBarOpen)}
            className={`rounded-xl h-12 w-12 p-0 transition-all ${isSideBarOpen ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            {isSideBarOpen ? (
              <ChevronRight className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Immersive Video Section */}
        <main
          className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isSideBarOpen ? "lg:mr-[420px]" : ""
            }`}
        >
          <div className="flex-1 bg-black flex items-center justify-center relative group">
            <VideoPlayer
              width="100%"
              height="100%"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          </div>
          <div className="p-8 lg:p-12 bg-[#0f172a] border-t border-slate-800/50">
            <div className="max-w-4xl">
              <span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em] mb-3 block">Now Playing</span>
              <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 leading-tight tracking-tight">
                {currentLecture?.title}
              </h2>
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800/30">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                  <span className="text-xl">🎓</span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium">Instructor</p>
                  <p className="text-white font-bold">{studentCurrentCourseProgress?.courseDetails?.instructorName}</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Dynamic Sidebar */}
        <aside
          className={`fixed lg:static top-0 right-0 bottom-0 w-full lg:w-[420px] bg-[#1e293b] border-l border-slate-800 transition-all duration-500 ease-in-out z-40 transform ${isSideBarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#0f172a]/50 w-full grid-cols-2 p-1 h-16 border-b border-slate-800">
              <TabsTrigger
                value="content"
                className="rounded-xl font-bold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="rounded-xl font-bold transition-all data-[state=active]:bg-indigo-600 data-[state=active]:text-white text-slate-400"
              >
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="flex-1 overflow-hidden m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-3">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item, index) => (
                      <div
                        key={item._id}
                        onClick={() => setCurrentLecture(item)}
                        className={`group flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all border-2 ${currentLecture?._id === item._id
                          ? "bg-indigo-600/10 border-indigo-500/50"
                          : "bg-slate-800/30 border-transparent hover:bg-slate-800/60"
                          }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors shadow-lg ${studentCurrentCourseProgress?.progress?.find(p => p.lectureId === item._id)?.viewed
                          ? "bg-emerald-500 text-white"
                          : currentLecture?._id === item._id
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-700 text-slate-400 group-hover:bg-slate-600"
                          }`}>
                          {studentCurrentCourseProgress?.progress?.find(p => p.lectureId === item._id)?.viewed ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <span className="text-xs font-black">{index + 1}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold truncate ${currentLecture?._id === item._id ? "text-white" : "text-slate-300"}`}>
                            {item?.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Play className={`h-3 w-3 ${currentLecture?._id === item._id ? "text-indigo-400" : "text-slate-500"}`} />
                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">Video • 5m</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 overflow-hidden m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-8">
                  <h3 className="text-xl font-black text-white mb-4 tracking-tight">About Course</h3>
                  <p className="text-slate-400 leading-relaxed font-medium">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>

                  <div className="mt-12 p-6 rounded-2xl bg-indigo-600/10 border border-indigo-500/20">
                    <h4 className="font-bold text-indigo-400 mb-2">Need Help?</h4>
                    <p className="text-sm text-slate-400 mb-4">Join our community discord to get help from mentors and peers.</p>
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold rounded-xl">Join Discord</Button>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      {/* Modern Dialogs */}
      <Dialog open={lockCourse}>
        <DialogContent className="sm:max-w-[500px] bg-[#1e293b] border-slate-800 rounded-3xl p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-10 w-10 text-amber-500" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black text-white">Access Denied</DialogTitle>
              <DialogDescription className="text-slate-400 text-lg pt-2 font-medium">
                You haven't purchased this course yet. Enroll now to unlock full access to all lectures.
              </DialogDescription>
            </DialogHeader>
            <Button onClick={() => navigate("/courses")} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-xl shadow-indigo-500/10 transition-all">
              Browse All Courses
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCourseCompleteDialog}>
        <DialogContent showOverlay={false} className="sm:max-w-[550px] bg-[#1e293b] border-slate-800 rounded-3xl p-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          <div className="text-center space-y-8 relative z-10">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-3xl rotate-12 flex items-center justify-center mx-auto border-4 border-emerald-500/30">
              <span className="text-5xl -rotate-12">🏆</span>
            </div>
            <DialogHeader>
              <DialogTitle className="text-4xl font-black text-white tracking-tight">Magnificent Work!</DialogTitle>
              <DialogDescription className="text-slate-400 text-lg pt-4 font-medium leading-relaxed">
                You've successfully mastered <span className="text-white font-bold">{studentCurrentCourseProgress?.courseDetails?.title}</span>.
                Your certificate is now available in your profile.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={() => navigate("/student-courses")} className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-md rounded-2xl transition-all shadow-xl shadow-indigo-500/20">
                Back to Dashboard
              </Button>
              <Button onClick={handleRewatchCourse} variant="outline" className="flex-1 h-14 border-slate-700 text-slate-300 font-black text-md rounded-2xl hover:bg-slate-800 transition-all">
                Review Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
