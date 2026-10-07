import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/shared/Layout';
import AppRoutes from './routes/AppRoutes';
import Home from './pages/Home';
import HomeButton from './components/home/HomeButton';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Public landing page: no sidebar/top bar */}
          <Route path="/" element={<Home />} />

          {/* Everything else keeps the existing layout and routes */}
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
    </BrowserRouter>
  );
}

export default App;