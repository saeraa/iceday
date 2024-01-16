import { Button, Container, Paper } from "@mui/material";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={2}
        sx={{
          px: 3,
          py: 5,
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Button variant="contained" sx={{ marginTop: 2 }}>
          <Link href="/">Return Home</Link>
        </Button>
      </Paper>
    </Container>
  );
}
