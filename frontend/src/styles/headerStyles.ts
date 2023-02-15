import { createStyles } from "@mantine/core";

export const useStyles = createStyles(() => ({
  header: {
    position: "absolute",
    width: "100vw",
    background: "none",
  },

  inner: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "10px",
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
