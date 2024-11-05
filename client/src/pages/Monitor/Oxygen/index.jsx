import { Box } from "@mui/material";
import Header from "../../../components/Header";
import OxygenChart from "../../../components/LineCharts/Oxygen";
const Oxygen = () => {
  return (
    <Box m="20px">
      <Header title="Oxygen" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <OxygenChart />
      </Box>
    </Box>
  );
};

export default Oxygen;