import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import PreferenceRequiredRoute from "./components/ui/PreferenceRequiredRoute";
import SwipeBackNavigation from "./components/ui/SwipeBackNavigation";

import FullPageLoader from "./components/ui/Loader";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const MovieDetails = lazy(() => import("./pages/MovieDetails"));
const Recommendations = lazy(() => import("./pages/Recommendations"));
const Profile = lazy(() => import("./pages/Profile"));
const Preferences = lazy(() => import("./pages/Preferences"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Suspense fallback={<FullPageLoader label="Loading your experience..." />}><AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/preferences" element={<ProtectedRoute><PageTransition><Preferences /></PageTransition></ProtectedRoute>} />

        <Route
          path="/home"
          element={
            <PreferenceRequiredRoute>
              <PageTransition><Home /></PageTransition>
            </PreferenceRequiredRoute>
          }
        />
        <Route
          path="/search"
          element={
            <PreferenceRequiredRoute>
              <PageTransition><Search /></PageTransition>
            </PreferenceRequiredRoute>
          }
        />
        <Route
          path="/movie/:movieId"
          element={
            <PreferenceRequiredRoute>
              <PageTransition><MovieDetails /></PageTransition>
            </PreferenceRequiredRoute>
          }
        />
        <Route
          path="/recommendations"
          element={
            <PreferenceRequiredRoute>
              <PageTransition><Recommendations /></PageTransition>
            </PreferenceRequiredRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PreferenceRequiredRoute>
              <PageTransition><Profile /></PageTransition>
            </PreferenceRequiredRoute>
          }
        />

        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence></Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider><div className="min-h-screen flex flex-col bg-bg">
        <SwipeBackNavigation />
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div></LanguageProvider>
    </AuthProvider>
  );
}
