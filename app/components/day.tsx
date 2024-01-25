import * as React from "react";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs, { Dayjs } from "dayjs";

import Box from "@mui/material/Box";
import { Game } from "@/utils/firebase-database";
import { Typography } from "@mui/material";

interface DayProps {
  children?: React.ReactNode;
  date: Dayjs;
  games: Game[];
}

export default function ({ date = dayjs(), games }: DayProps) {
  const day = dayjs.tz(date, "Europe/Stockholm");
  const testDay = dayjs(day).toDate();

  const columns: GridColDef[] = [
    { field: "time", headerName: "Time", width: 130 },
    { field: "homeTeam", headerName: "Home Team", width: 130 },
    { field: "awayTeam", headerName: "Away Team", width: 130 },
    { field: "league", headerName: "League", width: 130 },
  ];

  const rows = games.map((game) => {
    return {
      id: game.dateTime + game.homeTeam + game.awayTeam,
      time: dayjs(game.dateTime).format("HH:mm"),
      homeTeam: game.homeTeam,
      awayTeam: game.awayTeam,
      league: game.league,
    };
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        margin: "auto",
        paddingTop: { xs: 4, md: 0 },
        maxWidth: "600px",
      }}
    >
      <Typography variant="h6">{testDay.toDateString()}</Typography>
      {games.length > 0 ? (
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      ) : (
        <Typography>No games on this day 😭</Typography>
      )}
    </Box>
  );
}
