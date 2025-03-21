import { MantineTheme } from "@mantine/core";

export const useStyles = () => ({
  header: {
    position: "absolute",
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
      textDecoration: "underline",
    },
  },
});
