"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date?: DateRange;
  onDateChange?: (dateRange?: DateRange) => void;
}

export function DatePickerWithRange({
  className,
  date,
  onDateChange,
}: DatePickerWithRangeProps) {
  const [internalDate, setInternalDate] = React.useState<DateRange | undefined>(date || {
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  React.useEffect(() => {
    if (date) {
        setInternalDate(date);
    }
  }, [date]);

  const handleSelect = (selectedDateRange?: DateRange) => {
    setInternalDate(selectedDateRange);
    if (onDateChange) {
        onDateChange(selectedDateRange);
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !internalDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {internalDate?.from ? (
              internalDate.to ? (
                <>
                  {format(internalDate.from, "LLL dd, y")} -{" "}
                  {format(internalDate.to, "LLL dd, y")}
                </>
              ) : (
                format(internalDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={internalDate?.from}
            selected={internalDate}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
