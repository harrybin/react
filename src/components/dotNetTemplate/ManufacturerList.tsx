// EXAMPLE_COMPONENT
import { Chip, Stack } from '@mui/material';
import { Manufacturer } from '../../../api/swagger/manufacturer';
import React from 'react';

interface ManufacturerListProps {
    data: Manufacturer[];
    onDelete?: (manuId: string) => void;
}

function ManufacturerList(props: ManufacturerListProps) {
    function builManufacturersList() {
        return (
            <Stack spacing={1} margin={2}>
                {props.data?.map((manu) => (
                    <Chip
                        data-testid="manufacturer-chip"
                        key={manu.id}
                        label={manu.name}
                        //TODO: API does not yet support DELETE
                        //onDelete={() => manu.id && props.onDelete && props.onDelete(manu.id)}
                    />
                ))}
            </Stack>
        );
    }

    return <>{builManufacturersList()}</>;
}

export default React.memo(ManufacturerList);
