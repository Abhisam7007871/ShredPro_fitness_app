"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import LeaderboardWidget from "@/components/social/LeaderboardWidget";
import { Heart, MessageCircle, Send, Image as ImageIcon, Plus, Share2, Activity, Cpu } from "lucide-react";

export default function SocialHub() {
    const { data: session } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [newPost, setNewPost] = useState({ caption: "", imageUrl: "" });
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<{ [key: string]: any[] }>({});
    const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
    const [followingStatus, setFollowingStatus] = useState<{ [key: string]: boolean }>({});
    const [socialStats, setSocialStats] = useState({ followers: 0, following: 0 });
    const [uploading, setUploading] = useState(false);
    const [showSourceMenu, setShowSourceMenu] = useState(false);

    useEffect(() => {
        fetchFeed();
        if (session?.user) {
            fetchSocialStats();
        }
    }, [session]);

    const fetchFeed = async () => {
        try {
            const res = await api.get("/social/feed");
            setPosts(res.data);
            res.data.forEach((post: any) => {
                fetchComments(post.id);
                if (session?.user) {
                    checkFollowStatus((session.user as any).id, post.userId);
                }
            });
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch feed", err);
            setLoading(false);
        }
    };

    const fetchSocialStats = async () => {
        try {
            const res = await api.get(`/social/stats/${(session?.user as any).id}`);
            setSocialStats(res.data);
        } catch (err) {
            console.error("Failed to fetch social stats", err);
        }
    };

    const checkFollowStatus = async (followerId: string, followingId: string) => {
        if (followerId === followingId) return;
        try {
            const res = await api.get(`/social/is-following?followerId=${followerId}&followingId=${followingId}`);
            setFollowingStatus(prev => ({ ...prev, [followingId]: res.data }));
        } catch (err) {
            console.error("Failed to check follow status", err);
        }
    };

    const handleFollowToggle = async (targetUserId: string) => {
        if (!session?.user) return;
        const isFollowing = followingStatus[targetUserId];
        const endpoint = isFollowing ? "/social/unfollow" : "/social/follow";
        try {
            await api.post(endpoint, {
                followerId: (session.user as any).id,
                followingId: targetUserId
            });
            setFollowingStatus(prev => ({ ...prev, [targetUserId]: !isFollowing }));
            fetchSocialStats();
        } catch (err) {
            console.error("Follow toggle failed", err);
        }
    };

    const fetchComments = async (postId: string) => {
        try {
            const res = await api.get(`/social/comments/${postId}`);
            setComments(prev => ({ ...prev, [postId]: res.data }));
        } catch (err) {
            console.error("Failed to fetch comments", err);
        }
    };

    const handleComment = async (postId: string) => {
        if (!session?.user || !newComments[postId]) return;
        try {
            await api.post("/social/comment", {
                postId,
                userId: (session.user as any).id,
                username: session.user.name || "Operator",
                content: newComments[postId],
            });
            setNewComments(prev => ({ ...prev, [postId]: "" }));
            fetchComments(postId);
        } catch (err) {
            console.error("Failed to post comment", err);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            setNewPost(prev => ({ ...prev, imageUrl: reader.result as string }));
            setUploading(false);
            setShowSourceMenu(false);
        };
        reader.readAsDataURL(file);
    };

    const handleSoraGenerate = async () => {
        if (!newPost.caption) return;
        setUploading(true);
        setShowSourceMenu(false);
        // Simulate AI generation time
        await new Promise(r => setTimeout(r, 3000));
        const aiPrompt = newPost.caption.toLowerCase();
        let aiImg = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070";
        if (aiPrompt.includes('gym') || aiPrompt.includes('workout')) aiImg = 'https://images.unsplash.com/photo-1581009146145-b5ef03a74010?q=80&w=2070';
        if (aiPrompt.includes('food') || aiPrompt.includes('meal')) aiImg = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2070';
        setNewPost(prev => ({ ...prev, imageUrl: aiImg }));
        setUploading(false);
    };

    const handlePost = async () => {
        if (!session?.user) return;
        try {
            await api.post("/social/post", {
                userId: (session.user as any).id,
                username: session.user.name || "Operator",
                imageUrl: newPost.imageUrl || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
                caption: newPost.caption,
            });
            setNewPost({ caption: "", imageUrl: "" });
            fetchFeed();
        } catch (err) {
            console.error("Failed to post", err);
        }
    };

    const handleSourceSelect = (source: string) => {
        if (source === 'camera') {
            document.getElementById('camera-input')?.click();
        } else if (source === 'local') {
            document.getElementById('file-input')?.click();
        } else if (source === 'sora') {
            handleSoraGenerate();
        }
    };

    return (
        <main className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 gap-6">
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black italic tracking-tighter uppercase">Tactical <span className="text-primary">Social</span></h1>
                        <p className="text-gray-500 font-medium uppercase tracking-[0.3em] text-[10px]">Community Intelligence • Operational Status</p>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-center group cursor-pointer">
                            <p className="text-2xl font-black text-white group-hover:text-primary transition-colors">{socialStats.followers}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Followers</p>
                        </div>
                        <div className="w-px h-8 bg-white/10" />
                        <div className="text-center group cursor-pointer">
                            <p className="text-2xl font-black text-white group-hover:text-primary transition-colors">{socialStats.following}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Following</p>
                        </div>
                        <div className="ml-4 px-4 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary flex items-center gap-2">
                            <Activity className="w-4 h-4 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Neural Link Active</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-12">
                        {/* Create Post */}
                        <div className="glass-tactical p-6 space-y-4 border-primary/20 relative">
                            <input type="file" id="file-input" accept="image/*" hidden onChange={handleFileUpload} />
                            <input type="file" id="camera-input" accept="image/*" capture="environment" hidden onChange={handleFileUpload} />

                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-surface-accent flex items-center justify-center border border-white/10">
                                    {session?.user?.name?.[0] || 'O'}
                                </div>
                                <input
                                    type="text"
                                    placeholder="WHAT'S YOUR STATUS, OPERATOR?"
                                    className="flex-1 bg-white/5 border border-white/10 p-3 outline-none focus:border-primary/50 transition-all font-heading font-bold text-sm uppercase tracking-wider"
                                    value={newPost.caption}
                                    onChange={(e) => setNewPost({ ...newPost, caption: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex space-x-2 relative">
                                    <button
                                        onClick={() => setShowSourceMenu(!showSourceMenu)}
                                        className={`p-2 border border-white/10 hover:bg-white/5 transition-all rounded flex items-center gap-2 ${newPost.imageUrl ? 'border-primary text-primary' : ''}`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        <ImageIcon className="w-4 h-4" />
                                        {uploading ? <span className="text-[10px] animate-pulse">Syncing...</span> : newPost.imageUrl ? <span className="text-[10px]">Loaded</span> : null}
                                    </button>

                                    {showSourceMenu && (
                                        <div className="absolute top-12 left-0 z-50 w-56 bg-[#1a1a2e] border border-white/10 rounded-xl p-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
                                            <button onClick={() => handleSourceSelect('local')} className="w-full text-left p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                                <ImageIcon size={14} className="text-blue-400" /> Local Library
                                            </button>
                                            <button onClick={() => handleSourceSelect('camera')} className="w-full text-left p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                                <Activity size={14} className="text-primary" /> Take Photo
                                            </button>
                                            <div className="h-px w-full bg-white/10 my-1" />
                                            <button
                                                onClick={() => handleSourceSelect('sora')}
                                                disabled={!newPost.caption}
                                                className={`w-full text-left p-3 hover:bg-white/5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${!newPost.caption && 'opacity-50 cursor-not-allowed'}`}
                                            >
                                                <Cpu size={14} className="text-purple-400" /> Generate with Sora AI
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handlePost}
                                    disabled={!newPost.caption || uploading}
                                    className="px-6 py-2 bg-primary text-black font-extrabold uppercase text-xs tracking-widest rounded transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 shadow-[0_0_20px_rgba(255,59,48,0.2)]"
                                >
                                    Deploy Post
                                </button>
                            </div>
                        </div>

                        {/* Feed */}
                        <div className="space-y-8">
                            {loading ? (
                                <div className="text-center py-20 animate-pulse text-gray-600 font-bold uppercase tracking-widest text-sm">Synchronizing Data...</div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest text-sm">Negative Social Activity. Start the trend.</div>
                            ) : (
                                posts.map((post) => (
                                    <div key={post.id} className="glass-tactical overflow-hidden border-white/5 group">
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary font-black text-sm italic">
                                                    {post.username?.[0] || 'O'}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-heading font-black uppercase text-xs tracking-widest">{post.username}</p>
                                                        <span className="w-1 h-1 rounded-full bg-gray-600" />
                                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Verified</p>
                                                    </div>
                                                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-0.5">Tactical Operator • Sector 7</p>
                                                </div>
                                            </div>

                                            {(session?.user as any).id !== post.userId && (
                                                <button
                                                    onClick={() => handleFollowToggle(post.userId)}
                                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${followingStatus[post.userId]
                                                        ? "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                                                        : "bg-primary text-black shadow-glow hover:scale-105 active:scale-95"
                                                        }`}
                                                >
                                                    {followingStatus[post.userId] ? "Following" : "Follow"}
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative aspect-square md:aspect-video bg-surface-accent overflow-hidden">
                                            <img src={post.imageUrl} alt="Post content" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                        <div className="p-6 space-y-4">
                                            {/* Hevy-Style Workout Summary */}
                                            {(post.caption?.toLowerCase().includes("workout") || post.caption?.toLowerCase().includes("routine")) && (
                                                <div className="grid grid-cols-3 gap-4 p-4 bg-white/[0.03] border border-white/5 rounded-2xl mb-4">
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Volume</p>
                                                        <p className="text-sm font-black text-primary italic">12,450 KG</p>
                                                    </div>
                                                    <div className="text-center border-x border-white/5">
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Time</p>
                                                        <p className="text-sm font-black text-white italic">1h 12m</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Sets</p>
                                                        <p className="text-sm font-black text-white italic">18</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex space-x-6">
                                                <button className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors group/btn">
                                                    <Heart className="w-5 h-5 group-active/btn:scale-125 transition-transform" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{post.likes || 0}</span>
                                                </button>
                                                <button className="flex items-center space-x-2 text-gray-400 hover:text-cyan-400 transition-colors">
                                                    <MessageCircle className="w-5 h-5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{post.comments?.length || 0}</span>
                                                </button>
                                                <button className="text-gray-400 hover:text-white transition-colors ml-auto">
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-relaxed">
                                                    <span className="font-black uppercase tracking-wider text-xs mr-2">{post.username}</span>
                                                    {post.caption}
                                                </p>
                                                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.2em]">{new Date(post.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <LeaderboardWidget />

                        <div className="glass-tactical p-6 border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
                            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Tactical Directive</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-medium italic">
                                "Consistency is the ultimate weapon. Elite status is earned in the silence of the grind."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
