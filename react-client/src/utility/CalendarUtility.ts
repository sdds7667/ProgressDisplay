class CalendarUtility {
    static getDaysInMonth(year?: number, month?: number): number {
        year = year || new Date().getFullYear() ;
        month = month || new Date().getMonth();
        return new Date(year, month + 1, 0).getDate();
    }
}
export {CalendarUtility};
