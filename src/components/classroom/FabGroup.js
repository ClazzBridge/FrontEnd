import React from 'react';
import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import {LightTooltip} from "../../styles/FloatingActionButtons.styles";

export default function FabGroup({ actions, onClick }) {
  return (
      <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', paddingRight: '10px' }}>
        {actions.map((action, index) => (
            <LightTooltip
                key={index}
                title={action.name}
                placement='left'
            >
            <Fab
                key={index}
                size='medium'
                aria-label={action.name}
                sx={{
                  backgroundColor: action.name === '이해 완료' ? 'green' : 'white',
                  color: action.name === '이해 완료' ? 'white' : 'gray',
                  '&:hover': {
                    backgroundColor: action.name === '이해 완료' ? 'darkgreen' : 'lightgray', // 호버링 시 색상
                  }
                }}
                onClick={() => onClick(action.name)}
            >
              {action.icon}
            </Fab>
            </LightTooltip>
        ))}
      </Box>
  );
}