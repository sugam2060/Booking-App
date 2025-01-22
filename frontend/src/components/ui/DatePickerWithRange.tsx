"use client";

import * as React from "react";
import { addYears, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement>{
    handleInitialDate: (startDate: Date | undefined) => void;
    handleEndDate: (endDate: Date | undefined) => void;
    setDate : (dateRange: DateRange | undefined) => void
    date: DateRange | undefined
}

export function DatePickerWithRange({
  className,
  handleInitialDate,
  handleEndDate,
  setDate,
  date
}: DatePickerWithRangeProps) {
  

  // Define the range: 1 year from today
  const today = new Date();
  const maxDate = addYears(today, 1);


  const handleDateChange = (newDate:DateRange | undefined) => {
        setDate(newDate);
        handleInitialDate(newDate?.from);
        handleEndDate(newDate?.to);
  }

  return (
    <div className={cn("col-span-1 sm:col-span-2 lg:col-span-1",className)}>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn("w-full justify-start text-left font-normal overflow-y-hidden custom-scrollbar")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "MMM dd, yyyy")} - {format(date.to, "MMM dd, yyyy")}
                  </>
                ) : (
                  format(date.from, "MMM dd, yyyy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
              disabled={{
                before: today,
                after: maxDate,
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
  );
}
