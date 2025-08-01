import { format } from 'date-fns';

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
}

export const generateICSFile = (event: CalendarEvent): string => {
  const formatDate = (date: Date) => format(date, 'yyyyMMdd\'T\'HHmmss');
  
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dexabrain//Neuro Reset Awareness Seminar//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@dexabrain.com`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.startDate)}`,
    `DTEND:${formatDate(event.endDate)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

export const generateGoogleCalendarLink = (event: CalendarEvent): string => {
  const formatDate = (date: Date) => format(date, 'yyyyMMdd\'T\'HHmmss');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(event.startDate)}/${formatDate(event.endDate)}`,
    details: event.description,
    location: event.location,
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export const downloadICSFile = (icsContent: string, filename: string) => {
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}; 