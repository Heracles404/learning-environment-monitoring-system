import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title, subtitle, subtitle2, icon, icon2, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px" >
      <Box display="flex" justifyContent="space-between" >
        <Box >
          {/* {icon} */}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ 
              // color: colors.grey[100]
              color: "white"
               }}>
            {title}
          </Typography>
          <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" 
        sx={{ 
          // color: colors.primary[500]
          color: "white"
           }}>
          <Box>
          {subtitle}
          </Box>
          {subtitle2}
        </Typography>
        
      </Box>
        </Box>
        <Box>
          {/* <ProgressCircle progress={progress} /> */}
          {icon2}
        </Box>
      </Box>
      
    </Box>
  );
};

export default StatBox;