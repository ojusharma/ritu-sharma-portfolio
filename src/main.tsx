import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { HomePage } from './pages';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <Routes>
          <Route path="/:section?" element={<HomePage />} />
        </Routes>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>
);
