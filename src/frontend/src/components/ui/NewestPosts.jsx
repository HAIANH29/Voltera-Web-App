import { Clock, Heart, Eye, MapPin, Battery, Zap } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./components/image/imageWithFallback";
import { ItemCard } from "./ItemCard";

export function NewestPosts({ onViewDetails, onAddToFavorites, currentUser }) {
  // No mock data - should fetch from API
  const newestPosts = [];

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const posted = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - posted.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just posted";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Newest Posts</h2>
          <Badge variant="secondary" className="text-xs">
            Just added
          </Badge>
        </div>
        <button className="text-sm text-primary hover:underline">
          View all →
        </button>
      </div>

      {/* Mobile/Tablet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {newestPosts.map((item) => (
          <Card
            key={item.id}
            className="group hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="relative">
              <ImageWithFallback
                src={item.images[0]}
                alt={item.title}
                className="w-full h-40 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                {item.verified && (
                  <Badge className="bg-blue-600 text-white text-xs">
                    Verified
                  </Badge>
                )}
                <Badge
                  className={`${
                    item.category === "vehicle"
                      ? "bg-purple-600"
                      : "bg-green-600"
                  } text-white text-xs`}
                >
                  {item.category === "vehicle" ? (
                    <>
                      <Zap className="w-3 h-3 mr-1" />
                      Vehicle
                    </>
                  ) : (
                    <>
                      <Battery className="w-3 h-3 mr-1" />
                      Battery
                    </>
                  )}
                </Badge>
              </div>

              {/* Time badge */}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  {formatTimeAgo(item.postedDate)}
                </Badge>
              </div>

              {/* Favorite button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToFavorites(item.id);
                }}
                className="absolute bottom-2 right-2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
              >
                <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
              </button>
            </div>

            <CardContent
              className="p-4 space-y-2"
              onClick={() => onViewDetails(item)}
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-lg font-bold text-primary">
                  ${item.price.toLocaleString()}
                </p>
              </div>

              {/* Key specs */}
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center">
                  <Battery className="w-3 h-3 mr-1" />
                  <span>{item.batteryHealth}% health</span>
                </div>
              </div>

              {/* Engagement stats */}
              <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{item.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-3 h-3" />
                    <span>{item.favorites}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.seller.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Call to action for non-logged users */}
      {!currentUser && (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">
              Want to see more fresh listings?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Create an account to get personalized recommendations and save
              your favorites.
            </p>
            <div className="flex gap-2 justify-center">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-primary/90">
                Sign Up Free
              </button>
              <button className="border border-primary text-primary px-4 py-2 rounded text-sm hover:bg-primary/5">
                Learn More
              </button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
