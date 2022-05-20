import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login';

import HomePage from './pages/Home';
import CollectionPage from './pages/Collection';
import ItemPage from './pages/Item';
import { conf, initConf } from './store';
import ApiUI from './components/ApiUI';

async function init() {
  const container = document.getElementById('app');
  const root = createRoot(container);

  function App({ children }) {
    useEffect(() => {
      const overlay = document.getElementById('overlay');
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 500);
    });
    return <>{children}</>;
  }

  const loggedIn = await initConf();
  if (loggedIn) {
    console.log({ confApp: conf });

    root.render(
      <App>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/v1/ui" element={<ApiUI />} />
            <Route path="/settings" element={<HomePage />} />
            <Route path="/definitions" element={<HomePage />} />
            <Route path="/users" element={<HomePage />} />
            <Route path={'/e/:collection'} element={<CollectionPage />} />
            <Route path={'/e/:collection/:id'} element={<ItemPage />} />
          </Routes>
        </BrowserRouter>
      </App>
    );
  } else {
    root.render(
      <App>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </App>
    );
  }
}

init();
