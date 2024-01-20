"use client";

import {
  DateCalendar,
  DayCalendarSkeleton,
  PickersDay,
  PickersDayProps,
} from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import React from "react";

// helper placeholder function to be removed when api call is implemented
function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

// placeholder fetch until the api call is implemented
function fakeFetch(date: Dayjs, { signal }: { signal: AbortSignal }) {
  return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
    const timeout = setTimeout(() => {
      const daysInMonth = date.daysInMonth();
      const daysToHighlight = [1, 2, 3].map(() =>
        getRandomNumber(1, daysInMonth)
      );

      resolve({ daysToHighlight });
    }, 500);

    signal.onabort = () => {
      clearTimeout(timeout);
      reject(new DOMException("aborted", "AbortError"));
    };
  });
}

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

export default function Calendar() {
  const requestAbortController = React.useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [value, setValue] = React.useState<Dayjs>(dayjs());
  const [highlightedDays, setHighlightedDays] = React.useState([0, 0, 0]);

  const fetchHighlightedDays = (date: Dayjs) => {
    const controller = new AbortController();
    fakeFetch(date, {
      signal: controller.signal,
    })
      .then(({ daysToHighlight }) => {
        setHighlightedDays(daysToHighlight);
        setIsLoading(false);
      })
      .catch((error) => {
        // ignore the error if it's caused by `controller.abort`
        if (error.name !== "AbortError") {
          throw error;
        }
      });

    requestAbortController.current = controller;
  };

  React.useEffect(() => {
    fetchHighlightedDays(dayjs());
    // abort request on unmount
    return () => requestAbortController.current?.abort();
  }, []);

  const handleMonthChange = (date: Dayjs) => {
    if (requestAbortController.current) {
      // make sure that you are aborting useless requests
      // because it is possible to switch between months pretty quickly
      requestAbortController.current.abort();
    }

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
        onChange={(newValue) => {
          setValue(newValue);
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
