import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { makeStyles } from 'tss-react/mui';
import SettingsIcon from '@mui/icons-material/Settings';
import { Button, Grid, Avatar, Tooltip, AppBar as AppBarMui } from '@mui/material';
import { AppTheme } from '../AppTheme';
import { grey } from '@mui/material/colors';
// EXAMPLE_START
import BugReportIcon from '@mui/icons-material/BugReport';
import { useTranslation } from '../common/i18n/useTranslation';
import { useDebugMode, If } from '@harrybin/react-common';
import { useUserData } from '../contexts/UserContextProvider';
// EXAMPLE_END

const useStyles = makeStyles()((theme: AppTheme) => ({
    colorWhite: {
        color: theme.palette.common.white,
    },
    userAvatar: {
        background: grey[400],
    },
}));

export function AppBar() {
    const { classes } = useStyles();

    // EXAMPLE_START
    const translate = useTranslation();
    const { isInDebugMode } = useDebugMode();
    // EXAMPLE_END

    const { userData } = useUserData();

    function getUserInfo() {
        return `${userData.Firstname?.substring(0, 1)}${userData.Lastname?.substring(0, 1)}`;
    }

    return (
        <AppBarMui>
            <Grid container direction="row" justifyContent="space-between">
                <Grid item>
                    <Grid container alignItems="center">
                        <Grid item>
                            <IconButton size="large" edge="start" aria-label="menu" className={classes.colorWhite}>
                                <MenuIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <Typography variant="h6" noWrap component="div">
                                react
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item>
                    <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
                        {/* EXAMPLE_START */}
                        <Grid item>
                            <If cond={isInDebugMode}>
                                <Button variant="contained" color="error" endIcon={<BugReportIcon />}>
                                    {translate('debug_mode')}
                                </Button>
                            </If>
                        </Grid>
                        {/* EXAMPLE_END */}
                        <Grid item>
                            <IconButton size="large" edge="start" aria-label="menu" className={classes.colorWhite}>
                                <SettingsIcon />
                            </IconButton>
                        </Grid>
                        <Grid item>
                            <IconButton size="large" edge="start" aria-label="menu" className={classes.colorWhite}>
                                <Tooltip title={`${userData.Firstname} ${userData.Lastname}`}>
                                    <Avatar className={classes.userAvatar}>{getUserInfo()}</Avatar>
                                </Tooltip>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AppBarMui>
    );
}
