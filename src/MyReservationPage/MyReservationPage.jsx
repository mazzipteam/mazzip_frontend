import React, { useState, useMemo } from 'react';
import styles from './MyReservationPage.module.css';

const MyReservationPage = () => {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10));
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    people: '1',
    note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('예약 정보:', {
      ...formData,
      date: selectedDate,
      time: selectedTime
    });
  };

  const peopleOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  const formatDate = (date) => {
    if (!date) return '';
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(date).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  const bookedTimes = useMemo(() => ({
    morning: ['09:00', '10:30', '11:30'],
    afternoon: ['17:30', '18:00', '19:00']
  }), []);

  const timeSlots = useMemo(() => {
    const morning = [];
    const afternoon = [];
    
    for (let hour = 9; hour <= 14; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === 14 && min === 30) break;
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        morning.push({
          time: timeStr,
          isBooked: bookedTimes.morning.includes(timeStr)
        });
      }
    }

    for (let hour = 17; hour <= 20; hour++) {
      for (let min = 0; min < 60; min += 30) {
        if (hour === 20 && min === 30) break;
        const timeStr = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        afternoon.push({
          time: timeStr,
          isBooked: bookedTimes.afternoon.includes(timeStr)
        });
      }
    }

    return { morning, afternoon };
  }, [bookedTimes]);

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const getDatesArray = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const dates = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      dates.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      dates.push(i);
    }

    return dates;
  };

  const bookedDates = [8, 15, 22, 29];
  const isBooked = (day) => bookedDates.includes(day);

  const handleDateClick = (date) => {
    if (date && !isBooked(date)) {
      setSelectedDate(date === selectedDate ? null : date);
    }
  };

  const handleTimeClick = (time) => {
    if (!time.isBooked) {
      setSelectedTime(time.time === selectedTime ? null : time.time);
    }
  };

  const getMonthString = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}.${month}`;
  };

  const TimeSlotGrid = ({ slots, period }) => (
    <>
      <div className={styles.timePeriod}>{period}</div>
      <div className={styles.timeSlotsGrid}>
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`${styles.timeSlot} 
              ${slot.isBooked ? styles.bookedTime : ''} 
              ${selectedTime === slot.time ? styles.selectedTime : ''}`}
            onClick={() => handleTimeClick(slot)}
          >
            {slot.time}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className={styles.reservationPage}>
      <h2 className={styles.pageTitle}>예약신청</h2>
      
      <div className={styles.sectionsContainer}>
      <div className={styles.calendarSection}>
        <div className={styles.pageSubtitle}>예약날짜 선택</div>
        
        <div className={styles.monthNavigator}>
          <button onClick={prevMonth} className={styles.monthButton}>&lt;</button>
          <span className={styles.currentMonth}>{getMonthString()}</span>
          <button onClick={nextMonth} className={styles.monthButton}>&gt;</button>
        </div>

        <div className={styles.calendarContainer}>
          {days.map((day, index) => (
            <div 
              key={`day-${index}`} 
              className={`${styles.calendarCell} ${styles.headerCell} ${index === 0 ? styles.sunday : ''} ${index === 6 ? styles.saturday : ''}`}
            >
              {day}
            </div>
          ))}

          {getDatesArray().map((date, index) => (
            <div
              key={`date-${index}`}
              className={`${styles.calendarCell} 
                ${!date ? styles.emptyCell : ''} 
                ${date && isBooked(date) ? styles.bookedCell : ''} 
                ${date === selectedDate ? styles.selectedCell : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date}
            </div>
          ))}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.available}`}></span>
            <span className={styles.legendText}>예약 가능한 날짜</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendColor} ${styles.booked}`}></span>
            <span className={styles.legendText}>이미 예약됨</span>
          </div>
        </div>
      </div>

      <div className={styles.timeSelectionSection}>
        <div className={styles.pageSubtitle}>예약시간 선택</div>
        
        <TimeSlotGrid slots={timeSlots.morning} period="오전" />
        
        <div className={styles.breakTime}>BREAK TIME</div>
        
        <TimeSlotGrid slots={timeSlots.afternoon} period="오후" />
      </div>
    

      <div className={styles.reservationDetailsSection}>
        <div className={styles.pageSubtitle}>예약 세부내용</div>
        
        <form onSubmit={handleSubmit} className={styles.reservationForm}>
          <div className={styles.formGroup}>
            <label>예약자 이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label>예약자 연락처</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className={styles.formInput}
              placeholder="'-' 없이 입력해주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label>예약자 수</label>
            <div className={styles.selectWrapper}>
              <select
                name="people"
                value={formData.people}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                {peopleOptions.map(num => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.formHint}>※ 방문하시는 인원이 정확해야 합니다.</div>
          </div>

          <div className={styles.formGroup}>
  <label>예약 내용</label>
  <div className={styles.reservationDatetime}>
    <div className={styles.datetimeDisplay}>
      {formatDate(selectedDate)}
    </div>
    <div className={styles.datetimeDisplay}>
      {selectedTime ? `오후 ${selectedTime}` : ''}
    </div>
  </div>
</div>

<div className={styles.formGroup}>
  <label>기타 요청사항</label>
  <textarea
    name="note"
    value={formData.note}
    onChange={handleInputChange}
    className={styles.formTextarea}
    rows="4"
  />
</div>

<button type="submit" className={styles.submitButton}>
  예약하기
</button>
</form>
</div>
</div>
</div>
);
};

export default MyReservationPage;
