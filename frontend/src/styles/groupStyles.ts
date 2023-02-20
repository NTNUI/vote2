import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  activeBox: {
    color: "white",
    minWidth: 250,
    height: 84,
    border: "2px solid",
    backgroundColor: theme.colors.ntnui_background[0],
    borderColor: theme.colors.ntnui_yellow[0],
    borderWidth: 1,
    borderRadius: 5,
    borderBottomRightRadius: 0,
    "&:hover": {
      backgroundColor: theme.colors.ntnui_yellow[0],
      color: "black",
    },

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  inActiveBox: {
    color: "white",
    minWidth: 250,
    height: 84,
    border: "2px solid",
    backgroundColor: theme.colors.ntnui_background[0],
    borderColor: theme.colors.ntnui_yellow[0],
    borderWidth: 1,
    borderRadius: 5,
    borderBottomRightRadius: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  greetingBox: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "right",
  },

  innerBox: {
    display: "grid",
    flexBasis: "100%",
    justifyItems: "center",
    alignItems: "center",
  },

  name: {
    flexBasis: "80%",
    fontSize: "2.3rem",
    fontWeight: 200,
  },
  title: {
    fontSize: "1.4rem",
    textAlign: "left",
    flexBasis: "100%",
  },
  subtitle: {
    flexBasis: "100%",
    fontSize: "1.1rem",
    textAlign: "left",
    marginBottom: "5%",
  },

  button: {
    flexBasis: "20%",
    borderRadius: 5,
    borderBottomRightRadius: 0,
    height: 46,
    width: 173,
    backgroundColor: theme.colors.ntnui_background[0],
    borderColor: "grey",
    "&:hover": {
      backgroundColor: "grey",
      borderColor: "grey",
    },
  },
}));
