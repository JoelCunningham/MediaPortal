import { NavigationProvider } from '@contexts/navigation';
import Navbar from '@layouts/navbar';
import { APP_DIR, HOME_DIR } from '@objects/constants';
import App from '@pages/app';
import Home from '@pages/home';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';

const Main = () => (
    <Router>
        <NavigationProvider>
            <Routes>
                <Route element={<Navbar />}>
                    <Route path={HOME_DIR} element={<Home />} />
                    <Route path={APP_DIR} element={<App />} />
                    <Route path='*' element={<Navigate to='/' />} />
                </Route>
            </Routes>
        </NavigationProvider>
    </Router>
);

createRoot(document.getElementById('root')!).render(<Main />);