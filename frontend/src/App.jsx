import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EvaluateBids from './pages/EvaluateBids'
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./pages/Auth";
import CreateAdmin from "./pages/CreateAdmin";
import CreateTender from './pages/CreateTender'
import ViewTenders from './pages/ViewTenders'
import SubmitBid from './pages/SubmitBid'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import AdminApproval from './pages/AdminApproval'
import EmailPreferences from './pages/EmailPreferences'
import QRScannerPage from './pages/QRScannerPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<Auth initialMode="login" />} />
        <Route path="/register" element={<Auth initialMode="register" />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/buyer" element={<ProtectedRoute><BuyerDashboard/></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications/></ProtectedRoute>} />
        <Route path="/email-preferences" element={<ProtectedRoute><EmailPreferences/></ProtectedRoute>} />
        {/* Buyer Routes */}
        <Route path="/buyer/create-tender" element={<ProtectedRoute><CreateTender/></ProtectedRoute>} />
        <Route path="/buyer/evaluate-bids" element={<ProtectedRoute><EvaluateBids/></ProtectedRoute>} />
        <Route path="/buyer/evaluate/:tenderId" element={<ProtectedRoute><EvaluateBids/></ProtectedRoute>} />
        <Route path="/buyer/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>} />
        
        {/* Supplier Routes */}
        <Route path="/supplier/view-tenders" element={<ProtectedRoute><ViewTenders/></ProtectedRoute>} />
        <Route path="/supplier/submit-bid" element={<ProtectedRoute><SubmitBid/></ProtectedRoute>} />
        <Route path="/supplier/submit-bid/:id" element={<ProtectedRoute><SubmitBid/></ProtectedRoute>} />
        <Route path="/supplier/my-bids" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin/reports" element={<ProtectedRoute><Reports/></ProtectedRoute>} />
        <Route path="/admin/approval" element={<ProtectedRoute><AdminApproval/></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/admin/tenders" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />

        <Route path="/dashboard/supplier" element={<ProtectedRoute><SupplierDashboard/></ProtectedRoute>} />
        <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        
        {/* QR Code Routes */}
        <Route path="/qr-scanner" element={<ProtectedRoute><QRScannerPage/></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}
