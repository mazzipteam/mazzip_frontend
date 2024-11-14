import React, { useState, useMemo } from 'react';
import './MyReservationPage.css';

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
    // 여기에 예약 제출 로직 추가
    console.log('예약 정보:', {
      ...formData,
      date: selectedDate,
      time: selectedTime
    });
  };

  // 예약 가능 인원 옵션 생성
  const peopleOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  // 선택된 날짜 포맷팅
  const formatDate = (date) => {
    if (!date) return '';
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(date).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };


  // 고정된 예약 불가능 시간
  const bookedTimes = useMemo(() => {
    return {
      morning: ['09:00', '10:30', '11:30'],
      afternoon: ['17:30', '18:00', '19:00']
    };
  }, []);

  // 시간대 데이터 생성
  const timeSlots = useMemo(() => {
    const morning = [];
    const afternoon = [];
    
    // 오전 9시부터 2시까지
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

    // 오후 5시부터 8시까지
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

  // 달력 관련 함수들...
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
      <div className="time-period">{period}</div>
      <div className="time-slots-grid">
        {slots.map((slot, index) => (
          <div
            key={index}
            className={`time-slot 
              ${slot.isBooked ? 'booked-time' : ''} 
              ${selectedTime === slot.time ? 'selected-time' : ''}`}
            onClick={() => handleTimeClick(slot)}
          >
            {slot.time}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="reservation-page">
      <h2 className="page-title">예약신청</h2>
      
      <div className="sections-container">
      <div className="calendar-section">
        <div className="page-subtitle">예약날짜 선택</div>
        
        <div className="month-navigator">
          <button onClick={prevMonth} className="month-button">&lt;</button>
          <span className="current-month">{getMonthString()}</span>
          <button onClick={nextMonth} className="month-button">&gt;</button>
        </div>

        <div className="calendar-container">
          {days.map((day, index) => (
            <div 
              key={`day-${index}`} 
              className={`calendar-cell header-cell ${index === 0 ? 'sunday' : ''} ${index === 6 ? 'saturday' : ''}`}
            >
              {day}
            </div>
          ))}

          {getDatesArray().map((date, index) => (
            <div
              key={`date-${index}`}
              className={`calendar-cell 
                ${!date ? 'empty-cell' : ''} 
                ${date && isBooked(date) ? 'booked-cell' : ''} 
                ${date === selectedDate ? 'selected-cell' : ''}`}
              onClick={() => handleDateClick(date)}
            >
              {date}
            </div>
          ))}
        </div>

        <div className="legend">
          <div className="legend-item">
            <span className="legend-color available"></span>
            <span className="legend-text">예약 가능한 날짜</span>
          </div>
          <div className="legend-item">
            <span className="legend-color booked"></span>
            <span className="legend-text">이미 예약됨</span>
          </div>
        </div>
      </div>

      <div className="time-selection-section">
        <div className="page-subtitle">예약시간 선택</div>
        
        {/* 오전 시간대 */}
        <TimeSlotGrid slots={timeSlots.morning} period="오전" />
        
        {/* Break Time */}
        <div className="break-time">BREAK TIME</div>
        
        {/* 오후 시간대 */}
        <TimeSlotGrid slots={timeSlots.afternoon} period="오후" />
      </div>
    

      <div className="reservation-details-section">
        <div className="page-subtitle">예약 세부내용</div>
        
        <form onSubmit={handleSubmit} className="reservation-form">
          <div className="form-group">
            <label>예약자 이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>예약자 연락처</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="form-input"
              placeholder="'-' 없이 입력해주세요"
            />
          </div>

          <div className="form-group">
            <label>예약자 수</label>
            <div className="select-wrapper">
              <select
                name="people"
                value={formData.people}
                onChange={handleInputChange}
                className="form-select"
              >
                {peopleOptions.map(num => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </select>
            </div>
            <div className="form-hint">※ 방문하시는 인원이 정확해야 합니다.</div>
          </div>

          <div className="form-group">
            <label>예약 내용</label>
            <div className="reservation-datetime">
              <div className="datetime-display">
                {formatDate(selectedDate)}
              </div>
              <div className="datetime-display">
                {selectedTime ? `오후 ${selectedTime}` : ''}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>기타 요청사항</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="form-textarea"
              rows="4"
            />
          </div>

          <button type="submit" className="submit-button">
            예약하기
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default MyReservationPage;