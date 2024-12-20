import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "auth/Login.js";
import Register from "auth/Register.js";
import Home from "home/Home.js";
import Layout from "components/Layout.js";
import "./App.css";
import NotFound from "screen/NotFound.js";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Contents from "home/Contents";
import ContentDetail from "home/content/ContentDetail";
import Notification from "home/Notification";
import Message from "home/Message";
import ContentsByTypes from "home/content/ContentsByTypes";
import PageDetail from "home/PageDetail";
import BookDetail from "home/pages/book/BookDetail";
import Section from "home/pages/book/Section";
import Account from "home/Account";
import { fetchUserInfoRemote } from "network/AppService";
import AuthDetail from "home/pages/AuthDetail";
const App = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const currentUser = await fetchUserInfoRemote();
      if (currentUser.success) {
        setUser(currentUser);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route
              path="/login"
              element={<ProtectedRoute element={<Login />} />}
            />
            <Route
              path="/register"
              element={<ProtectedRoute element={<Register />} />}
            />
            <Route
              path="/forgot"
              element={<ProtectedRoute element={<Login />} />}
            />
            <Route
              path="/regenerate"
              element={<ProtectedRoute element={<Login />} />}
            />
            <Route path="/" element={<PrivateRoute />}>
              <Route element={<Layout user={user} />}>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />[
                <Route path="/home/:user/:slug" element={<BookDetail />} />
                <Route path="/home/:user" element={<AuthDetail />} />
                <Route
                  path="/home/:user/:slug/:sectionId"
                  element={<Section />}
                />
                ]
                <Route path="/contents" element={<Contents />} />[
                <Route
                  path="/contents/:contentType"
                  element={<ContentsByTypes />}
                />
                <Route
                  path="/contents/papers/:paperSlug"
                  element={<PageDetail />}
                />
                <Route
                  path="/content/:contentSlug"
                  element={<ContentDetail />}
                />
                ]
                <Route path="/activities" element={<Home />} />
                <Route path="/publication" element={<Home />} />
                <Route path="/bookmarks" element={<Home />} />
                <Route path="/messages" element={<Message />} />
                <Route path="/notifications" element={<Notification />} />
                <Route path="/account" element={<Account />} />
                <Route path="/settings" element={<Home />} />
                <Route path="/help" element={<Home />} />
                <Route path="/logout" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem("accessToken") != null;
  return isAuthenticated ? <Navigate to="/" /> : element;
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isAuthenticated = localStorage.getItem("accessToken") != null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default App;
