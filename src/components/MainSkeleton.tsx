import React from 'react';
import { makeStyles } from 'tss-react/mui';
import { AppTheme } from '../AppTheme';
// EXAMPLE_START
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Box } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
// EXAMPLE_END

const useStyles = makeStyles()((theme: AppTheme) => ({
    mainContainer: {
        marginTop: theme.spacing(5),
        padding: theme.spacing(2),
    },
}));

function MainSkeletonComp() {
    const { classes } = useStyles();
    // EXAMPLE_START
    const theme = useTheme();
    // EXAMPLE_END
    return (
        <>
            <Container className={classes.mainContainer}>
                {/* EXAMPLE_START */}
                <Skeleton variant="rectangular" width={theme.spacing(32)} height={theme.spacing(8)}></Skeleton>
                <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={4}>
                    <Grid>
                        <Skeleton variant="text" width={theme.spacing(9)} height={theme.spacing(8)} />
                    </Grid>
                    <Grid>
                        <Skeleton variant="text" width={theme.spacing(9)} height={theme.spacing(8)} />
                    </Grid>
                    <Grid>
                        <Skeleton variant="text" width={theme.spacing(11)} height={theme.spacing(8)} />
                    </Grid>
                </Grid>
                <Box mt={2}>
                    <Skeleton variant="rectangular" width={theme.spacing(24)} height={theme.spacing(5)}></Skeleton>
                </Box>
                <Box mt={4}>
                    <Skeleton variant="rectangular" height={theme.spacing(16)}></Skeleton>
                </Box>
                <Box mt={4}>
                    <Skeleton variant="rectangular" height={theme.spacing(6)}></Skeleton>
                </Box>
                {/* EXAMPLE_END */}
            </Container>
        </>
    );
}

export const MainSkeleton = React.memo(MainSkeletonComp);
