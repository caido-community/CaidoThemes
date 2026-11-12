import { Box, TextField } from "@mui/material";
import { isHexColor, toOpaqueHex } from "shared";

type ColorInputProps = {
  label: string;
  value: string;
  placeholder: string;
  fallbackColor: string | undefined;
  onChange: (value: string) => void;
};

const PICKER_FALLBACK = "#000000";

const pickerValueFor = (value: string, fallbackColor: string | undefined) =>
  toOpaqueHex(isHexColor(value) ? value : (fallbackColor ?? PICKER_FALLBACK));

export function ColorInput({
  label,
  value,
  placeholder,
  fallbackColor,
  onChange,
}: ColorInputProps) {
  const isInvalid = value !== "" && !isHexColor(value);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <TextField
        fullWidth
        label={label}
        value={value}
        slotProps={{ inputLabel: { shrink: true } }}
        placeholder={placeholder}
        error={isInvalid}
        helperText={isInvalid ? "Use a hex color, such as #1a2b3c" : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      <input
        type="color"
        aria-label={label}
        value={pickerValueFor(value, fallbackColor)}
        onChange={(event) => onChange(event.target.value)}
        style={{ width: 56, height: 56 }}
      />
    </Box>
  );
}
