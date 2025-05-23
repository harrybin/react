import React, { useState } from 'react';
import { makeStyles } from 'tss-react/mui';
import { AppTheme } from '../AppTheme';
import { Container } from '@mui/material';
// EXAMPLE_START
import { Box, Button, Typography, Alert, TextField, Stack } from '@mui/material';
import { Grid } from '@mui/material';
import { useTranslation } from '../common/i18n/useTranslation';
import ChuckNorrisJoke from './ChuckNorrisJoke';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog, If, Markdown, useDebugMode } from '@harrybin/react-common'; //EXAMPLE_CODE DebugMode
import { useUserData } from '../contexts/UserContextProvider';
import { routes } from '../routes/routes';

// EXAMPLE_END

const useStyles = makeStyles()((theme: AppTheme) => ({
    mainContainer: {
        marginTop: theme.spacing(5),
        padding: theme.spacing(2),
    },
    // EXAMPLE_START
    divider: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    // EXAMPLE_END
}));

/**
 * Main component.
 */
function Main() {
    const { classes } = useStyles();
    // EXAMPLE_START
    const translate = useTranslation();
    const navigate = useNavigate();
    const [counter, setCounter] = useState<number>(0);
    const [queryCount, setQueryCount] = useState<number>(0);

    const { isInDebugMode } = useDebugMode();
    const [isDebugVisible, setIsDebugVisible] = useState<boolean>(true);

    const { userData, setUserData } = useUserData();
    // EXAMPLE_END
    return (
        (<Container className={classes.mainContainer}>
            {/* EXAMPLE_START */}
            <Typography variant="h1">{translate('app_title')}</Typography>
            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
                <Grid>
                    <Button variant="outlined" onClick={() => setCounter(counter + 1)}>
                        Click {counter}
                    </Button>
                </Grid>
                <Grid>
                    <Button color="secondary" variant="contained" onClick={() => setCounter(counter + 1)}>
                        Click {counter}
                    </Button>
                </Grid>
                <Grid size={4}>
                    <Button color="primary" variant="contained" onClick={() => navigate(routes.test)}>
                        Testroute
                    </Button>
                </Grid>
                <Grid size={4}>
                    <Typography variant="h6">{translate('user')}</Typography>
                    <Stack direction="row">
                        <TextField
                            label={translate('firstname')}
                            value={userData.Firstname}
                            size="small"
                            onChange={(e) => setUserData({ Firstname: e.target.value })}
                        />
                        <TextField
                            label={translate('lastname')}
                            value={userData.Lastname}
                            size="small"
                            onChange={(e) => setUserData({ Lastname: e.target.value })}
                        />
                    </Stack>
                </Grid>
            </Grid>
            {/* EXAMPLE_START */}
            <ChuckNorrisJoke queryTrigger={queryCount}>
                <Button
                    data-testid="reload-btn"
                    color="error"
                    variant="contained"
                    onClick={() => {
                        setQueryCount(queryCount + 1);
                    }}
                >
                    Reload data
                </Button>
            </ChuckNorrisJoke>
            {/* EXAMPLE_END */}
            {/* EXAMPLE_START */}
            <Box mt={4}>
                <Alert severity={isInDebugMode ? 'error' : 'info'}>
                    <If cond={isInDebugMode ? 'error' : 'info'} else={<Markdown>{translate('debug_hint')}</Markdown>}>
                        <Markdown>{translate('debug_active')}</Markdown>
                    </If>
                </Alert>
            </Box>
            <ConfirmationDialog
                open={isInDebugMode && isDebugVisible}
                leftButtonLabel="Ok"
                title={translate('debug_mode')}
                onClose={() => {
                    setIsDebugVisible(false);
                }}
            >
                <Markdown>{translate('debug_active')}</Markdown>
            </ConfirmationDialog>
            {/* EXAMPLE_END */}
        </Container>)
    );
}

export default React.memo(Main);
