import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import Header from "../../../components/Header";
import Grid from '@mui/material/Grid2';
import { tokens } from "../../../theme";
import StatBox from "../../../components/StatBox";
import WbIncandescentIcon from '@mui/icons-material/WbIncandescent';

import LightingChart from "../../../components/LineCharts/Lighting";

const Lighting = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
<Box m="20px" >
      <Box display="flex" justifyContent="space-between">
      <Header title="Lighting" subtitle="Line Chart" />
      <Grid item size={{ xs: 6, sm: 4, md: 4, lg: 2 }}>
        <Box
          // gridColumn="span 2"        
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{height: '112px', 
            width: {
              xs: 136, // 0
              sm: 110, // 600
              md: 136, // 900
              lg: 136, // 1200
              xl: 136, // 1536
          },
          }}
        >
          <StatBox
            title="GOOD"
            subtitle="Lighting"
            progress="0.75"
            // increase="+14%"
            icon={
              <WbIncandescentIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        </Grid>
      </Box>
      <Box height="75vh">
        <LightingChart />
      </Box>
    </Box>
  );
};

export default Lighting;