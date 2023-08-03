// EXAMPLE_COMPONENT
import { List, ListItem, ListItemIcon, ListItemText, Paper, Grid, Button, Divider, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import { SnackbarAction, useSnackbar } from 'notistack';
import { getRoutePath } from './routeConfig';
import { Routes } from './routes';
import React from 'react';

function TestRoute() {
    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleClick = (target: Routes) => {
        navigate(getRoutePath(target));
    };

    return (
        <Paper>
            <Grid container direction="row" justifyContent="center">
                <Grid item>
                    <List>
                        <ListItem>
                            <Button
                                id="button_test0"
                                style={{ backgroundColor: 'orange' }}
                                onClick={() => {
                                    enqueueSnackbar(
                                        <Typography variant="body2">
                                            This is a persistant warning with a custom component to be closed.
                                        </Typography>,
                                        {
                                            variant: 'warning',
                                            style: { whiteSpace: 'pre-line' },
                                            action: closeSnackbar as SnackbarAction,
                                            persist: true,
                                        }
                                    );
                                }}
                            >
                                Test Warning
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button
                                id="button_test1"
                                style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}
                                onClick={() => {
                                    throw new Error('This is a Test Exception');
                                }}
                            >
                                Test Exception
                            </Button>
                        </ListItem>

                        <ListItem>
                            <Button
                                id="button_test2"
                                style={{ backgroundColor: 'rgba(255, 0, 0, 0.3)' }}
                                onClick={() => {
                                    const p = new Promise(function (_resolve, reject) {
                                        setTimeout(function () {
                                            // Note that we reject with an Error object
                                            // This is useful for getting an accurate stack trace!
                                            reject(new Error('This is a Test PROMISE Exception'));
                                        }, 100);
                                    });

                                    p.then(function () {
                                        console.log('done!');
                                    });
                                }}
                            >
                                Test Exception Promise
                            </Button>
                        </ListItem>

                        <ListItem
                            onClick={() => {
                                handleClick(Routes.home);
                            }}
                        >
                            <ListItemIcon>
                                <FormatListNumberedIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item></Grid>

                <Grid item>
                    <Divider />
                </Grid>
            </Grid>
        </Paper>
    );
}

export default React.memo(TestRoute);
