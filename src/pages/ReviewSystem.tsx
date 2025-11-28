import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { getCoaches } from '@/data/mockData';
import { toast } from 'sonner';

interface Booking {
  id: string;
  coachId: string;
  coachName: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  time: string;
  notes: string;
  meetingUrl: string;
  status: string;
  createdAt: string;
}

export default function ReviewSystem() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get booking details from localStorage
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]') as Booking[];
  const booking = bookings.find((b: Booking) => b.id === bookingId);
  
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <p className="text-xl text-gray-600">Randevu bulunamadı</p>
            <Button
              className="mt-4 bg-blue-900 hover:bg-blue-800"
              onClick={() => navigate('/my-bookings')}
            >
              Randevularıma Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const coaches = getCoaches();
  const coach = coaches.find((c) => c.id === booking.coachId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Lütfen bir puan verin');
      return;
    }

    if (!review.trim()) {
      toast.error('Lütfen bir yorum yazın');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Save review to localStorage
      const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
      const newReview = {
        id: Date.now().toString(),
        bookingId: booking.id,
        coachId: booking.coachId,
        coachName: booking.coachName,
        clientName: booking.clientName,
        rating,
        review,
        createdAt: new Date().toISOString(),
        verified: true,
      };
      reviews.push(newReview);
      localStorage.setItem('reviews', JSON.stringify(reviews));

      // Update booking status
      const updatedBookings = bookings.map((b: Booking) =>
        b.id === bookingId ? { ...b, status: 'completed', reviewed: true } : b
      );
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));

      setIsSubmitting(false);
      toast.success('Değerlendirmeniz kaydedildi!', {
        description: 'Geri bildiriminiz için teşekkür ederiz.',
      });

      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    }, 1500);
  };

  const ratingLabels = [
    '',
    'Çok Kötü',
    'Kötü',
    'Orta',
    'İyi',
    'Mükemmel',
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Koçunuzu Değerlendirin</h1>
          <p className="text-gray-600">Deneyiminizi paylaşın ve diğer kullanıcılara yardımcı olun</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              {coach && (
                <>
                  <img
                    src={coach.photo}
                    alt={coach.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-xl text-blue-900">{booking.coachName}</CardTitle>
                    <CardDescription>
                      Seans Tarihi: {new Date(booking.date).toLocaleDateString('tr-TR')} • {booking.time}
                    </CardDescription>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Star Rating */}
              <div>
                <Label className="text-base mb-3 block">Puanınız *</Label>
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {(rating > 0 || hoveredRating > 0) && (
                  <p className="text-sm font-medium text-blue-900">
                    {ratingLabels[hoveredRating || rating]}
                  </p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <Label htmlFor="review" className="text-base mb-2 block">
                  Yorumunuz *
                </Label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Koçunuz ile olan deneyiminizi detaylı bir şekilde anlatın..."
                  rows={6}
                  className="resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  En az 20 karakter ({review.length}/20)
                </p>
              </div>

              {/* Review Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-900 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Değerlendirme İpuçları</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Koçunuzun profesyonelliği hakkında yazın</li>
                      <li>• Seansın size sağladığı faydaları belirtin</li>
                      <li>• İletişim ve empati becerileri hakkında yorum yapın</li>
                      <li>• Diğer kullanıcılara yardımcı olacak detaylar ekleyin</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verified Badge Info */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Yorumunuz "Doğrulanmış Seans" rozeti ile yayınlanacaktır</span>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 h-12 text-lg"
                disabled={isSubmitting || rating === 0 || review.length < 20}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Değerlendirmeyi Gönder
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-gray-500">
                Değerlendirmenizi göndererek{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Topluluk Kuralları
                </a>
                'nı kabul etmiş olursunuz.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}