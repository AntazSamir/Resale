import { ProductVideo } from "@/data/creator";
import { CreatorVideoCard } from "./creator-video-card";
import { Sparkles, Video } from "lucide-react";

interface CreatorReviewStripProps {
  videos: ProductVideo[];
  productName: string;
}

export function CreatorReviewStrip({ videos, productName }: CreatorReviewStripProps) {
  if (!videos || videos.length === 0) return null;

  return (
    <section className="space-y-3 py-6 border-y border-border bg-card/40 -mx-4 px-4 sm:mx-0 sm:px-6 sm:rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
            <Video className="size-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5">
              <span>Creator Reviews &amp; Hands-On Tests</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {videos.length} {videos.length === 1 ? "Video" : "Videos"}
              </span>
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Watch real-world battery tests, camera diagnostics, and teardowns for {productName}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-1">
        {videos.map((video) => (
          <CreatorVideoCard key={video.id} video={video} showCreatorInfo={true} />
        ))}
      </div>
    </section>
  );
}
