// EXAMPLE_COMPONENT
import { useFetch } from '@harrybin/react-common';
import { ApiUrls } from '../../../api/api/apiUrls';
import { Box, Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Manufacturer as ManufacturerDto } from '../../../api/swagger/manufacturer';
import { ManufacturerResponse } from '../../../api/swagger/manufacturerResponse';
import ManufacturerList from './ManufacturerList';
import { grey } from '@mui/material/colors';

interface ManufacturerProps {
    data: ManufacturerDto[];
}

function Manufacturer(props: ManufacturerProps) {
    const [newManuName, setNewManuName] = useState<string>('');
    const [data, setData] = useState<ManufacturerDto[]>(props.data);
    const { updateDataAsync } = useFetch();

    async function addManufacturer() {
        const newEntry = (await updateDataAsync({
            queryString: ApiUrls.dotNetTemplateApi.manufactures,
            method: 'POST',
            data: { name: newManuName },
        })) as ManufacturerResponse;
        if (newEntry.result) setData([...data, newEntry.result]);
    }

    async function deleteManufacturer(manuId: string) {
        const entryToDelete = data?.find((manu) => manu.id === manuId);
        if (entryToDelete) {
            updateDataAsync({
                queryString: ApiUrls.dotNetTemplateApi.manufacturesId(manuId),
                method: 'DELETE',
                data: entryToDelete,
            });
        }
    }

    return (
        <>
            <Box mt={4} padding={2} borderColor={grey[500]} border={1} data-testid="manufacturer-box">
                <Box padding={1} borderColor="lightgrey !important" border={1}>
                    <Stack spacing={4} direction="row">
                        <TextField
                            data-testid="manu-textfield"
                            value={newManuName}
                            size="small"
                            label="Manufacturer name"
                            onChange={(event) => setNewManuName(event.target.value)}
                        />
                        <Button variant="contained" onClick={addManufacturer}>
                            Add new manufacturer
                        </Button>
                    </Stack>
                </Box>
                <ManufacturerList data={data} data-testid="manufacturer-list" onDelete={deleteManufacturer} />
            </Box>
        </>
    );
}

export default React.memo(Manufacturer);
