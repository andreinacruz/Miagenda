const MONTHS_SHORT = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

const MONTHS_LONG = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const WEEKDAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const WEEKDAYS_INITIAL = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
const WEEKDAYS_LONG = [
  'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado',
];

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayKey(): string {
  return toDateKey(new Date());
}

export function addDaysToKey(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return toDateKey(d);
}

export function offsetFromToday(days: number): string {
  return addDaysToKey(getTodayKey(), days);
}

export function formatShortDate(dateStr: string): string {
  const today = getTodayKey();
  const tomorrow = addDaysToKey(today, 1);
  const yesterday = addDaysToKey(today, -1);

  if (dateStr === today) return 'Hoy';
  if (dateStr === tomorrow) return 'Mañana';
  if (dateStr === yesterday) return 'Ayer';

  const d = parseLocalDate(dateStr);
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function formatDayHeader(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  const weekday = WEEKDAYS_LONG[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_LONG[d.getMonth()];
  return `${weekday}, ${day} de ${month}`;
}

export function formatCompactDay(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return `${WEEKDAYS_SHORT[d.getDay()]} ${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

export function getWeekDates(anchorDateStr: string): string[] {
  const anchor = parseLocalDate(anchorDateStr);
  const dayOfWeek = anchor.getDay(); // 0=Dom, 1=Lun
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() + diffToMonday);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateKey(d);
  });
}

export function getWeekdayInitial(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return WEEKDAYS_INITIAL[d.getDay()];
}

export function getWeekdayShort(dateStr: string): string {
  const d = parseLocalDate(dateStr);
  return WEEKDAYS_SHORT[d.getDay()];
}

export function getDayNumber(dateStr: string): number {
  return parseLocalDate(dateStr).getDate();
}

export function formatWeekRange(weekDates: string[]): string {
  if (weekDates.length === 0) return '';
  const start = parseLocalDate(weekDates[0]);
  const end = parseLocalDate(weekDates[weekDates.length - 1]);
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.getDate()} de ${MONTHS_LONG[end.getMonth()]}`;
  }
  return `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;
}

export function isOverdue(dateStr: string): boolean {
  return dateStr < getTodayKey();
}
