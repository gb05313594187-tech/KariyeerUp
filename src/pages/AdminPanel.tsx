// @ts-nocheck
/* eslint-disable */
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Activity, TrendingUp, Users, DollarSign, Star, 
    Brain, Target, ArrowUpRight, ArrowDownRight, 
    Filter, Download, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// SUPABASE BAĞLANTISI
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  
  // TÜM KPI VERİLERİ (Gerçek + Simülasyon)
  const [kpi, setKpi] = useState({
    overview: { sessions: 0, activeUsers: 0, activeCoaches: 0, gmv: 0, revenue: 0, nps: 72 },
    growth: { visitors: 12500, conversion: "4.2%", newCoaches: 12 },
    finance: { cac: 450, ltv: 3200, arpu: 850 },
    quality: { rating: 4.8, disputeRate: "1.2%" }
  });

  useEffect(() => {
    fetchRealData();
  }, []);

  const fetchRealData = async () => {
    try {
        // 1. GERÇEK VERİLERİ ÇEK (Bookings Tablosundan)
        const { data: bookings } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (bookings) {
            // Hesaplamalar
            const totalSessions = bookings.length;
            const completedSessions = bookings.filter(b => b.status === 'approved').length;
            const uniqueClients = new Set(bookings.map(b => b.client_email)).size;
            
            // Finansal Hesaplama (Ortalama 1500 TL seans ücreti varsayımıyla)
            const totalGMV = totalSessions * 1500; 
            const totalRevenue = totalGMV * 0.20; // %20 Komisyon (Take Rate)

            // State'i Güncelle
            setKpi(prev => ({
                ...prev,
                overview: {
                    ...prev.overview,
                    sessions: completedSessions || totalSessions, // Eğer onaylı yoksa toplamı göster
                    activeUsers: uniqueClients,
                    activeCoaches: 15, // Şimdilik sabit
                    gmv: totalGMV,
                    revenue: totalRevenue
                }
            }));

            // 2. AI ANALİZ MOTORU ÇALIŞTIR
            generateAiInsights(totalSessions, totalRevenue, uniqueClients);
        }
    } catch (e) { console.log("Veri hatası:", e); }
    setLoading(false);
  };

  // --- YAPAY ZEKA ANALİZ MOTORU ---
  const generateAiInsights = (sessions, revenue, users) => {
    const insights = [];

    // Kural 1: Gelir Analizi
    if (revenue > 5000) {
        insights.push({ type: "success", title: "Güçlü Gelir Artışı", desc: "Bu ayki ciro hedefinin %15 üzerindeyiz. Büyüme stratejisi çalışıyor." });
    } else {
        insights.push({ type: "warning", title: "Gelir Uyarısı", desc: "Ciro beklentinin altında. 'İlk Seans %50 İndirim' kampanyası başlatılabilir." });
    }

    // Kural 2: Kullanıcı Tutundurma (Retention)
    if (users > 0 && sessions / users < 1.5) {
        insights.push({ type: "alert", title: "Retention Riski", desc: "Kullanıcı başına seans sayısı 1.5'in altında. Tekrar eden randevuları artırmak için paket satışları öne çıkarın." });
    }

    // Kural 3: Pazar Yeri Sağlığı
    insights.push({ type: "info", title: "Talep Fazlalığı", desc: "Kariyer koçluğu kategorisinde talep arzdan %40 fazla. Yeni koç alımı yapılmalı." });

    setAiInsights(insights);
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-bold text-blue-900">CEO Paneli Hazırlanıyor...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* ÜST HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <Badge className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">CEO DASHBOARD v2.0</Badge>
                <h1 className="text-3xl font-bold text-gray-900">Genel Bakış</h1>
                <p className="text-gray-500">Gerçek zamanlı platform metrikleri ve AI önerileri.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline"><Filter className="w-4 h-4 mr-2"/> Filtrele</Button>
                <Button variant="outline"><Download className="w-4 h-4 mr-2"/> Rapor İndir</Button>
            </div>
        </div>

        {/* NORTH STAR METRIC (KUZEY YILDIZI) */}
        <Card className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-none shadow-xl">
            <CardContent className="p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <p className="text-blue-200 font-medium mb-1 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400 fill-current"/> NORTH STAR METRIC</p>
                    <h2 className="text-5xl font-bold">{kpi.overview.sessions}</h2>
                    <p className="text-lg text-blue-100 mt-2">Aylık Tamamlanan Seans</p>
                </div>
                <div className="flex gap-8 text-center md:text-right">
                    <div>
                        <p className="text-sm text-blue-300">Hedef</p>
                        <p className="text-2xl font-bold">120</p>
                    </div>
                    <div>
                        <p className="text-sm text-blue-300">Tamamlanma</p>
                        <p className="text-2xl font-bold text-green-400">
                            {kpi.overview.sessions > 0 ? Math.min(100, Math.round((kpi.overview.sessions / 120) * 100)) : 0}%
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* AI ANALİZ KUTUSU (YENİ) */}
        <div className="grid md:grid-cols-3 gap-6">
            <Card className="md:col-span-2 border-2 border-indigo-100 bg-indigo-50/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-900">
                        <Brain className="w-6 h-6 text-indigo-600"/> Kariyeer AI Analizi
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {aiInsights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border shadow-sm">
                            {insight.type === 'success' && <TrendingUp className="w-5 h-5 text-green-600 mt-1"/>}
                            {insight.type === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-600 mt-1"/>}
                            {insight.type === 'alert' && <AlertTriangle className="w-5 h-5 text-red-600 mt-1"/>}
                            {insight.type === 'info' && <Activity className="w-5 h-5 text-blue-600 mt-1"/>}
                            <div>
                                <h4 className="font-bold text-gray-900 text-sm">{insight.title}</h4>
                                <p className="text-gray-600 text-sm">{insight.desc}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* HIZLI FİNANS ÖZETİ */}
            <Card>
                <CardHeader><CardTitle>Finansal Özet</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">GMV (Hacim)</span>
                        <span className="text-xl font-bold text-gray-900">₺{kpi.overview.gmv.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500">Net Gelir</span>
                        <span className="text-xl font-bold text-green-600">₺{kpi.overview.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '20%'}}></div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">Take Rate: %20</p>
                </CardContent>
            </Card>
        </div>

        {/* DETAYLI SEKMELER */}
        <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 bg-white p-1 border rounded-lg">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="growth">Growth</TabsTrigger>
                <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                <TabsTrigger value="finance">Finance</TabsTrigger>
                <TabsTrigger value="quality">Quality</TabsTrigger>
            </TabsList>

            {/* TAB 1: OVERVIEW */}
            <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    <MetricCard title="Aktif Danışan" value={kpi.overview.activeUsers} sub="+12% geçen haftaya göre" icon={Users} color="blue" />
                    <MetricCard title="Aktif Koç" value={kpi.overview.activeCoaches} sub="3 yeni başvuru" icon={Target} color="purple" />
                    <MetricCard title="NPS Skoru" value={kpi.overview.nps} sub="Sektör ortalaması üstünde" icon={Star} color="yellow" />
                </div>
            </TabsContent>

            {/* TAB 2: GROWTH (BÜYÜME) */}
            <TabsContent value="growth">
                <Card><CardContent className="p-6 text-center">
                    <h3 className="text-lg font-bold mb-4">Dönüşüm Hunisi (Funnel)</h3>
                    <div className="space-y-2 max-w-lg mx-auto">
                        <FunnelBar label="Ziyaretçi" value="12,500" percent="100%" color="bg-blue-100" width="100%" />
                        <FunnelBar label="Üyelik" value="525" percent="4.2%" color="bg-blue-300" width="60%" />
                        <FunnelBar label="İlk Seans" value
