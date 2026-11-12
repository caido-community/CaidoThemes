import { ThemeProvider } from "@mui/material/styles";
import { caidoTheme, StyledSplitter } from "caido-material-ui";
import { useState } from "react";
import "allotment/dist/style.css";
import "./styles/style.css";

import { EmptyPage } from "@/components/EmptyPage";
import { ThemeEditor } from "@/components/ThemeEditor";
import { ThemesList } from "@/components/ThemesList";
import { useThemes } from "@/stores/themes";
import { getActiveThemeId, supportsDesignTokens } from "@/themes/activeTheme";

export function App() {
  const { data: themes = [] } = useThemes();
  const [selectedId, setSelectedId] = useState(getActiveThemeId);
  const selectedTheme = themes.find((theme) => theme.id === selectedId);

  if (!supportsDesignTokens()) {
    return <EmptyPage text="Caido Themes requires Caido 0.60 or later." />;
  }

  return (
    <ThemeProvider theme={caidoTheme}>
      <StyledSplitter>
        <ThemesList
          themes={themes}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selectedTheme === undefined ? (
          <EmptyPage text="Select a theme to edit it." />
        ) : (
          <ThemeEditor key={selectedTheme.id} theme={selectedTheme} />
        )}
      </StyledSplitter>
    </ThemeProvider>
  );
}
