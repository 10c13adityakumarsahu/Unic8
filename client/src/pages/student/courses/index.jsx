import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { ArrowUpDownIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    console.log(indexOfCurrentSeection, getSectionId);
    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };

      console.log(cpyFilters);
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    const query = new URLSearchParams({
      ...filters,
      sortBy: sort,
    });
    const response = await fetchStudentViewCourseListService(query);
    if (response?.success) {
      setStudentViewCoursesList(response?.data);
      setLoadingState(false);
    }
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
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    setSearchParams(new URLSearchParams(buildQueryStringForFilters));
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
    };
  }, []);

  console.log(loadingState, "loadingState");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="flex flex-col items-start gap-4 mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            All Courses
          </h1>
          <p className="text-gray-500 font-medium">
            Browse through our extensive library of professional courses
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-80 space-y-8 sticky top-28 self-start">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
                Filters
              </h2>
              <div className="space-y-8">
                {Object.keys(filterOptions).map((ketItem) => (
                  <div key={ketItem} className="space-y-4">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">
                      {ketItem}
                    </h3>
                    <div className="flex flex-col gap-3">
                      {filterOptions[ketItem].map((option) => (
                        <Label
                          key={option.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Checkbox
                            className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all"
                            checked={
                              filters &&
                              Object.keys(filters).length > 0 &&
                              filters[ketItem] &&
                              filters[ketItem].indexOf(option.id) > -1
                            }
                            onCheckedChange={() =>
                              handleFilterOnChange(ketItem, option)
                            }
                          />
                          <span className="text-[15px] font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">
                            {option.label}
                          </span>
                        </Label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-8 border-indigo-100 text-indigo-600 hover:bg-indigo-50 font-bold"
                onClick={() => {
                  setFilters({});
                  sessionStorage.removeItem("filters");
                }}
              >
                Clear All
              </Button>
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                  {studentViewCoursesList.length} Results
                </span>
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 hover:bg-gray-50 text-gray-700 font-bold"
                    >
                      <ArrowUpDownIcon className="h-4 w-4" />
                      <span>Sort By</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px] rounded-xl shadow-xl border-gray-100">
                    <DropdownMenuRadioGroup
                      value={sort}
                      onValueChange={(value) => setSort(value)}
                    >
                      {sortOptions.map((sortItem) => (
                        <DropdownMenuRadioItem
                          value={sortItem.id}
                          key={sortItem.id}
                          className="font-medium focus:bg-indigo-50 focus:text-indigo-600 transition-colors"
                        >
                          {sortItem.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-6">
              {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                studentViewCoursesList.map((courseItem) => (
                  <Card
                    onClick={() => handleCourseNavigate(courseItem?._id)}
                    className="group cursor-pointer border-gray-100 hover:border-indigo-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white"
                    key={courseItem?._id}
                  >
                    <CardContent className="flex flex-col sm:flex-row gap-8 p-0">
                      <div className="sm:w-80 h-48 flex-shrink-0 overflow-hidden relative">
                        <img
                          src={courseItem?.image}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">
                              {courseItem?.category.replace("-", " ")}
                            </span>
                            <p className="font-black text-2xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                              ₹{courseItem?.pricing}
                            </p>
                          </div>
                          <CardTitle className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                            {courseItem?.title}
                          </CardTitle>
                          <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
                            <span>By</span>
                            <span className="text-gray-900 font-bold">{courseItem?.instructorName}</span>
                          </p>
                          <div className="flex items-center gap-4 flex-wrap">
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-bold">
                              {`${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length <= 1 ? "Lecture" : "Lectures"}`}
                            </span>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider">
                              {courseItem?.level}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : loadingState ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-48 w-full rounded-2xl" />)}
                </div>
              ) : (
                <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm">
                  <h1 className="font-black text-4xl text-gray-300 mb-4">No Courses Found</h1>
                  <p className="text-gray-400 font-medium max-w-sm mx-auto">
                    Try adjusting your filters or search criteria to find what you are looking for.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default StudentViewCoursesPage;
