import { Tooltip, createStyles, Box } from "@mantine/core";
import { forwardRef } from "react";
import { InfoCircle } from "tabler-icons-react";

const useStyles = createStyles(() => ({
  tooltip: {
    margin: "0 0 0 2px",
    textAlign: "center",
    svg: {
      // Aligns info-icon with label
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
    },
  },
}));

const NtnuiInfoTooltip = (label: JSX.Element) => {
  const { classes } = useStyles();
  return (
    <Tooltip
      position="top"
      className={classes.tooltip}
      classNames={{ tooltip: classes.tooltip }}
      color="dark"
      width={250}
      transition="pop"
      label={label}
      multiline
      children={<ReferencedInfoCircle />}
    />
  );
};

const ReferencedInfoCircle = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <Box ref={ref} {...props}>
      <InfoCircle size={16} />
    </Box>
  );
});

export default NtnuiInfoTooltip;
