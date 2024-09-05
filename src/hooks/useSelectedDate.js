import { useState } from 'react';

const useSelectedDate = () => {
    const [selectedDate, setSelectedDate] = useState('');
    return [selectedDate, setSelectedDate];
};

export default useSelectedDate;
