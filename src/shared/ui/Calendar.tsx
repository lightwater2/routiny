import { forwardRef, type HTMLAttributes, useState, useMemo } from 'react';

interface CalendarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: Date;
  onChange?: (date: Date) => void;
  year?: number;
  month?: number;
  onMonthChange?: (year: number, month: number) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      value,
      onChange,
      year: controlledYear,
      month: controlledMonth,
      onMonthChange,
      className = '',
      ...props
    },
    ref
  ) => {
    const today = new Date();
    const [internalYear, setInternalYear] = useState(controlledYear ?? today.getFullYear());
    const [internalMonth, setInternalMonth] = useState(controlledMonth ?? today.getMonth() + 1);

    const year = controlledYear ?? internalYear;
    const month = controlledMonth ?? internalMonth;

    const handleMonthChange = (newYear: number, newMonth: number) => {
      if (newMonth < 1) {
        newMonth = 12;
        newYear -= 1;
      } else if (newMonth > 12) {
        newMonth = 1;
        newYear += 1;
      }

      if (onMonthChange) {
        onMonthChange(newYear, newMonth);
      } else {
        setInternalYear(newYear);
        setInternalMonth(newMonth);
      }
    };

    const calendarDays = useMemo(() => {
      const firstDay = new Date(year, month - 1, 1);
      const lastDay = new Date(year, month, 0);
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay();

      const days: (number | null)[] = [];

      // Add empty slots for days before the first day of the month
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push(null);
      }

      // Add days of the month
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    }, [year, month]);

    const isSelected = (day: number) => {
      if (!value) return false;
      return (
        value.getFullYear() === year &&
        value.getMonth() + 1 === month &&
        value.getDate() === day
      );
    };

    const handleDayClick = (day: number) => {
      if (onChange) {
        onChange(new Date(year, month - 1, day));
      }
    };

    return (
      <div
        ref={ref}
        className={`
          bg-white
          flex flex-col gap-[16px]
          w-full
          ${className}
        `}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[23px]">
          <div className="flex items-center">
            <span className="text-[17px] leading-[25.5px] font-semibold text-[#333D48]">
              {year}년 {month}월
            </span>
          </div>
          <div className="flex items-center gap-[9px]">
            <button
              type="button"
              onClick={() => handleMonthChange(year, month - 1)}
              className="w-[30px] h-[30px] flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M12 15L7 10L12 5"
                  stroke="#333D48"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleMonthChange(year, month + 1)}
              className="w-[30px] h-[30px] flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M8 5L13 10L8 15"
                  stroke="#333D48"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex flex-col gap-[5px] px-[25px]">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-0">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[13px] leading-[19.5px] font-medium text-[#B0B8C1]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-0">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-[43px]"
              >
                {day !== null && (
                  <button
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`
                      w-[36px] h-[36px]
                      flex items-center justify-center
                      text-[20px] leading-[29px] font-medium
                      rounded-full
                      transition-colors
                      ${
                        isSelected(day)
                          ? 'bg-[#3183F6] text-white'
                          : 'text-[#333D48] hover:bg-[#F2F4F6]'
                      }
                    `}
                  >
                    {day}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

Calendar.displayName = 'Calendar';

export default Calendar;
