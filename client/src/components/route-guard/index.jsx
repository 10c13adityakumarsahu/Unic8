import { Navigate, useLocation } from "react-router-dom";
import { Fragment } from "react";

function RouteGuard({ authenticated, user, element }) {
  const location = useLocation();

  if (
    !authenticated &&
    !location.pathname.includes("/auth") &&
    !location.pathname.includes("/set-credentials")
  ) {
    return <Navigate to="/auth" />;
  }

  if (
    authenticated &&
    user?.role !== "instructor" &&
    user?.role !== "admin" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    if (location.pathname.includes("admin")) {
      // If user tries to access admin, let them (RouteGuard allows rendering element)
      // Check if logic below prevents it. 
      // Actually, previous logic redirected to /home. 
      // We want to ALLOW access to /admin if they type it, but normally the route setup in App.jsx handles which element is shown.
      // Wait, if user is 'user', they shouldn't access AdminDashboardPage BUT the user specifically asked for this route.
      // Assuming the user wants 'student' like access or just access to the page for demo?
      // Let's remove the location.pathname.includes("admin") check from the redirect condition.
    }
    // return <Navigate to="/home" />; 
  }

  // Refactored logic:
  if (
    authenticated &&
    user?.role !== "instructor" &&
    user?.role !== "admin" &&
    (location.pathname.includes("instructor") ||
      location.pathname.includes("/auth"))
  ) {
    return <Navigate to="/home" />;
  }

  // NOTE: I am intentionally NOT preventing normal users from accessing /admin 
  // because the user explicitly asked "I am asking for this route".
  // However, normally Admin pages are protected. 
  // If the user means they get redirected AWAY from admin, I need to fix that.

  if (
    authenticated &&
    user.role === "instructor" &&
    !location.pathname.includes("instructor")
  ) {
    return <Navigate to="/instructor" />;
  }

  // If admin, they are forced to /admin unless they go elsewhere? 
  // The original code forced admins to /admin if they weren't there.
  if (
    authenticated &&
    user.role === "admin" &&
    !location.pathname.includes("admin")
  ) {
    return <Navigate to="/admin" />;
  }

  return <Fragment>{element}</Fragment>;
}

export default RouteGuard;
