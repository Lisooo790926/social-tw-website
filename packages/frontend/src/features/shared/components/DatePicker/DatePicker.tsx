import { ReactComponent as Next } from '@/assets/svg/calendar-next.svg'
import { ReactComponent as Prev } from '@/assets/svg/calendar-prev.svg'
import { useState } from 'react'
import DatePickerLib, {
    ReactDatePickerCustomHeaderProps,
} from 'react-datepicker'
import { FaCalendarAlt } from 'react-icons/fa'

import 'react-datepicker/dist/react-datepicker.css'
import './CustomDatePicker.css'

export default function DatePicker() {
    const [startDate, setStartDate] = useState(undefined)
    const [endDate, setEndDate] = useState(undefined)
    const [isDateSelected, setIsDateSelected] = useState(false)
    const onChange = (dates: any) => {
        const [start, end] = dates
        setStartDate(start)
        setEndDate(end)
        setIsDateSelected(true)
    }
    return (
        <div className="date-picker-wrapper">
            <FaCalendarAlt
                className={`calendar-icon w-4 h-4 ${isDateSelected ? 'calendar-icon__selected' : ''}`}
            />
            <DatePickerLib
                selected={startDate}
                onChange={onChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                placeholderText="YYYY/MM/DD - YYYY/MM/DD"
                className={`custom-input ${isDateSelected ? 'custom-input__selected' : ''}`}
                renderCustomHeader={CustomHeader}
            />
        </div>
    )
}

function CustomHeader({
    date,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
    return (
        <div className="custom-header">
            <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="custom-prev-btn"
            >
                <Prev />
            </button>
            <span>
                {date.toLocaleString('default', { month: 'long' })}{' '}
                {date.getFullYear()}
            </span>
            <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="custom-next-btn"
            >
                <Next />
            </button>
        </div>
    )
}
