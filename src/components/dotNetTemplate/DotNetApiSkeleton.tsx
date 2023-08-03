// EXAMPLE_COMPONENT
import { Skeleton, Stack, useTheme } from '@mui/material';

export function DotNetApiSkeleton() {
    const theme = useTheme();
    return (
        <Stack spacing={1}>
            <Skeleton width={theme.spacing(12)} height={theme.spacing(8)} />
            <Stack direction="row" spacing={4}>
                <Skeleton width={theme.spacing(12)} height={theme.spacing(8)} />
                <Skeleton width={theme.spacing(12)} height={theme.spacing(8)} />
            </Stack>
            <Skeleton width={theme.spacing(40)} height={theme.spacing(8)} />
            <Skeleton width={theme.spacing(40)} height={theme.spacing(8)} />
            <Skeleton width={theme.spacing(40)} height={theme.spacing(8)} />
        </Stack>
    );
}
