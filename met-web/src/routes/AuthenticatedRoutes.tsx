import React from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import { ThemeProvider } from "@mui/system";
import { BaseTheme, PublicTheme } from "../styles/Theme";
import UserService from "../services/UserServices";

const AuthenticatedRoutes = () => {
  const adminRole = UserService.hasAdminRole();

  return (
    <ThemeProvider theme={adminRole ? BaseTheme : PublicTheme}>
      <Routes>
        <Route path="/" element={<h1>App</h1>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
};

export default AuthenticatedRoutes;
