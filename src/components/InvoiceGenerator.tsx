import { Invoice } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText } from 'lucide-react';

interface InvoiceGeneratorProps {
  invoice: Invoice;
  userName: string;
  userEmail: string;
}

export default function InvoiceGenerator({ invoice, userName, userEmail }: InvoiceGeneratorProps) {
  const { language } = useLanguage();

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const downloadInvoice = () => {
    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Fatura ${invoice.invoice_number}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .company { font-size: 24px; font-weight: bold; color: #2563eb; }
          .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-details, .customer-details { flex: 1; }
          .invoice-details h3, .customer-details h3 { margin-bottom: 10px; color: #333; }
          table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f8f9fa; font-weight: bold; }
          .total-row { font-weight: bold; font-size: 18px; background-color: #f8f9fa; }
          .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company">Kariyeer</div>
          <p>Profesyonel Kariyer Gelişim Platformu</p>
        </div>

        <div class="invoice-info">
          <div class="invoice-details">
            <h3>Fatura Bilgileri</h3>
            <p><strong>Fatura No:</strong> ${invoice.invoice_number}</p>
            <p><strong>Tarih:</strong> ${new Date(invoice.invoice_date).toLocaleDateString('tr-TR')}</p>
            <p><strong>Durum:</strong> ${invoice.status === 'paid' ? 'Ödendi' : 'Beklemede'}</p>
          </div>

          <div class="customer-details">
            <h3>Müşteri Bilgileri</h3>
            <p><strong>Ad Soyad:</strong> ${userName}</p>
            <p><strong>E-posta:</strong> ${userEmail}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Açıklama</th>
              <th>Miktar</th>
              <th>Para Birimi</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Doğrulama Rozeti Aboneliği</td>
              <td>${(invoice.amount || 0).toFixed(2)}</td>
              <td>${invoice.currency || 'TRY'}</td>
            </tr>
            <tr>
              <td>KDV (%18)</td>
              <td>${(invoice.tax_amount || 0).toFixed(2)}</td>
              <td>${invoice.currency || 'TRY'}</td>
            </tr>
            <tr class="total-row">
              <td>TOPLAM</td>
              <td>${(invoice.total_amount || 0).toFixed(2)}</td>
              <td>${invoice.currency || 'TRY'}</td>
            </tr>
          </tbody>
        </table>

        <div class="footer">
          <p>Bu fatura elektronik olarak oluşturulmuştur.</p>
          <p>Kariyeer © ${new Date().getFullYear()} - Tüm hakları saklıdır.</p>
        </div>
      </body>
      </html>
    `;

    // Create blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fatura-${invoice.invoice_number}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {getNavText('Fatura', 'Invoice', 'Facture')} {invoice.invoice_number}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">
              {getNavText('Fatura Tarihi', 'Invoice Date', 'Date de facturation')}
            </p>
            <p className="font-medium">{new Date(invoice.invoice_date).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getNavText('Durum', 'Status', 'Statut')}
            </p>
            <p className="font-medium">
              {invoice.status === 'paid' 
                ? getNavText('Ödendi', 'Paid', 'Payé')
                : getNavText('Beklemede', 'Pending', 'En attente')}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getNavText('Tutar', 'Amount', 'Montant')}
            </p>
            <p className="font-medium">{(invoice.amount || 0).toFixed(2)} {invoice.currency}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {getNavText('KDV', 'Tax', 'TVA')}
            </p>
            <p className="font-medium">{(invoice.tax_amount || 0).toFixed(2)} {invoice.currency}</p>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">
              {getNavText('Toplam', 'Total', 'Total')}
            </span>
            <span className="text-lg font-bold">
              {(invoice.total_amount || 0).toFixed(2)} {invoice.currency}
            </span>
          </div>
        </div>

        <Button onClick={downloadInvoice} className="w-full" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          {getNavText('Faturayı İndir', 'Download Invoice', 'Télécharger la facture')}
        </Button>
      </CardContent>
    </Card>
  );
}