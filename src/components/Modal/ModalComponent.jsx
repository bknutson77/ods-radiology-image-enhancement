import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ModalComponent = ({
  open,
  width,
  children
}) => {
  return (
    <div>
      <Modal
        open={open}
      >
        <Box sx={[style, {width: width}]}>
          {children}
        </Box>
      </Modal>
    </div>
  );
};
export default ModalComponent;