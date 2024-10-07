import * as React from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';

export default function CustomizedInputBase({question, setQuestion, onSubmit} ) {
  return (
      <Paper
          component="form"
          sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, marginBottom: '60px', marginRight:'20px'}}
      >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            value={question}
            placeholder="질문을 입력하세요."
            onChange={(e) => setQuestion(e.target.value)}
            inputProps={{ 'aria-label': 'search google maps' }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={onSubmit}>
          <CheckIcon />
        </IconButton>

      </Paper>
  );
}