import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param sheetName - Name of the sheet (optional)
 */
export const exportToExcel = (data: unknown[], filename: string, sheetName: string = 'Sheet1') => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Export multiple sheets to one Excel file
 * @param sheets - Array of {data, sheetName} objects
 * @param filename - Name of the file (without extension)
 */
export const exportMultipleSheetsToExcel = (
  sheets: Array<{ data: unknown[]; sheetName: string }>,
  filename: string
) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Add each sheet
    sheets.forEach(({ data, sheetName }) => {
      const ws = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    
    // Generate Excel file and trigger download
    XLSX.writeFile(wb, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    return false;
  }
};

/**
 * Format date for Excel export
 */
export const formatDateForExcel = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Prepare coach KPI data for export
 */
export const prepareCoachKPIForExport = (kpis: Array<{
  coachId: string;
  coachName: string;
  kpiScore: number;
  performanceLevel: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  isRisky: boolean;
  riskFactors: string[];
}>) => {
  return kpis.map(kpi => ({
    'Koç ID': kpi.coachId,
    'Koç Adı': kpi.coachName,
    'KPI Skoru': kpi.kpiScore,
    'Performans Seviyesi': kpi.performanceLevel,
    'Güçlü Yönler': kpi.strengths.join(', '),
    'Gelişim Alanları': kpi.weaknesses.join(', '),
    'AI Önerileri': kpi.recommendations.join(', '),
    'Riskli Mi?': kpi.isRisky ? 'Evet' : 'Hayır',
    'Risk Faktörleri': kpi.riskFactors.join(', ')
  }));
};

/**
 * Prepare common issues data for export
 */
export const prepareCommonIssuesForExport = (issues: Array<{
  category: string;
  count: number;
  percentage: number;
  examples: string[];
}>) => {
  return issues.map(issue => ({
    'Sorun Kategorisi': issue.category,
    'Şikayet Sayısı': issue.count,
    'Yüzde': `%${issue.percentage}`,
    'Örnek Anahtar Kelimeler': issue.examples.join(', ')
  }));
};

/**
 * Prepare booking data for export
 */
export const prepareBookingsForExport = (bookings: Array<{
  id: string;
  coach_name?: string;
  user_name?: string;
  date: string;
  time: string;
  status: string;
  notes?: string;
}>) => {
  return bookings.map(booking => ({
    'Rezervasyon ID': booking.id,
    'Koç': booking.coach_name || 'N/A',
    'Kullanıcı': booking.user_name || 'N/A',
    'Tarih': booking.date,
    'Saat': booking.time,
    'Durum': booking.status,
    'Notlar': booking.notes || ''
  }));
};

/**
 * Prepare review data for export
 */
export const prepareReviewsForExport = (reviews: Array<{
  id: string;
  coach_name?: string;
  user_name?: string;
  rating: number;
  comment?: string;
  created_at: string;
}>) => {
  return reviews.map(review => ({
    'Değerlendirme ID': review.id,
    'Koç': review.coach_name || 'N/A',
    'Kullanıcı': review.user_name || 'N/A',
    'Puan': review.rating,
    'Yorum': review.comment || '',
    'Tarih': formatDateForExcel(review.created_at)
  }));
};

/**
 * Prepare user data for export
 */
export const prepareUsersForExport = (users: Array<{
  id: string;
  email: string;
  full_name?: string;
  user_type: string;
  created_at: string;
  badge_type?: string;
}>) => {
  return users.map(user => ({
    'Kullanıcı ID': user.id,
    'E-posta': user.email,
    'Ad Soyad': user.full_name || 'N/A',
    'Kullanıcı Tipi': user.user_type,
    'Rozet': user.badge_type || 'Yok',
    'Kayıt Tarihi': formatDateForExcel(user.created_at)
  }));
};

/**
 * Prepare revenue data for export
 */
export const prepareRevenueForExport = (revenue: Array<{
  coach_name: string;
  total_sessions: number;
  total_revenue: number;
  average_revenue: number;
}>) => {
  return revenue.map(item => ({
    'Koç Adı': item.coach_name,
    'Toplam Seans': item.total_sessions,
    'Toplam Gelir (₺)': item.total_revenue.toFixed(2),
    'Ortalama Gelir (₺)': item.average_revenue.toFixed(2)
  }));
};