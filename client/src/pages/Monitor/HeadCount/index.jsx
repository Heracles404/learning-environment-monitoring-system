import { Box } from "@mui/material";
import Header from "../../../components/Header";
import HeadCountChart from "../../../components/LineCharts/HeadCount";

const HeatCount = () => {
  return (
    <Box m="20px">
      <Header title="Heat Count" subtitle="Simple Line Chart" />
      <Box height="75vh">
        <HeadCountChart />
      </Box>
    </Box>
  );
};

export default HeatCount;