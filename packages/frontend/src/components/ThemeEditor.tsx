import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { StyledBox } from "caido-material-ui";
import { useState } from "react";
import {
  derivedColor,
  derivedFrom,
  type Mode,
  setTokenColor,
  type Theme,
  type ThemeToken,
  TOKEN_GROUPS,
  TOKEN_LABELS,
} from "shared";

import { ColorInput } from "@/components/ColorInput";
import { useSDK } from "@/stores/sdk";
import { useUpdateTheme } from "@/stores/themes";
import { activateTheme } from "@/themes/activeTheme";
import { caidoDefaultColor } from "@/themes/defaults";
import { downloadTheme } from "@/themes/files";

type ThemeEditorProps = {
  theme: Theme;
};

const describeFallback = (theme: Theme, token: ThemeToken, mode: Mode) => {
  const source = derivedFrom(theme.tokens, token, mode);
  const color =
    derivedColor(theme.tokens, token, mode) ?? caidoDefaultColor(token, mode);
  const label =
    source === undefined ? "Caido default" : `Follows ${TOKEN_LABELS[source]}`;

  return {
    color,
    placeholder: color === undefined ? label : `${label} (${color})`,
  };
};

const countSetColors = (
  theme: Theme,
  tokens: readonly ThemeToken[],
  mode: Mode,
) => tokens.filter((token) => theme.tokens[token]?.[mode] !== undefined).length;

export function ThemeEditor({ theme }: ThemeEditorProps) {
  const sdk = useSDK();
  const { mutate: updateTheme } = useUpdateTheme();
  const [draft, setDraft] = useState(theme);
  const [mode, setMode] = useState<Mode>("dark");

  const setColor = (token: ThemeToken, color: string) =>
    setDraft((current) => setTokenColor(current, token, mode, color));

  const handleSave = () =>
    updateTheme(draft, {
      onSuccess: (saved) => {
        activateTheme(saved);
        sdk.window.showToast("Theme saved and applied", { variant: "success" });
      },
    });

  return (
    <StyledBox sx={{ p: 2, overflow: "auto" }}>
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          {draft.name}
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" onClick={() => downloadTheme(draft)}>
            Export
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Use and Save
          </Button>
        </div>
      </div>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <TextField
          fullWidth
          label="Theme Name"
          value={draft.name}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
        <TextField
          fullWidth
          label="Author"
          value={draft.author}
          onChange={(event) =>
            setDraft({ ...draft, author: event.target.value })
          }
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
        />

        <Divider />

        <div className="flex justify-between items-center">
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Leave a color empty to keep Caido's own color for that appearance.
          </Typography>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={mode}
            onChange={(_event, value: Mode | null) => {
              if (value !== null) {
                setMode(value);
              }
            }}
          >
            <ToggleButton value="light">Light</ToggleButton>
            <ToggleButton value="dark">Dark</ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          {TOKEN_GROUPS.map(({ title, tokens }, index) => (
            <Accordion key={title} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: "bold", flexGrow: 1 }}>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {countSetColors(draft, tokens, mode)} of {tokens.length} set
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ display: "flex", flexDirection: "column", gap: 2 }}
              >
                {tokens.map((token) => {
                  const fallback = describeFallback(draft, token, mode);
                  return (
                    <ColorInput
                      key={token}
                      label={TOKEN_LABELS[token]}
                      value={draft.tokens[token]?.[mode] ?? ""}
                      placeholder={fallback.placeholder}
                      fallbackColor={fallback.color}
                      onChange={(color) => setColor(token, color)}
                    />
                  );
                })}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </Box>
    </StyledBox>
  );
}
