import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import InvoiceGenerator from '@/components/InvoiceGenerator';
import { ArrowLeft, CreditCard, FileText, Calendar } from 'lucide-react';

export default function SubscriptionHistory() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { subscriptions, payments, invoices } = useSubscription();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('subscriptionHistory')}</h1>
            <p className="text-gray-600 mt-1">{t('viewAllTransactions')}</p>
          </div>
        </div>

        <Tabs defaultValue="payments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              {t('payments')}
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="w-4 h-4 mr-2" />
              {t('invoices')}
            </TabsTrigger>
            <TabsTrigger value="subscriptions">
              <Calendar className="w-4 h-4 mr-2" />
              {t('subscriptions')}
            </TabsTrigger>
          </TabsList>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>{t('paymentHistory')}</CardTitle>
                <CardDescription>{t('allYourPayments')}</CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            payment.paymentStatus === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                            <CreditCard className={`w-6 h-6 ${
                              payment.paymentStatus === 'completed' ? 'text-green-600' : 'text-gray-600'
                            }`} />
                          </div>
                          <div>
                            <p className="font-semibold">{payment.amount.toFixed(2)} {payment.currency}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.paymentDate).toLocaleDateString()} - {payment.transactionId}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {t(payment.paymentMethod)}
                            </p>
                          </div>
                        </div>
                        <Badge variant={payment.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                          {t(payment.paymentStatus)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('noPaymentsYet')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <div className="space-y-4">
              {invoices.length > 0 ? (
                invoices.map((invoice) => (
                  <InvoiceGenerator
                    key={invoice.id}
                    invoice={invoice}
                    userName={user.fullName}
                    userEmail={user.email}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('noInvoicesYet')}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>{t('subscriptionHistory')}</CardTitle>
                <CardDescription>{t('allYourSubscriptions')}</CardDescription>
              </CardHeader>
              <CardContent>
                {subscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {subscriptions.map((subscription) => (
                      <div key={subscription.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${
                              subscription.badgeType === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'
                            } rounded-full flex items-center justify-center text-white font-bold`}>
                              {subscription.badgeType === 'blue' ? '✓' : '★'}
                            </div>
                            <div>
                              <p className="font-semibold">
                                {subscription.badgeType === 'blue' ? t('blueBadge') : t('goldBadge')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {subscription.price} {subscription.currency}/{t('month')}
                              </p>
                            </div>
                          </div>
                          <Badge variant={
                            subscription.status === 'active' ? 'default' :
                            subscription.status === 'cancelled' ? 'destructive' : 'secondary'
                          }>
                            {t(subscription.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">{t('startDate')}: </span>
                            <span className="font-medium">{new Date(subscription.startDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">{t('endDate')}: </span>
                            <span className="font-medium">{new Date(subscription.endDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">{t('noSubscriptionsYet')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}