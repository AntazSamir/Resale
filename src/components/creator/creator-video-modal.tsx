import { ProductVideo } from "@/data/creator";
import { parseAndValidateVideoUrl } from "@/lib/video-parser";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Youtube, ShieldCheck, Sparkles, ExternalLink } from "lucide-react";

interface CreatorVideoModalProps {
  video: ProductVideo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatorVideoModal({ video, open, onOpenChange }: CreatorVideoModalProps) {
  if (!video) return null;

  const parsed = parseAndValidateVideoUrl(video.videoUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background">
        {/* Video Embed Frame */}
        <div className="relative w-full aspect-video bg-black">
          {parsed?.embedUrl ? (
            <iframe
              src={parsed.embedUrl}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-presentation"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
              <p className="text-sm font-semibold">Video preview unavailable</p>
              <p className="text-xs text-muted-foreground mt-1">
                Please visit the external platform link directly.
              </p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary underline"
              >
                <span>Open in external tab</span>
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}
        </div>

        {/* Video Details & Meta */}
        <div className="p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-semibold">
              {video.reviewType.replace("_", " ")}
            </Badge>

            {video.isVerifiedReviewUnit && (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-semibold gap-1">
                <ShieldCheck className="size-3" />
                <span>Verified Exact Review Unit</span>
              </Badge>
            )}

            {video.publishedDate && (
              <span className="text-xs text-muted-foreground ml-auto">
                Reviewed on {video.publishedDate}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
            {video.title}
          </h3>

          <div className="flex items-center justify-between pt-2 border-t border-border text-xs text-muted-foreground">
            <span>External platform embed &middot; Authentic creator review</span>
            <a
              href={video.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
            >
              <span>Watch on {video.platform}</span>
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
