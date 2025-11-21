import { Clock } from "lucide-react";

export function NewestPosts({ onViewDetails, onAddToFavorites, currentUser }) {
  // No mock data - should fetch from API
  const newestPosts = [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Newest Posts</h2>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
            Just added
          </span>
        </div>
        <button className="text-sm text-blue-600 hover:underline">
          View all →
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {newestPosts.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <p>No recent posts available at the moment.</p>
            <p className="text-sm mt-2">Check back later for new listings!</p>
          </div>
        ) : (
          newestPosts.map((item) => (
            <div
              key={item.id}
              className="group hover:shadow-md transition-shadow cursor-pointer bg-white border rounded-lg overflow-hidden"
            >
              <div className="p-4">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-600">{item.price}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Call to action for non-logged users */}
      {!currentUser && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="font-semibold mb-2">
            Want to see more fresh listings?
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Create an account to get personalized recommendations and save your
            favorites.
          </p>
          <div className="flex gap-2 justify-center">
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
              Sign Up Free
            </button>
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-50">
              Learn More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
