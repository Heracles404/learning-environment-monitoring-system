import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const StatBox = ({ title,title2, subtitle, subtitle2,subtitle3, icon, icon2, progress, increase }) => {
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
            <Box>
            {title2}
            </Box>
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
          {icon2}
          <Typography variant="h3"
                      fontWeight="bold"
 
        sx={{ 
          // color: colors.primary[500]
          color: "white"
           }}>
          {subtitle3}
           </Typography>
        </Box>
      </Box>
      
    </Box>
  );
};

export default StatBox;