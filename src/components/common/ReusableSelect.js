import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Chip,
  Box,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function ReusableSelect({
  label,
  value,
  onChange,
  options = [],
  optionLabel = (option) => option.label, // 옵션 라벨 선택
  optionValue = (option) => option.value, // 옵션 값 선택
}) {
  return (
    <FormControl
      sx={{
        marginBottom: "12px",
        "& .MuiOutlinedInput-root fieldset": {
          border: "none",
        },
      }}
    >
      <InputLabel id={`${label}-label`}>{label}</InputLabel>
      <Select
        labelId={`${label}-label`}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => {
          const selectedOption = options.find(
            (option) => optionValue(option) === selected
          );
          return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {selectedOption && (
                <Chip
                  label={optionLabel(selectedOption)}
                  sx={{
                    border: "1px solid darkgray",
                    backgroundColor: "white",
                    color: "black",
                  }}
                />
              )}
            </Box>
          );
        }}
        MenuProps={MenuProps}
        sx={{
          "& .MuiOutlinedInput-input": {
            padding: "12px 0px",
          },
        }}
      >
        {options.length === 0 ? (
          <MenuItem disabled>개설된 강의가 없습니다.</MenuItem>
        ) : (
          options.map((option, index) => (
            <MenuItem key={index} value={optionValue(option)}>
              {optionLabel(option)}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
}
