import { Tooltip, Box, rem } from "@mantine/core";
import { forwardRef, JSX } from "react";
import { InfoCircle } from "tabler-icons-react";
import { CSSProperties } from "react";

const tooltipStyles = {
  tooltip: {
    margin: `0 0 0 ${rem(2)}`,
    textAlign: "center" as const,
    width: rem(250),
    "& svg": {
      // Aligns info-icon with label
      display: "flex",
      alignContent: "center",
      justifyContent: "center",
    },
  } as CSSProperties,
};

const NtnuiInfoTooltip = (label: JSX.Element) => {
  return (
    <Tooltip
      position="top"
      styles={{
        tooltip: tooltipStyles.tooltip,
      }}
      color="dark"
      label={label}
      multiline
    >
      <ReferencedInfoCircle />
    </Tooltip>
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
