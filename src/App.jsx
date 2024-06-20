import { useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Groups from "./pages/Groups";
import Login from "./pages/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Auth/Navbar";
import Dashboard from "./pages/ChatDashboard";
import Landing from "./pages/Landing";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./components/Admin/AdminHome";
import Admin from "./pages/Admin";
import UserManagement from "./components/Admin/UserManagement";
import ChatManagement from "./components/Admin/ChatManagement";
import MessageManagement from "./components/Admin/MessageManagement";
import { useSelector } from "react-redux";
import SocketProvider from "./utils/socket";

function App() {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <div className="w-screen min-h-screen flex flex-col  bg-background-dark">
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={!user} redirect="/home">
              <Landing />
            </ProtectedRoute>
          }
        />

        <Route
          element={
            // below: user={user} redirect="/login"
            <SocketProvider>
              <ProtectedRoute user={user} redirect="/login">
                <Dashboard />
              </ProtectedRoute>
            </SocketProvider>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/chat/:chatId" element={<Chat />} />
          {/* <Route
            path="/groups"
            element={
             
                <Groups />
           
            }
          /> */}
        </Route>

        <Route
          path="/groups"
          element={
            <SocketProvider>
              <ProtectedRoute user={user} redirect="/login">
                <Groups />
              </ProtectedRoute>
            </SocketProvider>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute user={!user} redirect="/home">
              <Login />
            </ProtectedRoute>
          }
        />

        <Route path="/admin" element={<Admin />} />

        <Route
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminHome />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />

          <Route path="/admin/messages" element={<MessageManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
