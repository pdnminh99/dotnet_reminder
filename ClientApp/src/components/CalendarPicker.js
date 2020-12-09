import React, { useEffect, useState } from 'react'
import {
  Calendar,
  DayOfWeek,
  DateRangeType,
  DefaultButton,
  addDays,
  getDateRangeArray,
} from '@fluentui/react'

// export interface ICalendarInlineExampleProps {
//   isMonthPickerVisible?: boolean;
//   dateRangeType: DateRangeType;
//   autoNavigateOnSelection: boolean;
//   showGoToToday: boolean;
//   showNavigateButtons?: boolean;
//   highlightCurrentMonth?: boolean;
//   highlightSelectedMonth?: boolean;
//   isDayPickerVisible?: boolean;
//   showMonthPickerAsOverlay?: boolean;
//   showWeekNumbers?: boolean;
//   minDate?: Date;
//   maxDate?: Date;
//   restrictedDates?: Date[];
//   showSixWeeksByDefault?: boolean;
//   workWeekDays?: DayOfWeek[];
//   firstDayOfWeek?: DayOfWeek;
// }

const dayPickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  goToToday: 'Go to today',
  weekNumberFormatString: 'Week number {0}',
  prevMonthAriaLabel: 'Previous month',
  nextMonthAriaLabel: 'Next month',
  prevYearAriaLabel: 'Previous year',
  nextYearAriaLabel: 'Next year',
  prevYearRangeAriaLabel: 'Previous year range',
  nextYearRangeAriaLabel: 'Next year range',
  closeButtonAriaLabel: 'Close',
  monthPickerHeaderAriaLabel: '{0}, select to change the year',
  yearPickerHeaderAriaLabel: '{0}, select to change the month',
}
const divStyle = {
  height: '100%',
}

export const CalendarPicker = props => {
  function epochToLocalDate(epochValue) {
    let date = new Date()
    if (!!epochValue) date.setUTCMilliseconds(epochValue)
    return date
  }

  const [selectedDate, setSelectedDate] = useState(
    epochToLocalDate(props.selectedDate),
  )

  function onSelectDate(date) {
    props.onPick(date)
    setSelectedDate(date)
  }

  function onDismiss() {
    return selectedDate
  }

  return (
    <div style={divStyle}>
      <Calendar
        // eslint-disable-next-line react/jsx-no-bind
        onSelectDate={onSelectDate}
        // eslint-disable-next-line react/jsx-no-bind
        onDismiss={onDismiss}
        isMonthPickerVisible
        value={selectedDate}
        firstDayOfWeek={DayOfWeek.Sunday}
        strings={dayPickerStrings}
        highlightCurrentMonth
        highlightSelectedMonth
        isDayPickerVisible
        showGoToToday={false}
        showMonthPickerAsOverlay
        minDate={props.minDate}
        maxDate={props.maxDate}
      />
    </div>
  )
}
