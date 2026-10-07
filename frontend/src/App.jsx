import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/shared/Layout';
import AppRoutes from './routes/AppRoutes';

import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
