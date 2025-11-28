import { Invoice, invoiceService } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InvoiceGeneratorProps {
  invoice: Invoice;
  userName: string;
  userEmail: string;
}

export default function InvoiceGenerator({ invoice, userName, userEmail }: InvoiceGeneratorProps) {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const getNavText = (tr: string, en: string, fr: string) => {
    switch (language) {
      case 'tr': return tr;
      case 'en': return en;
      case 'fr': return fr;
      default: return tr;
    }
  };

  const downloadInvoice = async () => {
    setIsGenerating(true);
    try {
      console.log('[InvoiceGenerator] 📄 Starting PDF generation for invoice:', invoice.id);
      
      // Call the edge function to generate PDF
      const result = await invoiceService.generatePDF(invoice.id);
      
      if (!result.success || !result.html) {
        console.error('[InvoiceGenerator] ❌ PDF generation failed:', result.error);
        toast.error(getNavText(
          'Fatura oluşturulamadı. Lütfen tekrar deneyin.',
          'Failed to generate invoice. Please try again.',
          'Échec de la génération de la facture. Veuillez réessayer.'
        ));
        return;
      }

      console.log('[InvoiceGenerator] ✅ PDF HTML received, creating download...');

      // Create blob and download
      const blob = new Blob([result.html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Fatura-${invoice.invoice_number}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log('[InvoiceGenerator] ✅ Download initiated successfully');
      toast.success(getNavText(
        'Fatura başarıyla indirildi!',
        'Invoice downloaded successfully!',
        'Facture téléchargée avec succès!'
      ));
    } catch (error) {
      console.error('[InvoiceGenerator] 💥 Exception during PDF generation:', error);
      toast.error(getNavText(
        'Bir hata oluştu. Lütfen tekrar deneyin.',
        'An error occurred. Please try again.',
        'Une erreur s\'est produite. Veuillez réessayer.'
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const sendInvoiceEmail = async () => {
    setIsSendingEmail(true);
    try {
      console.log('[InvoiceGenerator] 📧 Sending invoice email for:', invoice.id);
      
      const result = await invoiceService.sendEmail(invoice.id);
      
      if (!result.success) {
        console.error('[InvoiceGenerator] ❌ Email sending failed:', result.error);
        toast.error(getNavText(
          'Email gönderilemedi. Lütfen tekrar deneyin.',
          'Failed to send email. Please try again.',
          'Échec de l\'envoi de l\'email. Veuillez réessayer.'
        ));
        return;
      }

      console.log('[InvoiceGenerator] ✅ Email sent successfully');
      toast.success(getNavText(
        `Fatura ${userEmail} adresine gönderildi!`,
        `Invoice sent to ${userEmail}!`,
        `Facture envoyée à ${userEmail}!`
      ));
    } catch (error) {
      console.error('[InvoiceGenerator] 💥 Exception during email sending:', error);
      toast.error(getNavText(
        'Bir hata oluştu. Lütfen tekrar deneyin.',
        'An error occurred. Please try again.',
        'Une erreur s\'est produite. Veuillez réessayer.'
      ));
    } finally {
      setIsSendingEmail(false);
    }
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

        <div className="flex gap-2">
          <Button 
            onClick={downloadInvoice} 
            className="flex-1" 
            variant="outline"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {getNavText('Oluşturuluyor...', 'Generating...', 'Génération...')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {getNavText('İndir', 'Download', 'Télécharger')}
              </>
            )}
          </Button>

          <Button 
            onClick={sendInvoiceEmail} 
            className="flex-1" 
            variant="default"
            disabled={isSendingEmail}
          >
            {isSendingEmail ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {getNavText('Gönderiliyor...', 'Sending...', 'Envoi...')}
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                {getNavText('Email Gönder', 'Send Email', 'Envoyer Email')}
              </>
            )}
          </Button>
        </div>

        {invoice.invoice_sent && invoice.invoice_sent_at && (
          <p className="text-xs text-gray-500 text-center">
            {getNavText(
              `Email gönderildi: ${new Date(invoice.invoice_sent_at).toLocaleString('tr-TR')}`,
              `Email sent: ${new Date(invoice.invoice_sent_at).toLocaleString('en-US')}`,
              `Email envoyé: ${new Date(invoice.invoice_sent_at).toLocaleString('fr-FR')}`
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
}