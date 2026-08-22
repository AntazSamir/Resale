import { CreatorProfile } from "@/data/creator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Youtube,
  Facebook,
  Video,
  Instagram,
  Sparkles,
  PlaySquare,
  ExternalLink,
} from "lucide-react";

interface CreatorHeroProps {
  creator: CreatorProfile;
}

export function CreatorHero({ creator }: CreatorHeroProps) {
  const initial = creator.displayName.charAt(0).toUpperCase();

  return (
    <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-xs mb-8">
      {/* Banner */}
      <div
        className="h-44 sm:h-56 md:h-64 w-full bg-muted bg-cover bg-center relative"
        style={{
          backgroundImage: creator.bannerUrl
            ? `url(${creator.bannerUrl})`
            : "linear-gradient(to right, #1e1b4b, #312e81)",
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/40 to-transparent" />

        {creator.isDemo && (
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-xs border border-border px-2.5 py-1 text-[11px] text-muted-foreground rounded">
            Verified Tech Reviewer Demo
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="relative px-5 sm:px-8 pb-6 -mt-16 sm:-mt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <Avatar className="size-24 sm:size-28 rounded-xl border-4 border-background shadow-md bg-card shrink-0">
              <AvatarImage
                src={creator.avatarUrl}
                alt={creator.displayName}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground">
                  {creator.displayName}
                </h1>
                {creator.verified ? (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold gap-1">
                    <ShieldCheck className="size-3.5" />
                    <span>Verified Tech Creator</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    Creator Profile
                  </Badge>
                )}
              </div>
              <p className="text-xs font-mono text-muted-foreground">@{creator.handle}</p>
            </div>
          </div>

          {/* Social Channels */}
          <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
            {creator.channels.youtube && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs text-red-600 hover:text-red-700"
              >
                <a href={creator.channels.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="size-3.5" />
                  <span>YouTube Channel</span>
                  <ExternalLink className="size-3" />
                </a>
              </Button>
            )}
            {creator.channels.facebook && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="gap-1.5 text-xs text-blue-600 hover:text-blue-700"
              >
                <a href={creator.channels.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="size-3.5" />
                  <span>Facebook</span>
                </a>
              </Button>
            )}
            {creator.channels.tiktok && (
              <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs">
                <a href={creator.channels.tiktok} target="_blank" rel="noopener noreferrer">
                  <Video className="size-3.5" />
                  <span>TikTok</span>
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Bio & Stats */}
        <div className="mt-5 pt-5 border-t border-border/70 space-y-3">
          {creator.bio && (
            <p className="text-xs sm:text-sm text-subtle-foreground max-w-3xl leading-relaxed">
              {creator.bio}
            </p>
          )}

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <PlaySquare className="size-3.5 text-primary" />
              <span>{creator.totalReviews} Video Reviews Published</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
