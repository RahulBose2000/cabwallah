import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import UserLogin from "./pages/UserLogin";
import UserSignUp from "./pages/UserSignUp";
import CaptainSignUp from "./pages/CaptainSignUp";
import CaptainLogin from "./pages/CaptainLogin";
import Start from "./pages/Start";

import UserProtectWrapper from "./components/UserProtectWrapper";
import CaptainProtectWrapper from "./components/CaptainProtectWrapper";

import UserLogout from "./pages/UserLogout";
import CaptainLogout from "./pages/CaptainLogout";

import Riding from "./pages/Riding";
import CaptainRiding from "./pages/CaptainRiding";
import CaptainContext from "./context/CaptainContext";
import CaptainHome from "./pages/CaptainHome";
import UserContext from "./context/UserContext";

const App = () => {
  return (
    <UserContext>
      <CaptainContext>
        <Routes>
          <Route path="/" element={<Start />} />

          {/* User Routes */}
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignUp />} />
          <Route path="/riding" element={<Riding />} />

          <Route
            path="/home"
            element={
              <UserProtectWrapper>
                <Home />
              </UserProtectWrapper>
            }
          />

          <Route
            path="/users/logout"
            element={
              <UserProtectWrapper>
                <UserLogout />
              </UserProtectWrapper>
            }
          />

          {/* Captain Routes */}
          <Route path="/captain-login" element={<CaptainLogin />} />
          <Route path="/captain-signup" element={<CaptainSignUp />} />
          <Route path="/captain-riding" element={<CaptainRiding />} />

          <Route
            path="/captain-home"
            element={
              <CaptainProtectWrapper>
                <CaptainHome />
              </CaptainProtectWrapper>
            }
          />

          <Route
            path="/captains/logout"
            element={
              <CaptainProtectWrapper>
                <CaptainLogout />
              </CaptainProtectWrapper>
            }
          />
        </Routes>
      </CaptainContext>
    </UserContext>
  );
};

export default App;
