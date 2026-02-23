// frontend/src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';
import { HelmetProvider } from 'react-helmet-async';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemPage from './pages/ProblemPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import CollegeDashboard from './pages/admin/CollegeDashboard';
import ProgramDetails from './pages/admin/ProgramDetails';
import DiscussPage from './pages/DiscussPage';
import DiscussionDetailPage from './pages/DiscussionDetailPage';
import AboutPage from './pages/AboutPage';
import OptOutPage from './pages/OptOutPage';

// Admin Auth
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import AssignProblemPage from './pages/admin/program/AssignProblemPage';
import EODReportPage from './pages/admin/reports/EODReportPage';
import CollegeDashboardPage from './pages/admin/college/CollegeDashboardPage';

// Legal Pages
import TermsPage from './pages/Legal/TermsPage';
import PrivacyPage from './pages/Legal/PrivacyPage';
import CodeOfConductPage from './pages/Legal/CodeOfConductPage';
import LicensePage from './pages/Legal/LicensePage';

// Support Pages
import HelpPage from './pages/Support/HelpPage';
import ContactPage from './pages/Support/ContactPage';
import ReportPage from './pages/Support/ReportPage';
import FeatureRequestPage from './pages/Support/FeatureRequestPage';

// Resources Pages
import DocsPage from './pages/Resources/DocsPage';
import ApiDocsPage from './pages/Resources/ApiDocsPage';
import TutorialsPage from './pages/Resources/TutorialsPage';
import BlogPage from './pages/Resources/BlogPage';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen bg-background flex flex-col">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#ffffff',
                color: '#000000',
                border: '1px solid #FFB22C',
              },
              success: {
                iconTheme: {
                  primary: '#22C55E',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Public Route */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HomePage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/problems"
              element={
                <PrivateRoute>
                  <Navbar />
                  <ProblemsPage />
                  <Footer />
                </PrivateRoute>
              }
            />
            <Route
              path="/problems/:slug"
              element={
                <PrivateRoute>
                  <Navbar />
                  <ProblemPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <PrivateRoute>
                  <Navbar />
                  <LeaderboardPage />
                  <Footer />
                </PrivateRoute>
              }
            />
            <Route
              path="/discuss"
              element={
                <PrivateRoute>
                  <Navbar />
                  <DiscussPage />
                  <Footer />
                </PrivateRoute>
              }
            />
            <Route
              path="/discuss/:id"
              element={
                <PrivateRoute>
                  <Navbar />
                  <DiscussionDetailPage />
                  <Footer />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Navbar />
                  <ProfilePage />
                  <Footer />
                </PrivateRoute>
              }
            />

            {/* Footer Pages */}
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <AboutPage />
                  <Footer />
                </>
              }
            />

            {/* Legal */}
            <Route path="/terms" element={<><Navbar /><TermsPage /><Footer /></>} />
            <Route path="/privacy" element={<><Navbar /><PrivacyPage /><Footer /></>} />
            <Route path="/code-of-conduct" element={<><Navbar /><CodeOfConductPage /><Footer /></>} />
            <Route path="/license" element={<><Navbar /><LicensePage /><Footer /></>} />

            {/* Support */}
            <Route path="/help" element={<><Navbar /><HelpPage /><Footer /></>} />
            <Route path="/contact" element={<><Navbar /><ContactPage /><Footer /></>} />
            <Route path="/report" element={<><Navbar /><ReportPage /><Footer /></>} />
            <Route path="/feature-request" element={<><Navbar /><FeatureRequestPage /><Footer /></>} />

            {/* Resources */}
            <Route path="/docs" element={<><Navbar /><DocsPage /><Footer /></>} />
            <Route path="/api-docs" element={<><Navbar /><ApiDocsPage /><Footer /></>} />
            <Route path="/tutorials" element={<><Navbar /><TutorialsPage /><Footer /></>} />
            <Route path="/blog" element={<><Navbar /><BlogPage /><Footer /></>} />

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminLayout />
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="programs" element={<CollegeDashboard />} />
              <Route path="programs/:id" element={<ProgramDetails />} />
              <Route path="program/assign" element={<AssignProblemPage />} />
              <Route path="reports/eod" element={<EODReportPage />} />
              <Route path="college/:collegeId" element={<CollegeDashboardPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;

