import {userLanguage} from '../network/Constant'

export const formattedDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        console.error('Invalid time value:', date);
        return 'Invalid date'; 
    }
    
    return new Intl.DateTimeFormat(userLanguage, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(parsedDate);
};