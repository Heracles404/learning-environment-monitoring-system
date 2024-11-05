import { Box } from "@mui/material";
import Header from "../../../components/Header";
import CarbonDioxideChart from "../../../components/LineCharts/CarbonDioxide";

const CarbonDioxide = () => {
  return (
    <Box m="20px">
      <Header title="Carbon Dioxide" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <CarbonDioxideChart />
      </Box>
    </Box>
  );
};

export default CarbonDioxide;