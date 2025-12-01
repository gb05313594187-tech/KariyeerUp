// @ts-nocheck
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FollowProvider } from '@/contexts/FollowContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';
import PricingSimple from './pages/PricingSimple';
import PaymentCallback from './pages/PaymentCallback';
import PaymentSuccess from './pages/PaymentSuccess';
import MentorCircle from './pages/MentorCircle';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import CoachList from './pages/CoachList';
import CoachProfile from './pages/CoachProfile';
import CoachApplication from './pages/CoachApplication';
import CoachSelectionProcess from './pages/CoachSelectionProcess';
import ForCoaches from './pages/ForCoaches';
import ForCompanies from './pages/ForCompanies';
import BookingSystem from './pages/BookingSystem';
import MyBookings from './pages/MyBookings';
import MySessions from './pages/MySessions';
import VideoSession from './pages/VideoSession';
import Webinars from './pages/Webinars';
import Analytics from './pages/Analytics';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import AdminPanel from './pages/AdminPanel';
import CoachDashboard from './pages/CoachDashboard';
import ReviewSystem from './pages/ReviewSystem';
import NotificationCenter from './pages/NotificationCenter';
import SubscriptionHistory from './pages/SubscriptionHistory';
import Partnership from './pages/Partnership';
import RevenueModel from './pages/RevenueModel';
import CoachSelection from './pages/CoachSelection';
import KVKKAydinlatma from './pages/KVKKAydinlatma';
import CerezPolitikasi from './pages/CerezPolitikasi';
import KullanimSozlesmesi from './pages/KullanimSozlesmesi';
import KocSozlesmesi from './pages/KocSozlesmesi';
import DanisanSozlesmesi from './pages/DanisanSozlesmesi';
import DebugAuth from './pages/DebugAuth';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <FollowProvider>
          <NotificationProvider>
            <SubscriptionProvider>
              <TooltipProvider>
                <Toaster />
                <HashRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    
                    {/* Auth Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    
                    {/* User Routes */}
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/debug-auth" element={<DebugAuth />} />
                    
                    {/* Coach Routes */}
                    <Route path="/coaches" element={<CoachList />} />
                    <Route path="/coach/:id" element={<CoachProfile />} />
                    <Route path="/coach-application" element={<CoachApplication />} />
                    <Route path="/coach-selection-process" element={<CoachSelectionProcess />} />
                    <Route path="/coach-selection" element={<CoachSelection />} />
                    <Route path="/coach-dashboard" element={<CoachDashboard />} />
                    <Route path="/for-coaches" element={<ForCoaches />} />
                    
                    {/* Company Routes */}
                    <Route path="/for-companies" element={<ForCompanies />} />
                    
                    {/* Booking & Sessions */}
                    <Route path="/booking/:coachId" element={<BookingSystem />} />
                    <Route path="/my-bookings" element={<MyBookings />} />
                    <Route path="/my-sessions" element={<MySessions />} />
                    <Route path="/video-session/:sessionId" element={<VideoSession />} />
                    
                    {/* Community */}
                    <Route path="/mentor-circle" element={<MentorCircle />} />
                    <Route path="/webinars" element={<Webinars />} />
                    
                    {/* Pricing & Payment */}
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/pricing-simple" element={<PricingSimple />} />
                    <Route path="/payment-callback" element={<PaymentCallback />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/subscription-history" element={<SubscriptionHistory />} />
                    
                    {/* Analytics & Admin */}
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/admin-panel" element={<AdminPanel />} />
                    
                    {/* Other */}
                    <Route path="/reviews" element={<ReviewSystem />} />
                    <Route path="/notifications" element={<NotificationCenter />} />
                    <Route path="/partnership" element={<Partnership />} />
                    <Route path="/revenue-model" element={<RevenueModel />} />
                    
                    {/* Legal Pages */}
                    <Route path="/kvkk" element={<KVKKAydinlatma />} />
                    <Route path="/cerez-politikasi" element={<CerezPolitikasi />} />
                    <Route path="/kullanim-sozlesmesi" element={<KullanimSozlesmesi />} />
                    <Route path="/koc-sozlesmesi" element={<KocSozlesmesi />} />
                    <Route path="/danisan-sozlesmesi" element={<DanisanSozlesmesi />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </HashRouter>
              </TooltipProvider>
            </SubscriptionProvider>
          </NotificationProvider>
        </FollowProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
