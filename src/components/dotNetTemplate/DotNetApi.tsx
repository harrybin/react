// EXAMPLE_COMPONENT
import { useQuery } from '@harrybin/react-common';
import { ApiUrls } from '../../../api/api/apiUrls';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { ManufacturersResponse } from '../../../api/swagger/manufacturersResponse';
import Manufacturer from './Manufacturer';
import config from '../../configuration/configuration';

export function DotNetApi() {
    const manufacturersResp = useQuery<ManufacturersResponse>({
        queryString: ApiUrls.dotNetTemplateApi.manufactures,
        // Here you can either add individual custom error and exception handler or set global handler using 'registerGlobalFetchErrorHandler' from '@harrybin/react-common'
        // handleErrorCallback: (resp) => {
        //     throw new Error(`${resp.status} - ${resp.statusText}`);
        // },
        // handleExceptionCallback: (error) => {
        //     throw error; // "Failed to fetch" means the CORS pre-fetch command fails, e.g. the service is not running
        // },
    });

    return (
        <Paper>
            <Stack spacing={4} padding={2}>
                <Typography variant="h4">DotnetTemplate Api</Typography>
                <Box mt={4}>
                    <Typography variant="subtitle2">
                        API-Endpoint is configured to: <Typography variant="body2">{config.apiEndpoint}</Typography>
                    </Typography>
                </Box>
                <Manufacturer data={manufacturersResp?.results ?? []} />
            </Stack>
        </Paper>
    );
}
