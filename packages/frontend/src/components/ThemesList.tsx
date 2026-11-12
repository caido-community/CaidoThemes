import FileUploadIcon from "@mui/icons-material/FileUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { StyledBox } from "caido-material-ui";
import { useState } from "react";
import type { Theme, ThemeContent } from "shared";

import { useSDK } from "@/stores/sdk";
import { useAddTheme, useRemoveTheme, useResetThemes } from "@/stores/themes";
import { pickThemeFile } from "@/themes/files";

type ThemesListProps = {
  themes: Theme[];
  selectedId: string | undefined;
  onSelect: (id: string | undefined) => void;
};

const NEW_THEME: ThemeContent = {
  version: 2,
  name: "New theme",
  description: "",
  author: "",
  tokens: {},
};

export function ThemesList({ themes, selectedId, onSelect }: ThemesListProps) {
  const sdk = useSDK();
  const { mutate: addTheme } = useAddTheme();
  const { mutate: removeTheme } = useRemoveTheme();
  const { mutate: resetThemes } = useResetThemes();

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleAdd = () =>
    addTheme(NEW_THEME, { onSuccess: (theme) => onSelect(theme.id) });

  const handleImport = async () => {
    setMenuAnchor(null);
    const input = await pickThemeFile();
    addTheme(input, {
      onSuccess: (theme) => {
        onSelect(theme.id);
        sdk.window.showToast("Theme imported", { variant: "success" });
      },
    });
  };

  const handleReset = () => {
    setIsResetDialogOpen(false);
    resetThemes(undefined, { onSuccess: () => onSelect(undefined) });
  };

  return (
    <StyledBox>
      <div className="flex justify-between items-center p-5">
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Themes
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            aria-haspopup="true"
            onClick={(event) => setMenuAnchor(event.currentTarget)}
          >
            Actions
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={menuAnchor !== null}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setIsResetDialogOpen(true);
              }}
            >
              <ListItemIcon>
                <RestartAltIcon fontSize="small" />
              </ListItemIcon>
              Reset
            </MenuItem>
            <MenuItem onClick={handleImport}>
              <ListItemIcon>
                <FileUploadIcon fontSize="small" />
              </ListItemIcon>
              Import
            </MenuItem>
          </Menu>
          <Button variant="contained" onClick={handleAdd}>
            New
          </Button>
        </div>
      </div>

      <Dialog
        open={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        aria-labelledby="reset-themes-title"
      >
        <DialogTitle id="reset-themes-title">Reset themes?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This deletes every theme and restores the built-in ones. It cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleReset} autoFocus>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer
        sx={{ overflow: "auto", maxHeight: "calc(100vh - 150px)" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {themes.map((theme) => (
              <TableRow
                hover
                key={theme.id}
                selected={theme.id === selectedId}
                onClick={() => onSelect(theme.id)}
              >
                <TableCell>{theme.name}</TableCell>
                <TableCell>{theme.description}</TableCell>
                <TableCell>{theme.author}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeTheme(theme.id);
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </StyledBox>
  );
}
