import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SellerSidebar } from "./seller.dashboard";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-store";
import {
  getCreators,
  getCreatorByUserId,
  saveCreator,
  isHandleAvailable,
  getProductVideos,
  getVideosByCreator,
  saveProductVideo,
} from "@/lib/creator-store";
import { CreatorProfile, ProductVideo, ReviewType } from "@/data/creator";
import { parseAndValidateVideoUrl } from "@/lib/video-parser";
import { products, listings } from "@/data/catalog";
import {
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Video,
  Plus,
  Play,
  Youtube,
  Trash2,
} from "lucide-react";

export const Route = createFileRoute("/seller/creator-profile")({
  head: () => ({
    meta: [{ title: "Creator Hub | Seller · Resale.com" }],
  }),
  component: SellerCreatorProfilePage,
});

function SellerCreatorProfilePage() {
  const { user } = useAuth();
  const userId = user?.id || (user?.phone ? `user-${user.phone}` : "");

  const [creator, setCreator] = useState<CreatorProfile | null>(null);
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [handleError, setHandleError] = useState<string | null>(null);

  // Profile Form state
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bio, setBio] = useState("");
  const [youtube, setYoutube] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");

  // Video Submission state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [selectedListingId, setSelectedListingId] = useState<string>("none");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [reviewType, setReviewType] = useState<ReviewType>("FULL_REVIEW");
  const [videoUrlError, setVideoUrlError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    const existing = getCreatorByUserId(userId);
    if (existing) {
      setCreator(existing);
      setDisplayName(existing.displayName);
      setHandle(existing.handle);
      setAvatarUrl(existing.avatarUrl || "");
      setBannerUrl(existing.bannerUrl || "");
      setBio(existing.bio || "");
      setYoutube(existing.channels.youtube || "");
      setFacebook(existing.channels.facebook || "");
      setTiktok(existing.channels.tiktok || "");
      setVideos(getVideosByCreator(existing.id));
    } else {
      setCreator(null);
      setDisplayName(user?.name || "");
      setHandle(user?.name ? user.name.toLowerCase().replace(/[^a-z0-9_-]/g, "") : "");
      setAvatarUrl("");
      setBannerUrl("");
      setBio("");
      setYoutube("");
      setFacebook("");
      setTiktok("");
      setVideos([]);
    }
  }, [userId, user?.name]);

  const handleHandleChange = (val: string) => {
    const clean = val
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "")
      .replace(/--+/g, "-");
    setHandle(clean);
    if (clean) {
      setHandleError(
        isHandleAvailable(clean, creator?.id) ? null : "This handle is already taken.",
      );
    } else {
      setHandleError("Handle cannot be empty.");
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !handle.trim() || handleError) return;

    const creatorId = creator?.id || `creator-${handle}-${Date.now().toString(36)}`;
    const updated: CreatorProfile = {
      id: creatorId,
      userId,
      handle: handle.trim(),
      displayName: displayName.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      bio: bio.trim() || undefined,
      verified: creator?.verified ?? false,
      totalReviews: videos.length,
      channels: {
        youtube: youtube.trim() || undefined,
        facebook: facebook.trim() || undefined,
        tiktok: tiktok.trim() || undefined,
      },
      createdAt: creator?.createdAt || new Date().toISOString(),
    };

    saveCreator(updated);
    setCreator(updated);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 4000);
  };

  const handleVideoUrlChange = (val: string) => {
    setVideoUrl(val);
    if (!val.trim()) {
      setVideoUrlError(null);
      return;
    }
    const parsed = parseAndValidateVideoUrl(val);
    if (!parsed) {
      setVideoUrlError("Please provide a valid YouTube, TikTok, or Facebook video URL.");
    } else {
      setVideoUrlError(null);
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!creator) return;
    if (!videoUrl.trim() || !videoTitle.trim()) return;

    const parsed = parseAndValidateVideoUrl(videoUrl);
    if (!parsed) {
      setVideoUrlError("Invalid platform video URL.");
      return;
    }

    const newVideo: ProductVideo = {
      id: `vid-${Date.now().toString(36)}`,
      productId: selectedProductId,
      creatorId: creator.id,
      listingId: selectedListingId !== "none" ? selectedListingId : undefined,
      platform: parsed.platform,
      videoUrl: videoUrl.trim(),
      videoId: parsed.videoId,
      title: videoTitle.trim(),
      thumbnailUrl: parsed.thumbnailUrl,
      reviewType,
      publishedDate: new Date().toISOString().split("T")[0],
      isVerifiedReviewUnit: selectedListingId !== "none",
      status: "APPROVED",
    };

    saveProductVideo(newVideo);
    const updatedVideos = [newVideo, ...videos];
    setVideos(updatedVideos);

    // Reset video form
    setVideoUrl("");
    setVideoTitle("");
    setSelectedListingId("none");
    setVideoSuccess(true);
    setTimeout(() => setVideoSuccess(false), 4000);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background flex flex-col">
        <SiteHeader />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-10 w-full flex gap-8">
          <SellerSidebar active="creator" />

          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
                  <Sparkles className="size-4" />
                  <span>Tech Reviewer &amp; Creator Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
                  Creator Profile &amp; Video Reviews
                </h1>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Link your YouTube/TikTok review videos to catalog devices and exact reviewed
                  units.
                </p>
              </div>

              {handle && !handleError && (
                <Button asChild variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Link to="/creator/$creatorSlug" params={{ creatorSlug: handle }} target="_blank">
                    <span>View Public Hub</span>
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              )}
            </div>

            {/* Profile Success Alert */}
            {profileSuccess && (
              <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                <span>
                  Creator profile updated. Live changes are published to /creator/{handle}.
                </span>
              </div>
            )}

            {/* Verification Status */}
            <Card className="border-border bg-card">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
                      creator?.verified
                        ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-foreground">
                        {creator?.verified ? "Verified Tech Creator" : "Creator Account"}
                      </span>
                      {creator?.verified ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                          Authenticated Channel
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">
                          Standard Reviewer
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Verified status highlights your reviews directly on master product
                      specification pages.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Configuration Form */}
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">Profile &amp; Channels</CardTitle>
                  <CardDescription className="text-xs">
                    Your public handle, avatar, and social links.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-name" className="text-xs font-semibold">
                        Channel / Creator Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="c-name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Sam Tech BD"
                        required
                        className="text-xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="c-handle" className="text-xs font-semibold">
                        Handle (URL Slug) <span className="text-destructive">*</span>
                      </Label>
                      <div className="flex items-center">
                        <span className="px-3 py-2 bg-muted border border-r-0 border-border text-muted-foreground text-xs rounded-l-md font-mono">
                          resale.com/creator/
                        </span>
                        <Input
                          id="c-handle"
                          value={handle}
                          onChange={(e) => handleHandleChange(e.target.value)}
                          placeholder="sam-tech-bd"
                          required
                          className="rounded-l-none text-xs font-mono"
                        />
                      </div>
                      {handleError && (
                        <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="size-3" />
                          <span>{handleError}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="c-bio" className="text-xs font-semibold">
                      Creator Bio &amp; Review Focus
                    </Label>
                    <Textarea
                      id="c-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell buyers about your hardware test procedures, camera sample methodologies, etc."
                      rows={2}
                      className="text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-avatar" className="text-xs font-semibold">
                        Avatar Image URL
                      </Label>
                      <Input
                        id="c-avatar"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://.../avatar.jpg"
                        className="text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-banner" className="text-xs font-semibold">
                        Banner Cover URL
                      </Label>
                      <Input
                        id="c-banner"
                        value={bannerUrl}
                        onChange={(e) => setBannerUrl(e.target.value)}
                        placeholder="https://.../banner.jpg"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border/70">
                    <div className="space-y-1.5">
                      <Label htmlFor="c-yt" className="text-xs font-semibold">
                        YouTube URL
                      </Label>
                      <Input
                        id="c-yt"
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        placeholder="https://youtube.com/@handle"
                        className="text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-fb" className="text-xs font-semibold">
                        Facebook Page URL
                      </Label>
                      <Input
                        id="c-fb"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder="https://facebook.com/page"
                        className="text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="c-tt" className="text-xs font-semibold">
                        TikTok URL
                      </Label>
                      <Input
                        id="c-tt"
                        value={tiktok}
                        onChange={(e) => setTiktok(e.target.value)}
                        placeholder="https://tiktok.com/@handle"
                        className="text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" size="sm" className="gap-2 text-xs font-semibold">
                      <Save className="size-4" />
                      <span>Save Profile</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>

            {/* Video Linker Form */}
            {creator && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Video className="size-4 text-primary" />
                    <span>Attach Video Review to Catalog Device</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Submit YouTube/TikTok video links to show on master product pages and exact
                    listings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {videoSuccess && (
                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                      <span>Video review submitted &amp; linked to product successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleAddVideo} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Master Product Selection */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">
                          Target Master Product <span className="text-destructive">*</span>
                        </Label>
                        <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select device model" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            {products.map((p) => (
                              <SelectItem key={p.id} value={p.id} className="text-xs">
                                {p.name} ({p.brand})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Review Type */}
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold">
                          Review Category <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={reviewType}
                          onValueChange={(val) => setReviewType(val as ReviewType)}
                        >
                          <SelectTrigger className="text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FULL_REVIEW" className="text-xs">
                              Full In-Depth Review
                            </SelectItem>
                            <SelectItem value="BATTERY_TEST" className="text-xs">
                              Battery &amp; Thermal Test
                            </SelectItem>
                            <SelectItem value="CAMERA_COMPARISON" className="text-xs">
                              Camera Sensor Diagnostic
                            </SelectItem>
                            <SelectItem value="UNBOXING" className="text-xs">
                              Unboxing &amp; First Impression
                            </SelectItem>
                            <SelectItem value="LONG_TERM" className="text-xs">
                              6-Month Long Term Test
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Video URL */}
                      <div className="space-y-1.5">
                        <Label htmlFor="v-url" className="text-xs font-semibold">
                          External Video URL <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="v-url"
                          value={videoUrl}
                          onChange={(e) => handleVideoUrlChange(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          required
                          className="text-xs font-mono"
                        />
                        {videoUrlError && (
                          <p className="text-[11px] text-destructive flex items-center gap-1 mt-1">
                            <AlertCircle className="size-3" />
                            <span>{videoUrlError}</span>
                          </p>
                        )}
                      </div>

                      {/* Video Title */}
                      <div className="space-y-1.5">
                        <Label htmlFor="v-title" className="text-xs font-semibold">
                          Review Headline <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="v-title"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                          placeholder="e.g. iPhone 15 Pro 1-Year Real World Test"
                          required
                          className="text-xs"
                        />
                      </div>
                    </div>

                    {/* Optional Exact Listing Association */}
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold">
                        (Optional) Exact Physical Unit for Sale
                      </Label>
                      <Select value={selectedListingId} onValueChange={setSelectedListingId}>
                        <SelectTrigger className="text-xs">
                          <SelectValue placeholder="Are you selling the exact unit from this video?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none" className="text-xs">
                            No (General model review, not tied to a single unit)
                          </SelectItem>
                          {listings.slice(0, 10).map((l) => (
                            <SelectItem key={l.id} value={l.id} className="text-xs">
                              Listing #{l.id} · Grade {l.grade} · ৳{l.price.toLocaleString()} (
                              {l.seller.name})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-[11px] text-muted-foreground">
                        Select an active listing only if you are selling the exact device featured
                        in the video.
                      </p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button type="submit" size="sm" className="gap-2 text-xs font-semibold">
                        <Plus className="size-4" />
                        <span>Submit Review Video</span>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Submitted Videos List */}
            {creator && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-bold">
                    My Submitted Reviews ({videos.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {videos.length > 0 ? (
                    <div className="space-y-3">
                      {videos.map((vid) => {
                        const prod = products.find((p) => p.id === vid.productId);
                        return (
                          <div
                            key={vid.id}
                            className="p-3 rounded-lg border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              <div className="size-14 bg-muted rounded overflow-hidden relative shrink-0">
                                <img
                                  src={vid.thumbnailUrl}
                                  alt={vid.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <Play className="size-4 text-white fill-current" />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <p className="font-bold text-foreground line-clamp-1">
                                  {vid.title}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-[11px]">
                                  <span>{prod?.name || vid.productId}</span>
                                  <span>&middot;</span>
                                  <span>{vid.reviewType.replace("_", " ")}</span>
                                  {vid.isVerifiedReviewUnit && (
                                    <>
                                      <span>&middot;</span>
                                      <span className="text-emerald-600 font-semibold">
                                        Exact Unit #{vid.listingId}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                                Approved
                              </Badge>
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-8 px-2 text-xs"
                              >
                                <a href={vid.videoUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="size-3.5" />
                                </a>
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground py-6 text-center">
                      No videos submitted yet. Use the form above to link your first review.
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <SiteFooter />
      </div>
    </ProtectedRoute>
  );
}
