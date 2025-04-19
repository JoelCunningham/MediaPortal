import { NavigationProvider } from '@contexts/navigation';
import { ShortcutProvider } from '@contexts/shortcut';
import Navbar from '@layouts/navbar';
import { HOME_DIR } from '@objects/constants';
import Home from '@pages/home';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';

const Main = () => (
    <Router>
        <ShortcutProvider>
            <NavigationProvider>
                <Routes>
                    <Route element={<Navbar />}>
                        <Route path={HOME_DIR} element={<Home />} />
                        <Route path='*' element={<Navigate to={HOME_DIR} />} />
                    </Route>
                </Routes>
            </NavigationProvider>
        </ShortcutProvider>
    </Router>
);

createRoot(document.getElementById('root')!).render(<Main />);