import MediaProgressbar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { Settings, Upload } from "lucide-react";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-600" />
          Course Settings
        </CardTitle>
        <p className="text-gray-500 font-medium">Fine-tune your course visibility and primary assets.</p>
      </CardHeader>

      <CardContent className="px-0 pt-6">
        <div className="bg-white border border-gray-100 rounded-[2rem] p-8 lg:p-10 shadow-sm space-y-8">
          <div className="space-y-4">
            <Label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Primary Display Asset</Label>

            <div className="relative">
              {mediaUploadProgress && (
                <div className="mb-6 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <p className="text-sm font-black text-indigo-900 mb-4">Finalizing Media Upload...</p>
                  <MediaProgressbar
                    isMediaUploading={mediaUploadProgress}
                    progress={mediaUploadProgressPercentage}
                  />
                </div>
              )}

              {courseLandingFormData?.image ? (
                <div className="relative group rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                  <img
                    src={courseLandingFormData.image}
                    className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <label className="cursor-pointer">
                      <input
                        onChange={handleImageUploadChange}
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                      <div className="bg-white text-gray-900 hover:bg-gray-50 h-14 px-8 rounded-2xl font-black flex items-center gap-2 transition-all transform hover:scale-105">
                        <Upload className="h-5 w-5" />
                        Replace Cover Image
                      </div>
                    </label>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <input
                    onChange={handleImageUploadChange}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-4 border-dashed border-gray-100 rounded-3xl p-16 text-center bg-gray-50/50 hover:bg-gray-100/50 hover:border-indigo-200 transition-all">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gray-200/50 group-hover:scale-110 transition-transform">
                      <Upload className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-1">Set Main Course Image</h3>
                    <p className="text-gray-400 font-medium">This image will represent your course everywhere.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50">
            <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm flex-shrink-0">
                <Settings className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-amber-900">Expert Tip</p>
                <p className="text-sm text-amber-700 font-medium">High-resolution images (1920x1080) increase enrollment rates by up to 25%.</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
