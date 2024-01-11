import Calendar from "./components/calendar";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Box component="main">
      <Grid container spacing={2} sx={{ py: 3 }}>
        <Grid xs={12} md={6}>
          <Calendar />
        </Grid>
        <Grid xs={12} md={6}>
          <Typography>Placeholder day</Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
