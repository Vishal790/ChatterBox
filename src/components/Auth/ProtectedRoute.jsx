import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({children,user,redirect="/login"}) => {
  if(!user) return <Navigate to={redirect} />

  return children? children : <Outlet/>
}

// export default ProtectedRoute

// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate, Outlet } from "react-router-dom";

// const ProtectedRoute = ({ children, redirect = "/login" }) => {
//   const { token, isAdmin } = useSelector((state) => state.auth);
//   // console.log(token);

//   if (!token) return <Navigate to={redirect} />;

//   return children ? children : <Outlet />;
// };

export default ProtectedRoute;