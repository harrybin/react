import React, { ReactNode } from 'react';
import { AppBar } from './AppBar';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FrameProps {
    children: ReactNode;
}

export function Frame(props: FrameProps) {
    return (
        <>
            <AppBar />

            {props.children}
        </>
    );
}

export default React.memo(Frame);
