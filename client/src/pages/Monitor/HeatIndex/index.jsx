import { Box } from "@mui/material";
import Header from "../../../components/Header";
import HeatIndexChart from "../../../components/LineCharts/HeatIndex";
const HeatIndex = () => {
  return (
    <Box m="20px">
      <Header title="Heat Index" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <HeatIndexChart />
      </Box>
    </Box>
  );
};

export default HeatIndex;