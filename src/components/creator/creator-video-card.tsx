import { useState } from "react";
import { ProductVideo } from "@/data/creator";
import { getCreatorById } from "@/lib/creator-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Play, ShieldCheck, Youtube, Video, ExternalLink } from "lucide-react";
import { CreatorVideoModal } from "./creator-video-modal";
import { Link } from "@tanstack/react-router";

interface CreatorVideoCardProps {
  video: ProductVideo;
  showCreatorInfo?: boolean | undefined;
}

export function CreatorVideoCard({ video, showCreatorInfo = true }: CreatorVideoCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const creator = getCreatorById(video.creatorId);

  const reviewTypeLabel: Record<string, string> = {
    FULL_REVIEW: "Full Review",
    UNBOXING: "Unboxing",
    BATTERY_TEST: "Battery Diagnostic",
    CAMERA_COMPARISON: "Camera Test",
    LONG_TERM: "Long-term Test",
  };

  return (
    <>
      <Card className="overflow-hidden border-border bg-card hover:border-primary/50 transition-all group flex flex-col h-full shadow-xs">
        {/* Thumbnail + Play Overlay */}
        <div
          onClick={() => setModalOpen(true)}
          className="relative aspect-video w-full bg-muted cursor-pointer overflow-hidden group"
        >
          <img
            src={
              video.thumbnailUrl ||
              "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
            }
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <div className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="size-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 pointer-events-none">
            <Badge className="bg-black/75 backdrop-blur-xs text-white border-0 text-[10px] font-semibold">
              {reviewTypeLabel[video.reviewType] || "Review"}
            </Badge>
            {video.isVerifiedReviewUnit && (
              <Badge className="bg-emerald-600 text-white border-0 text-[10px] font-semibold gap-1">
                <ShieldCheck className="size-3" />
                <span>Exact Unit</span>
              </Badge>
            )}
          </div>
        </div>

        {/* Content Details */}
        <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <h4
            onClick={() => setModalOpen(true)}
            className="font-bold text-xs sm:text-sm text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors leading-snug"
          >
            {video.title}
          </h4>

          {/* Creator Attribution */}
          {showCreatorInfo && creator && (
            <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
              <Link
                to="/creator/$creatorSlug"
                params={{ creatorSlug: creator.handle }}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <Avatar className="size-6 border border-border">
                  <AvatarImage src={creator.avatarUrl} alt={creator.displayName} />
                  <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                    {creator.displayName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-foreground text-[11px] truncate max-w-30">
                  {creator.displayName}
                </span>
                {creator.verified && <ShieldCheck className="size-3 text-emerald-600 shrink-0" />}
              </Link>

              {video.listingId && (
                <Link
                  to="/listing/$listingId"
                  params={{ listingId: video.listingId }}
                  className="text-[10px] text-primary hover:underline font-semibold"
                >
                  Buy Reviewed Unit →
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Video Playback Modal */}
      <CreatorVideoModal video={video} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
}
