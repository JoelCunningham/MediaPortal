import { NavigationProvider } from '@contexts/navigation-context';
import App from '@pages/app';
import Home from '@pages/home';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';
import Navbar from './layouts/navbar';

const Main = () => (
    <Router>
        <NavigationProvider>
            <Routes>
                <Route element={<Navbar />}>
                    <Route path='/' element={<Home />} />
                    <Route path='/app' element={<App />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
        </NavigationProvider>
    </Router>
);

createRoot(document.getElementById('root')!).render(<Main />);