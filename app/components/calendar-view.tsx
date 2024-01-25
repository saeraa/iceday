"use client";

import { Game, getGames } from "@/utils/firebase-database";
import dayjs, { Dayjs } from "dayjs";

import Calendar from "./calendar";
import Day from "./day";
import Grid from "@mui/material/Grid";
import React from "react";

export default function CalendarView() {
  const [day, setDay] = React.useState<Dayjs>(dayjs());
  const [games, setGames] = React.useState<Game[]>([]);
  const [gameOfGameDay, setGamesOfGameDay] = React.useState<Game[]>([]);

  React.useEffect(() => {
    const selectedDay = day;
    const gamesThisDay = games.filter((game) => {
      return dayjs(game.dateTime).isSame(selectedDay, "day");
    });
    setGamesOfGameDay(gamesThisDay);
  }, [day]);

  React.useEffect(() => {
    async function getData() {
      const res = await getGames();
      setGames(res);
    }
    getData();
  }, []);

  return (
    <Grid container spacing={2} sx={{ py: 3 }}>
      <Grid item={true} xs={12} md={6}>
        <Calendar setDay={setDay} date={day} />
      </Grid>
      <Grid item={true} xs={12} md={6}>
        <Day date={day} games={gameOfGameDay} />
      </Grid>
    </Grid>
  );
}
