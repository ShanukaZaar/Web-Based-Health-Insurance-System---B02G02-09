import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import AppRoutes from './routes/AppRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import HomeButton from './components/home/HomeButton';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public landing pages: no portal sidebar/top bar */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Standalone Login & Register Page */}
            <Route path="/login" element={<Login />} />

            {/* Portal application with layout and routes */}
            <Route
              path="/*"
              element={
                <Layout>
                  <HomeButton />
                  <AppRoutes />
                </Layout>
              }
            />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;