import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const RangeSliderComponent = ({
    width,
    min,
    max,
    value,
    onChangeCallback,
    disabled
}) => {
    return (
        <Box sx={{width: width}}>
            <Slider
                valueLabelDisplay="auto"
                min={min}
                max={max}
                value={value}
                onChange={onChangeCallback}
                disabled={disabled}
            />
        </Box>
    );
};

export default RangeSliderComponent;