import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
  activeBox: {
    "&:hover": {
      backgroundColor: theme.colors.ntnui_yellow[0],
      color: "black",
    },
    color: "white",
    minWidth: 250,
    paddingLeft: 10,
    paddingRight: 10,
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
    cursor: "pointer",
  },

  box: {
    color: "white",
    minWidth: 250,
    paddingLeft: 10,
    paddingRight: 10,
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

  name: {
    fontSize: "2.3rem",
    fontWeight: 200,
  },

  button: {
    borderRadius: 5,
    borderBottomRightRadius: 0,
    height: 46,
    minWidth: 173,
    backgroundColor: theme.colors.ntnui_background[0],
    borderColor: "grey",
    "&:hover": {
      backgroundColor: "grey",
      borderColor: "grey",
    },
  },
}));
