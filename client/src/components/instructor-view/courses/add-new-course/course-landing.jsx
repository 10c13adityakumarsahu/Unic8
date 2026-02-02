import FormControls from "@/components/common-form/form-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { courseLandingPageFormControls } from "@/config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { mediaUploadService } from "@/services";
import { InstructorContext } from "@/context/instructor-context";
import { ImagePlus, X } from "lucide-react";
import { useContext } from "react";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useContext(InstructorContext);
  function handleImageUploadChange(event) {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedFile);

      (async () => {
        try {
          const response = await mediaUploadService(imageFormData, () => { });
          if (response?.success) {
            setCourseLandingFormData({
              ...courseLandingFormData,
              image: response.data.url,
            });
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-black text-gray-900 tracking-tight">Course Visuals & Details</CardTitle>
        <p className="text-gray-500 font-medium">Capture student attention with a compelling cover and description.</p>
      </CardHeader>
      <CardContent className="px-0 space-y-10">
        {/* Cover Image Section */}
        <div className="space-y-4">
          <Label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Course Cover Image</Label>

          {courseLandingFormData?.image ? (
            <div className="relative group rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
              <img
                src={courseLandingFormData.image}
                alt="Course Cover"
                className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                <Button
                  variant="destructive"
                  size="lg"
                  className="rounded-2xl font-black gap-2 h-14 px-8 shadow-2xl shadow-red-500/20"
                  onClick={() =>
                    setCourseLandingFormData({
                      ...courseLandingFormData,
                      image: "",
                    })
                  }
                >
                  <X className="h-5 w-5" />
                  Remove Image
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUploadChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-4 border-dashed border-gray-100 rounded-3xl p-12 text-center bg-gray-50/50 hover:bg-gray-100/50 hover:border-indigo-200 transition-all group">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gray-200/50 group-hover:scale-110 transition-transform">
                  <ImagePlus className="h-10 w-10 text-indigo-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-1">Upload Cover Image</h3>
                <p className="text-gray-400 font-medium">Drag and drop or click to browse (16:9 recommended)</p>
              </div>
            </div>
          )}
        </div>

        {/* Form Controls */}
        <div className="bg-gray-50/50 p-8 lg:p-10 rounded-3xl border border-gray-100">
          <FormControls
            formControls={courseLandingPageFormControls}
            formData={courseLandingFormData}
            setFormData={setCourseLandingFormData}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
