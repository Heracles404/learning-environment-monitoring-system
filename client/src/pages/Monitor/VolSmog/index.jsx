import { Box } from "@mui/material";
import Header from "../../../components/Header";
import VolSmogChart from "../../../components/LineCharts/VolSmog";
const VolSmog = () => {
  return (
    <Box m="20px">
      <Header title="Volcanic Smog" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <VolSmogChart />
      </Box>
    </Box>
  );
};

export default VolSmog;