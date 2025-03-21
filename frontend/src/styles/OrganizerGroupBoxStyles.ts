import { createStyles } from "@mantine/emotion";

export const useStyles = createStyles((theme) => ({
  buttonStyle: {
    borderRadius: theme.radius.md,
    borderBottomRightRadius: 0,
    marginRight: "2vw",
  },
  smallButtonStyle: {
    borderRadius: theme.radius.md,
    borderBottomRightRadius: 0,
    marginRight: "1vw",
    width: "auto",
    fontSize: 10,
  },
}));
