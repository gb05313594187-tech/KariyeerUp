/**
 * Calendar Integration
 * Supports Google Calendar and Apple Calendar (.ics)
 */

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  meetingUrl?: string;
}

/**
 * Generate Google Calendar URL
 */
export function generateGoogleCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: `${event.description}\n\n${event.meetingUrl ? `Video Görüşme Linki: ${event.meetingUrl}` : ''}`,
    location: event.location,
    dates: `${formatDate(event.startTime)}/${formatDate(event.endTime)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate .ics file content for Apple Calendar / Outlook
 */
export function generateICSFile(event: CalendarEvent): string {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const escapeText = (text: string) => {
    return text.replace(/\n/g, '\\n').replace(/,/g, '\\,');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kariyeer//Coaching Session//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(event.startTime)}`,
    `DTEND:${formatDate(event.endTime)}`,
    `DTSTAMP:${formatDate(new Date())}`,
    `SUMMARY:${escapeText(event.title)}`,
    `DESCRIPTION:${escapeText(event.description)}${event.meetingUrl ? `\\n\\nVideo Görüşme: ${event.meetingUrl}` : ''}`,
    `LOCATION:${escapeText(event.location)}`,
    `STATUS:CONFIRMED`,
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Randevu 15 dakika sonra başlayacak',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Randevu 1 saat sonra başlayacak',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return icsContent;
}

/**
 * Download .ics file
 */
export function downloadICSFile(event: CalendarEvent, filename: string = 'coaching-session.ics'): void {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Open Google Calendar in new tab
 */
export function openGoogleCalendar(event: CalendarEvent): void {
  const url = generateGoogleCalendarUrl(event);
  window.open(url, '_blank');
}

/**
 * Generate Outlook Calendar URL
 */
export function generateOutlookCalendarUrl(event: CalendarEvent): string {
  const formatDate = (date: Date) => {
    return date.toISOString();
  };

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: `${event.description}\n\n${event.meetingUrl ? `Video Görüşme: ${event.meetingUrl}` : ''}`,
    location: event.location,
    startdt: formatDate(event.startTime),
    enddt: formatDate(event.endTime),
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Open Outlook Calendar in new tab
 */
export function openOutlookCalendar(event: CalendarEvent): void {
  const url = generateOutlookCalendarUrl(event);
  window.open(url, '_blank');
}

/**
 * Create calendar event from booking data
 */
export function createCalendarEventFromBooking(
  coachName: string,
  clientName: string,
  date: string,
  time: string,
  duration: number = 45,
  meetingUrl?: string
): CalendarEvent {
  // Parse date and time
  const [year, month, day] = date.split('T')[0].split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  
  const startTime = new Date(year, month - 1, day, hours, minutes);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  return {
    title: `Koçluk Seansı - ${coachName}`,
    description: `${coachName} ile koçluk seansı\n\nDanışan: ${clientName}\nSüre: ${duration} dakika`,
    location: meetingUrl ? 'Online Video Görüşme' : 'Belirtilmedi',
    startTime,
    endTime,
    meetingUrl,
  };
}

/**
 * Send reminder email (placeholder - would integrate with email service)
 */
export function scheduleReminderEmail(
  email: string,
  event: CalendarEvent,
  reminderMinutes: number = 60
): void {
  // This would integrate with your email service (SendGrid, AWS SES, etc.)
  console.log(`Reminder scheduled for ${email} at ${reminderMinutes} minutes before event`);
  console.log('Event:', event);
  
  // In production, you would call an API endpoint to schedule the email
  // Example:
  // fetch('/api/schedule-reminder', {
  //   method: 'POST',
  //   body: JSON.stringify({ email, event, reminderMinutes })
  // });
}

/**
 * Get reminder times in user's timezone
 */
export function getReminderTimes(startTime: Date): { oneDay: Date; oneHour: Date; fifteenMin: Date } {
  return {
    oneDay: new Date(startTime.getTime() - 24 * 60 * 60 * 1000),
    oneHour: new Date(startTime.getTime() - 60 * 60 * 1000),
    fifteenMin: new Date(startTime.getTime() - 15 * 60 * 1000),
  };
}