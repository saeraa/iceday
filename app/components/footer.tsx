import { Link, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Image from "next/image";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderBottom: 6,
        borderColor: "secondary.main",
      }}
    >
      <Grid
        padding={{ xs: 1, sm: 3 }}
        container
        rowSpacing={1}
        columns={{ sm: 2, md: 12 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid xs={12} sm={3} md={3}>
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent="space-evenly"
            alignItems="stretch"
            minHeight={{ xs: 250, md: 300 }}
            sx={{
              borderRight: { md: 4 },
              borderColor: { md: "grey.800" },
              my: { xs: 2 },
            }}
            paddingRight={3}
          >
            <Image
              style={{ filter: "grayscale(100%)" }}
              src="/logo-icon.svg"
              alt="Iceday logo"
              width={60}
              height={60}
              priority
            />
            <Typography
              variant="h3"
              noWrap
              component="a"
              href="/"
              color="grey.500"
              sx={{
                mr: 2,
                fontWeight: 800,
                letterSpacing: ".1rem",
                textDecoration: "none",
              }}
            >
              iceday
            </Typography>
            <Typography>
              Providing all hockey fans with a calendar for all your favourite
              games.
            </Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={3} md={3} display="flex" alignItems="center">
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={{ md: "center" }}
            alignItems="flex-start"
          >
            <Link href="https://github.com/saeraa/iceday" underline="hover">
              Github
            </Link>
            <p>Iceday &copy; 2024</p>
          </Box>
        </Grid>
        <Grid xs={12} sm={3} md={3} display="flex" alignItems="center">
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={{ md: "center" }}
            alignItems="flex-start"
          >
            <Link href="https://www.hockeyallsvenskan.se/" underline="hover">
              HA
            </Link>
            <Link href="https://hockeysverige.se/" underline="hover">
              Hockeysverige
            </Link>
            <Link href="https://www.shl.se/" underline="hover">
              SHL
            </Link>
          </Box>
        </Grid>
        <Grid xs={12} sm={3} md={3} display="flex" alignItems="center">
          <Box
            display="flex"
            flexDirection={"column"}
            justifyContent={{ md: "center" }}
            alignItems="flex-start"
          >
            <Link href="https://www.flashscore.se/ishockey/" underline="hover">
              Flashscore
            </Link>
            <Link href="https://www.swehockey.se/" underline="hover">
              Svenska Ishockeyförbundet
            </Link>
            <Link href="https://www.tvmatchen.nu/ishockey/" underline="hover">
              TVmatchen.nu
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
