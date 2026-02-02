import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import VideoPlayer from "@/components/video-player";
import { courseCurriculumInitialFormData } from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import {
  mediaBulkUploadService,
  mediaDeleteService,
  mediaUploadService,
} from "@/services";
import { Upload, Plus, Trash2, Video } from "lucide-react";
import { useContext, useRef } from "react";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null);

  function handleNewLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        ...courseCurriculumInitialFormData[0],
      },
    ]);
  }

  function handleCourseTitleChange(event, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      title: event.target.value,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  function handleFreePreviewChange(currentValue, currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    cpyCourseCurriculumFormData[currentIndex] = {
      ...cpyCourseCurriculumFormData[currentIndex],
      freePreview: currentValue,
    };

    setCourseCurriculumFormData(cpyCourseCurriculumFormData);
  }

  async function handleSingleLectureUpload(event, currentIndex) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          videoFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
          cpyCourseCurriculumFormData[currentIndex] = {
            ...cpyCourseCurriculumFormData[currentIndex],
            videoUrl: response?.data?.url,
            public_id: response?.data?.public_id,
          };
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function handleReplaceVideo(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const deleteCurrentMediaResponse = await mediaDeleteService(
      getCurrentVideoPublicId
    );

    if (deleteCurrentMediaResponse?.success) {
      cpyCourseCurriculumFormData[currentIndex] = {
        ...cpyCourseCurriculumFormData[currentIndex],
        videoUrl: "",
        public_id: "",
      };

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  function isCourseCurriculumFormDataValid() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  function handleOpenBulkUploadDialog() {
    bulkUploadInputRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(arr) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([key, value]) => {
        if (typeof value === "boolean") {
          return true;
        }
        return value === "";
      });
    });
  }

  async function handleMediaBulkUpload(event) {
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const response = await mediaBulkUploadService(
        bulkFormData,
        setMediaUploadProgressPercentage
      );

      console.log(response, "bulk");
      if (response?.success) {
        let cpyCourseCurriculumFormdata =
          areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)
            ? []
            : [...courseCurriculumFormData];

        cpyCourseCurriculumFormdata = [
          ...cpyCourseCurriculumFormdata,
          ...response?.data.map((item, index) => ({
            videoUrl: item?.url,
            public_id: item?.public_id,
            title: `Lecture ${cpyCourseCurriculumFormdata.length + (index + 1)
              }`,
            freePreview: false,
          })),
        ];
        setCourseCurriculumFormData(cpyCourseCurriculumFormdata);
        setMediaUploadProgress(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleDeleteLecture(currentIndex) {
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentSelectedVideoPublicId =
      cpyCourseCurriculumFormData[currentIndex].public_id;

    const response = await mediaDeleteService(getCurrentSelectedVideoPublicId);

    if (response?.success) {
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter(
        (_, index) => index !== currentIndex
      );

      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <div className="space-y-10">
      {/* Header section with actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Curriculum Builder</h2>
          <p className="text-gray-500 font-medium">Design your course structure and upload your lectures.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={bulkUploadInputRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleMediaBulkUpload}
          />
          <Button
            as="label"
            htmlFor="bulk-media-upload"
            variant="outline"
            className="rounded-xl h-12 px-6 font-bold border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center gap-2"
            onClick={handleOpenBulkUploadDialog}
          >
            <Upload className="h-5 w-5" />
            Bulk Upload
          </Button>

          <Button
            disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
            onClick={handleNewLecture}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-8 rounded-xl font-black shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add Lecture
          </Button>
        </div>
      </div>

      {/* Global Progress Bar */}
      {mediaUploadProgress && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                <Upload className="h-5 w-5 text-white animate-bounce" />
              </div>
              <div>
                <p className="font-black text-indigo-900">Uploading Media...</p>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{mediaUploadProgressPercentage}% Complete</p>
              </div>
            </div>
          </div>
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        </div>
      )}

      {/* Curriculum List */}
      <div className="space-y-6">
        {courseCurriculumFormData.map((curriculumItem, index) => (
          <div
            className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-gray-100 transition-all group"
            key={index}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar within card */}
              <div className="lg:w-16 flex lg:flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  {index + 1}
                </div>
                <div className="h-px lg:h-full lg:w-px bg-gray-100"></div>
              </div>

              {/* Content area */}
              <div className="flex-1 space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-1 w-full space-y-2">
                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Lecture Title</Label>
                    <Input
                      placeholder="e.g. Introduction to React"
                      className="h-14 rounded-2xl border-gray-100 focus:ring-indigo-600 focus:border-indigo-600 font-bold text-lg px-6 bg-gray-50/50"
                      onChange={(event) => handleCourseTitleChange(event, index)}
                      value={courseCurriculumFormData[index]?.title}
                    />
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
                    <div className="flex items-center space-x-3 pr-2">
                      <Label htmlFor={`freePreview-${index + 1}`} className="text-xs font-black text-gray-500 uppercase tracking-widest leading-none">
                        Free Preview
                      </Label>
                      <Switch
                        onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                        checked={courseCurriculumFormData[index]?.freePreview}
                        id={`freePreview-${index + 1}`}
                        className="data-[state=checked]:bg-indigo-600"
                      />
                    </div>
                    <div className="h-8 w-px bg-gray-200"></div>
                    <Button
                      onClick={() => handleDeleteLecture(index)}
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-8">
                  {courseCurriculumFormData[index]?.videoUrl ? (
                    <div className="bg-[#0f172a] rounded-[1.5rem] overflow-hidden shadow-2xl relative group/video">
                      <VideoPlayer
                        url={courseCurriculumFormData[index]?.videoUrl}
                        width="100%"
                        height="400px"
                      />
                      <div className="absolute top-6 right-6 flex gap-2 translate-y-2 opacity-0 group-hover/video:translate-y-0 group-hover/video:opacity-100 transition-all duration-300">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-2xl flex gap-2">
                          <Button
                            onClick={() => handleReplaceVideo(index)}
                            className="bg-white text-gray-900 hover:bg-gray-100 font-black rounded-xl h-10 px-4 text-xs"
                          >
                            Replace Video
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative group">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(event) => handleSingleLectureUpload(event, index)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 text-center bg-gray-50/50 hover:bg-white hover:border-indigo-400 transition-all group-hover:shadow-lg group-hover:shadow-indigo-50">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gray-200/50 group-hover:scale-110 transition-transform">
                          <Video className="h-7 w-7 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-black text-gray-900">Upload Video</h4>
                        <p className="text-sm text-gray-400 font-medium">MP4, WebM recommended (Max 500MB)</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courseCurriculumFormData.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Build Your Curriculum</h3>
          <p className="text-gray-500 font-medium mb-8">Click the button below to add your first lecture</p>
          <Button
            onClick={handleNewLecture}
            className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 transition-all"
          >
            Start Adding Lectures
          </Button>
        </div>
      )}
    </div>
  );
}

export default CourseCurriculum;
