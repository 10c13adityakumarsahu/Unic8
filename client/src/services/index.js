import axiosInstance from "@/api/axiosInstance";

export async function registerService(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });

  return data;
}

export async function loginService(formData) {
  const { data } = await axiosInstance.post("/auth/login", formData);

  return data;
}

export async function verifyOTPService(formData) {
  const { data } = await axiosInstance.post("/auth/verify-otp", formData);

  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");

  return data;
}

export async function setCredentialsService(formData) {
  const { data } = await axiosInstance.post("/auth/set-credentials", formData);

  return data;
}

export async function updateUserService(userId, formData) {
  const { data } = await axiosInstance.put(`/auth/update/${userId}`, formData);

  return data;
}

export async function mediaUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function mediaDeleteService(id) {
  const { data } = await axiosInstance.delete(`/media/delete/${id}`);

  return data;
}

export async function fetchInstructorCourseListService() {
  const { data } = await axiosInstance.get(`/instructor/course/get`);

  return data;
}

export async function fetchCoursesByInstructorIdService(instructorId) {
  const { data } = await axiosInstance.get(`/instructor/course/get/instructor/${instructorId}`);
  return data;
}

export async function addNewCourseService(formData) {
  const { data } = await axiosInstance.post(`/instructor/course/add`, formData);

  return data;
}

export async function fetchInstructorCourseDetailsService(id) {
  const { data } = await axiosInstance.get(
    `/instructor/course/get/details/${id}`
  );

  return data;
}

export async function updateCourseByIdService(id, formData) {
  const { data } = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );

  return data;
}

export async function mediaBulkUploadService(formData, onProgressCallback) {
  const { data } = await axiosInstance.post("/media/bulk-upload", formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });

  return data;
}

export async function fetchStudentViewCourseListService(query) {
  const { data } = await axiosInstance.get(
    `/student/course/get${query ? `?${query}` : ""}`
  );
  return data;
}

export async function fetchStudentViewMentorsService() {
  const { data } = await axiosInstance.get("/student/course/mentors");
  return data;
}

export async function fetchStudentViewCourseDetailsService(courseId) {
  const { data } = await axiosInstance.get(
    `/student/course/get/details/${courseId}`
  );

  return data;
}

export async function checkCoursePurchaseInfoService(courseId, studentId) {
  const { data } = await axiosInstance.get(
    `/student/course/purchase-info/${courseId}/${studentId}`
  );

  return data;
}

export async function createPaymentService(formData) {
  const { data } = await axiosInstance.post(`/student/order/create`, formData);

  return data;
}

export async function captureAndFinalizePaymentService(
  paymentId,
  payerId,
  orderId
) {
  const { data } = await axiosInstance.post(`/student/order/capture`, {
    paymentId,
    payerId,
    orderId,
  });

  return data;
}

export async function fetchStudentBoughtCoursesService(studentId) {
  const { data } = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );

  return data;
}

export async function getCurrentCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.get(
    `/student/course-progress/get/${userId}/${courseId}`
  );

  return data;
}

export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}

export async function fetchAdminStatsService() {
  const { data } = await axiosInstance.get("/admin/stats");
  return data;
}

export async function fetchAllUsersService() {
  const { data } = await axiosInstance.get("/admin/users");
  return data;
}

export async function onboardInstructorService(userId) {
  const { data } = await axiosInstance.post("/admin/onboard", { userId });
  return data;
}

export async function fetchAllInstructorsService() {
  const { data } = await axiosInstance.get("/admin/instructors");
  return data;
}

export async function addNewInstructorService(formData) {
  const { data } = await axiosInstance.post("/admin/add-instructor", formData);
  return data;
}

export async function forgotPasswordService(formData) {
  const { data } = await axiosInstance.post("/auth/forgot-password", formData);
  return data;
}

export async function resetPasswordService(formData) {
  const { data } = await axiosInstance.post("/auth/reset-password", formData);
  return data;
}

export async function changePasswordService(formData) {
  const { data } = await axiosInstance.post("/auth/change-password", formData);
  return data;
}

export async function createMeetingRequestService(formData) {
  const { data } = await axiosInstance.post("/student/meeting/create", formData);
  return data;
}

export async function fetchInstructorMeetingsService(instructorId) {
  const { data } = await axiosInstance.get(`/student/meeting/instructor/${instructorId}`);
  return data;
}

export async function fetchStudentMeetingsService(studentId) {
  const { data } = await axiosInstance.get(`/student/meeting/student/${studentId}`);
  return data;
}

export async function updateMeetingStatusService(meetingId, formData) {
  const { data } = await axiosInstance.put(`/student/meeting/update/${meetingId}`, formData);
  return data;
}

export async function captureMeetingPaymentService(meetingId) {
  const { data } = await axiosInstance.put(`/student/meeting/capture-payment/${meetingId}`);
  return data;
}

export async function rateMeetingService(meetingId, formData) {
  const { data } = await axiosInstance.put(`/student/meeting/rate/${meetingId}`, formData);
  return data;
}

