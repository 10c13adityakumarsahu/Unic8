import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center max-w-xl">
        <div className="relative mb-8">
          <h1 className="text-9xl font-black text-indigo-50/50 absolute left-1/2 -top-12 -translate-x-1/2 select-none">404</h1>
          <p className="text-xl font-black text-indigo-600 relative z-10 tracking-widest uppercase">Lost in Space</p>
        </div>

        <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-900 sm:text-6xl">
          Page not found
        </h2>
        <p className="mt-6 text-lg font-medium leading-8 text-gray-500">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or doesn't exist anymore.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={() => navigate("/home")}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 rounded-2xl font-black gap-2 shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl font-black gap-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </Button>
        </div>

        <div className="mt-16 flex justify-center gap-6">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-200"></div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
