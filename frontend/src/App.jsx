import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './components/shared/Layout';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}

export default App;
