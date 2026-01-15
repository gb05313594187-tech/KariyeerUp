import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { 
  Target, Trophy, Zap, MapPin, Camera, Globe, Briefcase, 
  GraduationCap, Edit3, Save, X, CheckCircle2, Award, 
  Star, Share2, ChevronRight, Download, Image as ImageIcon,
  FileText, ShieldCheck, Mail, Phone, Link as LinkIcon, 
  Linkedin, Twitter, Plus, Trash2, Languages, Cpu, LayoutGrid,
  History, Settings2, UserCircle2, Rocket, ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (error) throw error;
      setProfile(data);
      setFormData(data);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const handleSave = async () => {
    const { error } = await supabase.from("profiles").update(formData).eq("id", profile.id);
    if (!error) {
      setProfile(formData);
      setIsEditing(false);
      toast.success("Veritabanı senkronize edildi.");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0A0A0B]">
      <div className="w-12 h-12 border-2 border-[#C62828] border-t-transparent rounded-full animate-spin mb-4" />
      <span className="text-white font-mono text-[10px] tracking-[0.5em] uppercase">System Booting...</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F1F3F5] text-[#1A1A1B] font-sans antialiased">
      {/* 🏛️ ULTRA-MODERN NAVIGATION / ACTION BAR */}
      <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-black/20">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-tighter">Unicorn Talent <span className="text-[#C62828]">OS</span></h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Executive Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-100">
              <Eye className="w-4 h-4 mr-2" /> Preview Mode
            </Button>
            {isEditing ? (
              <Button onClick={handleSave} className="bg-black hover:bg-zinc-800 text-white rounded-xl px-10 h-12 font-black shadow-xl transition-all active:scale-95">
                <Save className="w-4 h-4 mr-2" /> CHANGES PUBLISH
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-[#C62828] hover:bg-[#A31F1F] text-white rounded-xl px-10 h-12 font-black shadow-xl shadow-red-900/10 transition-all active:scale-95">
                <Edit3 className="w-4 h-4 mr-2" /> EDIT PROFILE
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-8 py-10 grid grid-cols-12 gap-10">
        
        {/* 🧬 LEFT SIDEBAR: IDENTITY & ANALYTICS */}
        <div className="col-span-12 lg:col-span-3 space-y-8">
          <div className="relative group">
            <div className="w-full aspect-square rounded-[3rem] bg-white shadow-2xl shadow-slate-200 overflow-hidden border-8 border-white">
              <img 
                src={profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile?.full_name}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                  <Camera className="text-white w-8 h-8 mb-2" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Update Photo</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 px-2">
            <h1 className="text-3xl font-black tracking-tight italic">{profile?.full_name}</h1>
            <p className="text-[#C62828] font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {profile?.title || "Executive Talent"}
            </p>
          </div>

          <Card className="p-8 border-none shadow-sm rounded-[2.5rem] bg-white">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Profile Strength</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black italic">88%</span>
                <span className="text-[10px] font-bold text-green-500 uppercase">Excellent</span>
              </div>
              <Progress value={88} className="h-1.5 bg-slate-100 [&>div]:bg-black" />
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="p-6 border-none shadow-sm rounded-3xl bg-slate-900 text-white group cursor-pointer hover:bg-black transition-all">
              <div className="flex justify-between items-start mb-4">
                <BarChart3 className="w-6 h-6 text-[#C62828]" />
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </div>
              <p className="text-2xl font-black italic">2,415</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly Impressions</p>
            </Card>
          </div>
        </div>

        {/* 💻 MAIN WORKSPACE: THE EUROPASS ENGINE */}
        <div className="col-span-12 lg:col-span-9 space-y-10">
          
          <Tabs defaultValue="europass" className="w-full">
            <TabsList className="bg-white border border-slate-200 p-2 rounded-[2rem] w-fit mb-10 shadow-sm">
              <TabsTrigger value="europass" className="rounded-[1.5rem] px-10 py-3 font-black text-[10px] tracking-widest uppercase data-[state=active]:bg-black data-[state=active]:text-white">
                <FileText className="w-4 h-4 mr-2" /> Europass Core
              </TabsTrigger>
              <TabsTrigger value="experience" className="rounded-[1.5rem] px-10 py-3 font-black text-[10px] tracking-widest uppercase data-[state=active]:bg-black data-[state=active]:text-white">
                <History className="w-4 h-4 mr-2" /> Experience Map
              </TabsTrigger>
              <TabsTrigger value="skills" className="rounded-[1.5rem] px-10 py-3 font-black text-[10px] tracking-widest uppercase data-[state=active]:bg-black data-[state=active]:text-white">
                <Zap className="w-4 h-4 mr-2" /> Skill Matrix
              </TabsTrigger>
            </TabsList>

            <TabsContent value="europass" className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-500">
              
              {/* SECTION: PERSONAL STATEMENT */}
              <section className="space-y-6">
                <div className="flex items-center gap-4 px-2">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border">
                    <UserCircle2 className="w-6 h-6 text-[#C62828]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black italic tracking-tight">Executive Manifesto</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Vision & Leadership Philosophy</p>
                  </div>
                </div>
                <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-5"><QuoteIcon className="w-32 h-32 text-black" /></div>
                   {isEditing ? (
                     <Textarea 
                       value={formData.manifesto}
                       onChange={(e) => setFormData({...formData, manifesto: e.target.value})}
                       className="text-2xl font-bold italic bg-slate-50 border-none rounded-2xl min-h-[150px] p-8 focus-visible:ring-1 focus-visible:ring-[#C62828]"
                       placeholder="Enter your high-impact vision statement..."
                     />
                   ) : (
                     <p className="text-4xl font-black italic leading-[1.1] tracking-tighter text-slate-800">
                       "{profile?.manifesto || "Design the future by managing the present with absolute precision."}"
                     </p>
                   )}
                </Card>
              </section>

              {/* SECTION: EUROPASS FORM GRID */}
              <section className="grid grid-cols-2 gap-8">
                <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#C62828]">Official Identity</h3>
                    <Badge variant="outline" className="rounded-full font-bold text-[8px] uppercase">EU Standard</Badge>
                  </div>
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 px-1">Full Name</label>
                      <Input disabled={!isEditing} value={formData.full_name} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 px-1">Contact Email</label>
                      <Input disabled={!isEditing} value={formData.email} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" />
                    </div>
                  </div>
                </Card>

                <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white space-y-8">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                    <h3 className="font-black text-xs uppercase tracking-[0.2em] text-[#C62828]">Location Hub</h3>
                    <MapPin className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 px-1">Current City / Country</label>
                      <Input disabled={!isEditing} value={formData.city} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" />
                    </div>
                    <div className="grid gap-2">
                      <label className="text-[9px] font-black uppercase text-slate-400 px-1">Primary Industry</label>
                      <Input disabled={!isEditing} value={formData.sector} className="h-14 rounded-2xl bg-slate-50 border-none font-bold text-slate-700" />
                    </div>
                  </div>
                </Card>
              </section>

              {/* SECTION: WORK EXPERIENCE (THE CORE) */}
              <section className="space-y-8">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border">
                      <Briefcase className="w-6 h-6 text-[#C62828]" />
                    </div>
                    <h2 className="text-xl font-black italic tracking-tight text-slate-800">Professional Path</h2>
                  </div>
                  {isEditing && (
                    <Button variant="outline" className="rounded-xl border-dashed border-slate-300 font-black text-[10px] tracking-widest uppercase h-12 px-8">
                      <Plus className="w-4 h-4 mr-2" /> Add Experience
                    </Button>
                  )}
                </div>

                <div className="space-y-6">
                  {[1, 2].map((i) => (
                    <Card key={i} className="p-10 border-none shadow-sm rounded-[3rem] bg-white group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 border-l-0 hover:border-l-[12px] hover:border-[#C62828]">
                      <div className="flex flex-col md:flex-row gap-10">
                        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center shrink-0 border border-slate-100">
                          <img src={`https://logo.clearbit.com/apple.com?size=100`} className="w-10 h-10 grayscale group-hover:grayscale-0 transition-all" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-2xl font-black tracking-tighter italic">Senior Product Strategist</h4>
                              <p className="text-[#C62828] font-black text-[10px] tracking-widest uppercase mt-1">Global Tech Solutions • 2018 - Present</p>
                            </div>
                            {isEditing && (
                              <div className="flex gap-2">
                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-slate-100"><Edit3 className="w-4 h-4" /></Button>
                                <Button size="icon" variant="ghost" className="rounded-xl hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></Button>
                              </div>
                            )}
                          </div>
                          <p className="text-slate-500 font-medium leading-relaxed">
                            Led a cross-functional team of 45+ designers and engineers to build the next generation of SaaS infrastructure. Increased annual recurring revenue by 140% within the first 18 months through strategic pivot.
                          </p>
                          <div className="flex gap-2 pt-2">
                            {['Strategic Planning', 'Leadership', 'SaaS'].map(tag => (
                              <Badge key={tag} className="bg-slate-50 text-slate-500 border-none font-bold text-[9px] px-3 py-1 rounded-lg uppercase">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

            </TabsContent>
          </Tabs>

        </div>
      </main>

      {/* 🚀 FIXED UNIVERSAL DOWNLOAD BAR */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] no-print w-full max-w-[600px] px-6">
        <div className="bg-black/90 backdrop-blur-2xl border border-white/10 p-4 rounded-[2.5rem] shadow-2xl flex items-center justify-between ring-1 ring-white/20">
           <div className="flex items-center gap-4 pl-4">
              <div className="w-10 h-10 bg-[#C62828] rounded-full flex items-center justify-center animate-pulse">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-black text-[10px] uppercase tracking-widest leading-none">Europass Engine</p>
                <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] mt-1">Standardized EU Output</p>
              </div>
           </div>
           <Button onClick={() => window.print()} className="bg-white hover:bg-slate-200 text-black rounded-[1.8rem] px-10 h-14 font-black text-xs uppercase tracking-widest transition-all">
              Generate OFFICIAL PDF
           </Button>
        </div>
      </div>

    </div>
  );
};

const QuoteIcon = (props: any) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017V21H14.017ZM5.017 21L5.017 18C5.017 16.8954 5.91243 16 7.017 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.017C5.46472 8 5.017 8.44772 5.017 9V12C5.017 12.5523 4.56928 13 4.017 13H2.017V21H5.017Z" />
  </svg>
);

const ArrowUpRight = (props: any) => (
  <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

export default UserProfile;
