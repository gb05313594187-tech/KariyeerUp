import { Button } from '@/components/ui/button';
import { Calendar, Download, Mail } from 'lucide-react';
import { 
  openGoogleCalendar, 
  downloadICSFile, 
  openOutlookCalendar,
  createCalendarEventFromBooking 
} from '@/lib/calendarIntegration';
import { toast } from 'sonner';

interface CalendarIntegrationButtonsProps {
  coachName: string;
  clientName: string;
  date: string;
  time: string;
  duration?: number;
  meetingUrl?: string;
}

export default function CalendarIntegrationButtons({
  coachName,
  clientName,
  date,
  time,
  duration = 45,
  meetingUrl,
}: CalendarIntegrationButtonsProps) {
  const event = createCalendarEventFromBooking(
    coachName,
    clientName,
    date,
    time,
    duration,
    meetingUrl
  );

  const handleGoogleCalendar = () => {
    openGoogleCalendar(event);
    toast.success('Google Calendar açılıyor...', {
      description: 'Etkinliği takvime ekleyebilirsiniz',
    });
  };

  const handleAppleCalendar = () => {
    const filename = `koçluk-seansı-${date.split('T')[0]}.ics`;
    downloadICSFile(event, filename);
    toast.success('Takvim dosyası indirildi!', {
      description: 'Dosyayı açarak Apple Calendar veya Outlook\'a ekleyebilirsiniz',
    });
  };

  const handleOutlookCalendar = () => {
    openOutlookCalendar(event);
    toast.success('Outlook Calendar açılıyor...', {
      description: 'Etkinliği takvime ekleyebilirsiniz',
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-4 w-4 text-blue-900" />
        <span className="text-sm font-semibold text-gray-700">Takvime Ekle</span>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleGoogleCalendar}
          className="w-full justify-start"
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M16.9,16.9c-0.4,0.4-1,0.4-1.4,0L12,13.4l-3.5,3.5 c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4l3.5-3.5l-3.5-3.5c-0.4-0.4-0.4-1,0-1.4s1-0.4,1.4,0l3.5,3.5l3.5-3.5c0.4-0.4,1-0.4,1.4,0 s0.4,1,0,1.4L13.4,12l3.5,3.5C17.3,15.9,17.3,16.5,16.9,16.9z"
            />
          </svg>
          Google Calendar
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleAppleCalendar}
          className="w-full justify-start"
        >
          <Download className="h-4 w-4 mr-2" />
          Apple Calendar / Outlook
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleOutlookCalendar}
          className="w-full justify-start"
        >
          <Mail className="h-4 w-4 mr-2" />
          Outlook Web
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
        <p className="text-xs text-blue-900">
          <strong>💡 İpucu:</strong> Takvime eklediğinizde otomatik hatırlatmalar alacaksınız:
        </p>
        <ul className="text-xs text-blue-800 mt-1 space-y-0.5 ml-4">
          <li>• 1 gün önce</li>
          <li>• 1 saat önce</li>
          <li>• 15 dakika önce</li>
        </ul>
      </div>
    </div>
  );
}