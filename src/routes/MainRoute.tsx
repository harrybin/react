import React, { Suspense } from 'react';
import Main from '../components/Main';
import { MainSkeleton } from '../components/MainSkeleton';

function MainRoute() {
    return (
        <Suspense fallback={<MainSkeleton />}>
            <Main />
        </Suspense>
    );
}

export default React.memo(MainRoute);
