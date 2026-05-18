import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";
import ShipsList from "./pages/ShipsList";
import ShipDetails from "./pages/ShipDetails";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateShipment from "./pages/admin/CreateShipment";
import ManageShipments from "./pages/admin/ManageShipments";
import CreateRoute from "./pages/admin/CreateRoute";
import ManagePorts from "./pages/admin/ManagePorts";
import AdminLogin from "./pages/admin/Login";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/ships" element={<ShipsList />} />
          <Route path="/ships/:id" element={<ShipDetails />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <AuthGuard>
              <AdminDashboard />
            </AuthGuard>
          } />
          
          <Route path="/admin/create-shipment" element={
            <AuthGuard>
              <CreateShipment />
            </AuthGuard>
          } />
          
          <Route path="/admin/shipments" element={
            <AuthGuard>
              <ManageShipments />
            </AuthGuard>
          } />

          <Route path="/admin/create-route" element={
            <AuthGuard>
              <CreateRoute />
            </AuthGuard>
          } />

          <Route path="/admin/ports" element={
            <AuthGuard>
              <ManagePorts />
            </AuthGuard>
          } />
          
          <Route path="/admin/ships" element={
            <AuthGuard>
              <ShipsList />
            </AuthGuard>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;