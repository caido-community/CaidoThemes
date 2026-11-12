import { Typography } from "@mui/material";
import { StyledBox } from "caido-material-ui";

type EmptyPageProps = {
  text: string;
};

export function EmptyPage({ text }: EmptyPageProps) {
  return (
    <StyledBox className="flex items-center justify-center h-full">
      <Typography>{text}</Typography>
    </StyledBox>
  );
}
