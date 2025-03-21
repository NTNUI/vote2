import { createStyles } from "@mantine/emotion";

export const useStyles = createStyles((theme) => ({
  optionButton: {
    backgroundColor: theme.colors.ntnui_background[0],
    color: "white",
    borderColor: "white",
    borderRadius: 5,
    borderBottomRightRadius: 0,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "white",
      color: theme.colors.ntnui_background[0],
      borderColor: "white",
      opacity: 0.7,
    },
  },
}));
