"use client";

import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import { Game, getGames } from "@/utils/firebase-database";
import React, { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

function ServerDay(
  props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }
) {
  const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;

  const isSelected =
    !props.outsideCurrentMonth &&
    highlightedDays.indexOf(props.day.date()) >= 0;

  return (
    <Badge
      key={props.day.toString()}
      overlap="circular"
      badgeContent={isSelected ? "🏒" : undefined}
    >
      <PickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    </Badge>
  );
}

interface CalendarProps {
  children?: React.ReactNode;
  setDay: (day: Dayjs) => void;
  date: Dayjs;
}

export default function Calendar({ setDay, date }: CalendarProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [highlightedDays, setHighlightedDays] = React.useState([0, 0, 0]);
  const [games, setGames] = React.useState<Game[]>([]);

  useEffect(() => {
    async function getData() {
      const res = await getGames();
      setGames(res);
    }
    getData();
  }, []);

  const fetchHighlightedDays = (date: Dayjs) => {
    const todaysMonth = date.month();

    const gamesThisMonth = games.filter(
      (game) => game.dateTime.month() === todaysMonth
    );

    const daysOfMonth = gamesThisMonth.map((game) => game.dateTime.date());

    setHighlightedDays(daysOfMonth);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchHighlightedDays(dayjs());
    // abort request on unmount
  }, [games]);

  const handleMonthChange = (date: Dayjs) => {
    setIsLoading(true);
    setHighlightedDays([]);
    fetchHighlightedDays(date);
  };

  return (
    <Box>
      <DateCalendar
        loading={isLoading}
        onMonthChange={handleMonthChange}
        fixedWeekNumber={5}
        renderLoading={() => <DayCalendarSkeleton />}
        showDaysOutsideCurrentMonth
        onChange={(newDay) => {
          setDay(newDay);
        }}
        timezone="system"
        slots={{
          day: ServerDay,
        }}
        slotProps={{
          day: {
            highlightedDays,
          } as any,
        }}
      />
    </Box>
  );
}
