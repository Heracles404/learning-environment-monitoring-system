import { Box } from "@mui/material";
import Header from "../../../components/Header";
import LightingChart from "../../../components/LineCharts/Lighting";

const Lighting = () => {
  return (
    <Box m="20px">
      <Header title="Lighting" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <LightingChart />
      </Box>
    </Box>
  );
};

export default Lighting;