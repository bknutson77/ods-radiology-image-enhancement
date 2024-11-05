import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

const SwitchComponent = ({
    checked,
    onChangeCallback
}) => {
    return (
        <Switch
            checked={checked}
            onChange={onChangeCallback}
        />
    );
};

export default SwitchComponent;