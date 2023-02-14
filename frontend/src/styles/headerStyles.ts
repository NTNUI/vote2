import { createStyles } from "@mantine/core";

export const useStyles = createStyles(() => ({
  header: {
    position: "absolute",
    background: "none",
    marginBottom: "400px",
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    cursor: "pointer",
    height: "100%",
    "&:hover": {
      backgroundColor: "",
      textDecoration: "underline",
    },
  },
}));
