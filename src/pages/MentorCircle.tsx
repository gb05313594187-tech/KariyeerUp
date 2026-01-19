// MentorCircle.tsx
// Full Supabase-powered feed (no mocks)
// @ts-nocheck
import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Heart, MessageCircle, Share2, TrendingUp, Clock, Users, Eye, Repeat2, X, Crown, CheckCircle
} from 'lucide-react'

export default function MentorCircle() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'popular' | 'new' | 'following'>('popular')
  const [openCreate, setOpenCreate] = useState(false)
  const [content, setContent] = useState('')

  // ===== FETCH FEED =====
  useEffect(() => {
    fetchFeed()
  }, [tab])

  async function fetchFeed() {
    setLoading(true)

    let q = supabase
      .from('posts')
      .select(`
        id, content, created_at,
        visibility,
        reactions:post_reactions(count),
        comments:post_comments(count),
        author:profiles(id, full_name, title, avatar_url, is_verified, is_premium)
      `)
      .eq('visibility', 'public')

    if (tab === 'new') q = q.order('created_at', { ascending: false })

    if (tab === 'popular') q = q.order('created_at', { ascending: false })

    const { data, error } = await q

    if (!error) setPosts(data || [])
    setLoading(false)
  }

  // ===== CREATE POST =====
  async function createPost() {
    if (!content.trim()) return

    await supabase.from('posts').insert({
      content,
      visibility: 'public'
    })

    setContent('')
    setOpenCreate(false)
    fetchFeed()
  }

  // ===== LIKE (UPSERT) =====
  async function toggleLike(postId: string) {
    await supabase.from('post_reactions').upsert({ post_id: postId })
    fetchFeed()
  }

  const ranked = useMemo(() => {
    if (tab !== 'popular') return posts
    return [...posts].sort(
      (a, b) => (b.reactions?.[0]?.count || 0) - (a.reactions?.[0]?.count || 0)
    )
  }, [posts, tab])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">MentorCircle</h1>
          <p className="text-gray-600">Professional feed • AI-ready • Premium</p>
        </div>

        {/* CREATE */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <Button variant="ghost" className="w-full justify-start" onClick={() => setOpenCreate(true)}>
              Bir gönderi başlat…
            </Button>
          </CardContent>
        </Card>

        {/* TABS */}
        <Tabs value={tab} onValueChange={v => setTab(v as any)}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="popular"><TrendingUp className="h-4 w-4" /> Popüler</TabsTrigger>
            <TabsTrigger value="new"><Clock className="h-4 w-4" /> Yeni</TabsTrigger>
            <TabsTrigger value="following"><Users className="h-4 w-4" /> Takip</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="space-y-6">
            {loading && <p className="text-center">Loading…</p>}

            {!loading && ranked.map(post => (
              <Card key={post.id} className={post.author.is_premium ? 'border-amber-300 border-2' : ''}>
                <CardContent className="pt-6">

                  {/* AUTHOR */}
                  <div className="flex items-center gap-3 mb-4">
                    <img src={post.author.avatar_url} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <b>{post.author.full_name}</b>
                        {post.author.is_verified && <CheckCircle className="h-4 w-4 text-blue-500" />}
                        {post.author.is_premium && <Crown className="h-4 w-4 text-amber-500" />}
                      </div>
                      <p className="text-sm text-gray-500">{post.author.title}</p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <p className="mb-4 whitespace-pre-line">{post.content}</p>

                  {/* STATS */}
                  <div className="flex gap-6 text-sm text-gray-600 border-y py-2 mb-3">
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" />0</span>
                    <span className="flex items-center gap-1"><Heart className="h-4 w-4" />{post.reactions?.[0]?.count || 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.comments?.[0]?.count || 0}</span>
                    <span className="flex items-center gap-1"><Repeat2 className="h-4 w-4" />0</span>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <Button variant="ghost" className="flex-1" onClick={() => toggleLike(post.id)}>
                      <Heart className="h-4 w-4 mr-2" /> Beğen
                    </Button>
                    <Button variant="ghost" className="flex-1"><MessageCircle className="h-4 w-4 mr-2" /> Yorum</Button>
                    <Button variant="ghost" className="flex-1"><Share2 className="h-4 w-4 mr-2" /> Paylaş</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* CREATE MODAL */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Gönderi Oluştur</DialogTitle>
            <Button size="sm" variant="ghost" onClick={() => setOpenCreate(false)}><X /></Button>
          </DialogHeader>
          <Textarea value={content} onChange={e => setContent(e.target.value)} className="min-h-[200px]" />
          <Button onClick={createPost} className="mt-4">Paylaş</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
