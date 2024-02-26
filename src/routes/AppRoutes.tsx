import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainRoute from './MainRoute';
import { useTranslation } from '../common/i18n/useTranslation';
import TestRoute from './TestRoute';
import { routes } from './routes';

const AppRoutes = () => {
    const translate = useTranslation();

    return <Routes>
        <Route key="home" path={routes.home} element={<MainRoute />} />
        <Route key="test" path={routes.test} element={<TestRoute />} />
        <Route key="notFound" path="*" element={<p>{translate('route_not_found')}</p>} />
    </Routes>
};

export default React.memo(AppRoutes);
