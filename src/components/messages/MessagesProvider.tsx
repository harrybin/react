import React, { forwardRef, ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';
import { ClassNameMap, CombinedClassKey, SnackbarKey, SnackbarProvider, CustomContentProps } from 'notistack';
import { Alert, AlertColor } from '@mui/material';

const useStyles = makeStyles()(() => ({
    alert: {
        mw: '90vw',
    },
}));

type CloseSnackbarAction = (key?: SnackbarKey) => void;

const ThemeResponsiveSnackbarComp = forwardRef<HTMLDivElement, CustomContentProps & { component: React.ReactNode }>(
    (props, forwardedRef) => {
        const { classes } = useStyles();
        const { message, variant, component, persist, action } = props;
        const closeAction = action as CloseSnackbarAction;
        return (
            <Alert
                className={classes.alert}
                ref={forwardedRef}
                severity={variant as AlertColor}
                onClose={persist ? () => closeAction() : undefined}
            >
                {component ? component : message}
            </Alert>
        );
    }
);

const ThemeResponsiveSnackbar = React.memo(ThemeResponsiveSnackbarComp);
export function MessagesProvider(props: { children: ReactNode }) {
    const { classes } = useStyles();

    return (
        <SnackbarProvider
            dense
            hideIconVariant
            classes={classes as unknown as Partial<ClassNameMap<CombinedClassKey>>} // CombinedClassKey misses 'contentRoot', so we need the cast here
            preventDuplicate={true}
            maxSnack={3}
            anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom',
            }}
            Components={{
                info: ThemeResponsiveSnackbar,
                success: ThemeResponsiveSnackbar,
                error: ThemeResponsiveSnackbar,
                warning: ThemeResponsiveSnackbar,
            }}
        >
            {props.children}
        </SnackbarProvider>
    );
}
