import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Play,
  Heart,
  User,
  MessageCircle,
  ArrowLeft,
  UserPlus,
  Check,
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";
import { VideoPlayerModal } from "@/components/ui/VideoPlayerModal";

const ViewProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_BACKEND_API;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true); // You can get this from localStorage or context
  const [profileData, setProfileData] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("videos");

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Get current logged in user from localStorage
        const storedUser = localStorage.getItem("user");
        const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
        setCurrentUser(loggedInUser);

        // Fetch profile data
        const userResponse = await axios.get(
          `${apiUrl}/users/public-profile/${userId}`,
          {
            withCredentials: true,
          }
        );

        // Fetch user videos
        const videosResponse = await axios.get(
          `${apiUrl}/videos/public-videos/${userId}`,
          {
            withCredentials: true,
          }
        );

        // Fetch user tweets
        const tweetsResponse = await axios.get(
          `${apiUrl}/tweets/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        // Fetch user playlists
        const playlistsResponse = await axios.get(
          `${apiUrl}/playlist/user/${userId}`,
          {
            withCredentials: true,
          }
        );

        // Fetch follow stats
        const [followingRes, followersRes] = await Promise.all([
          axios.get(`${apiUrl}/subscriptions/u/${userId}`, {
            withCredentials: true,
          }),
          axios.get(`${apiUrl}/subscriptions/c/${userId}`, {
            withCredentials: true,
          }),
        ]);

        // Check if current user follows this profile
        if (loggedInUser) {
          const followers = followersRes.data.data || [];
          const isCurrentUserFollowing = followers.some(
            (follower: any) => follower._id === loggedInUser._id
          );
          setIsFollowing(isCurrentUserFollowing);
        }

        // Process playlists and fetch video details for each
        const playlistsRaw = Array.isArray(playlistsResponse.data.data)
          ? playlistsResponse.data.data
          : [];

        const playlistsWithVideos = await Promise.all(
          playlistsRaw.map(async (playlist: any) => {
            const videoIds = playlist.videos;
            if (!videoIds || videoIds.length === 0)
              return { ...playlist, videos: [] };

            const videoObjects = await Promise.all(
              videoIds.map((id: string) =>
                axios
                  .get(`${apiUrl}/videos/${id}`, { withCredentials: true })
                  .then((res) => res.data.data)
                  .catch(() => null)
              )
            );

            return { ...playlist, videos: videoObjects.filter(Boolean) };
          })
        );

        setProfileData({
          user: userResponse.data.data,
          videos: videosResponse.data.data?.videos || [],
          tweets: tweetsResponse.data.data || [],
          playlists: playlistsWithVideos,
          stats: {
            followers: followersRes.data.data?.length || 0,
            following: followingRes.data.data?.length || 0,
          },
        });
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId, apiUrl]);

  const handleVideoClick = (video: any) => {
    setSelectedVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleVideoModalClose = () => {
    setIsVideoModalOpen(false);
    setSelectedVideo(null);
  };

  const handleFollowUser = async () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate("/");
      return;
    }

    try {
      await axios.post(
        `${apiUrl}/subscriptions/c/${userId}`,
        {},
        { withCredentials: true }
      );

      // Toggle follow status optimistically
      setIsFollowing(!isFollowing);

      // Refresh followers count
      const followersRes = await axios.get(
        `${apiUrl}/subscriptions/c/${userId}`,
        {
          withCredentials: true,
        }
      );

      setProfileData((prev: any) => ({
        ...prev,
        stats: {
          ...prev.stats,
          followers: followersRes.data.data?.length || 0,
        },
      }));
    } catch (error) {
      console.error("Failed to update follow status:", error);
      alert("Failed to update follow status");
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div
          className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
              : "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100"
          }`}
        >
          <div className="animate-pulse text-center">
            <div className={isDarkMode ? "text-white/60" : "text-black/60"}>
              Loading profile...
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div
          className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
              : "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100"
          }`}
        >
          <div className="text-center">
            <div className={`text-red-500 mb-4`}>{error}</div>
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-purple-500 to-pink-500"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  const { user, videos, tweets, playlists, stats } = profileData;

  return (
    <ThemeProvider isDark={isDarkMode}>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
            : "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100"
        }`}
      >
        {/* Header with Back Button */}
        <header
          className={`sticky top-0 z-50 backdrop-blur-2xl border-none shadow-lg transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-black/10 via-purple-900/15 to-black/10 shadow-purple-500/5"
              : "bg-gradient-to-r from-white/20 via-blue-100/25 to-white/20 shadow-blue-500/5"
          }`}
        >
          <div className="container mx-auto px-8 py-5">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className={`rounded-full p-2 ${
                  isDarkMode
                    ? "text-white hover:bg-white/10"
                    : "text-black hover:bg-black/10"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <Star
                  className={`w-6 h-6 ${
                    isDarkMode ? "text-yellow-400" : "text-indigo-600"
                  }`}
                />
                <span
                  className={`text-xl font-bold ${
                    isDarkMode ? "text-white" : "text-indigo-900"
                  }`}
                >
                  Profile: {user.fullName || user.username}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Profile Header */}
          <GlassmorphicCard className="relative overflow-hidden mb-8">
            {/* Cover Image as background */}
            <div className="absolute inset-0 h-48 w-full overflow-hidden z-0">
              {user.coverImage ? (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
              )}
              {/* Overlay for better text visibility */}
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="relative z-10 p-6 pt-32">
              <div className="flex items-end justify-between">
                <div className="flex items-end space-x-6">
                  {/* Avatar */}
                  <Avatar className="w-24 h-24 border-4 border-white">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                      {user.fullName?.charAt(0) ||
                        user.username?.charAt(0) ||
                        "SG"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="pb-2">
                    <h1
                      className={`text-3xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      {user.fullName}
                    </h1>
                    <p
                      className={`${
                        isDarkMode ? "text-white/60" : "text-black/60"
                      }`}
                    >
                      @{user.username}
                    </p>
                    <div className="flex space-x-6 mt-2">
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-white/80" : "text-black/80"
                        }`}
                      >
                        <strong>{stats.following}</strong> Following
                      </span>
                      <span
                        className={`text-sm ${
                          isDarkMode ? "text-white/80" : "text-black/80"
                        }`}
                      >
                        <strong>{stats.followers}</strong> Followers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Follow button (only show if viewing someone else's profile) */}
                {currentUser && currentUser._id !== userId && (
                  <Button
                    className={`transition-all duration-300 ${
                      isFollowing
                        ? "bg-green-500 hover:bg-red-500 group"
                        : "premium-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    }`}
                    onClick={handleFollowUser}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-4 h-4 mr-2 group-hover:hidden" />
                        <UserPlus className="w-4 h-4 mr-2 hidden group-hover:block" />
                        <span className="group-hover:hidden">Following</span>
                        <span className="hidden group-hover:block">
                          Unfollow
                        </span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Follow
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </GlassmorphicCard>

          {/* Content Tabs */}
          <Tabs
            defaultValue="videos"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList
              className={`${isDarkMode ? "bg-white/10" : "bg-black/5"}`}
            >
              <TabsTrigger
                value="videos"
                className={
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="playlists"
                className={
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }
              >
                Playlists
              </TabsTrigger>
              <TabsTrigger
                value="tweets"
                className={
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }
              >
                Tweets
              </TabsTrigger>
            </TabsList>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Videos
              </h3>
              {videos.length === 0 ? (
                <div className="text-center py-10">
                  <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
                    No videos available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video: any) => (
                    <div
                      key={video._id}
                      className="p-4 cursor-pointer hover:scale-[1.03] transition-transform group"
                      onClick={() => handleVideoClick(video)}
                    >
                      <GlassmorphicCard>
                        {/* Thumbnail */}
                        <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {video.thumbnail ? (
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <Play className="w-12 h-12 text-white opacity-60" />
                          )}
                        </div>
                        {/* Title */}
                        <h4
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {video.title}
                        </h4>
                        {/* Description */}
                        <p
                          className={`text-sm mb-2 ${
                            isDarkMode ? "text-white/60" : "text-black/60"
                          }`}
                        >
                          {video.description}
                        </p>
                        {/* Views and Likes count */}
                        <div className="flex items-center space-x-4 text-sm mt-4">
                          <span
                            className={
                              isDarkMode ? "text-white/50" : "text-black/50"
                            }
                          >
                            {video.views || 0} views
                          </span>
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-pink-500" />
                            <span
                              className={
                                isDarkMode ? "text-white/50" : "text-black/50"
                              }
                            >
                              {video.likes || 0}
                            </span>
                          </span>
                        </div>
                      </GlassmorphicCard>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Playlists Tab */}
            <TabsContent value="playlists">
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Playlists
              </h3>
              {playlists.length === 0 ? (
                <div className="text-center py-10">
                  <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
                    No playlists available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {playlists.map((playlist: any) => (
                    <GlassmorphicCard key={playlist._id} className="p-4">
                      {/* Playlist Header */}
                      <div className="mb-4">
                        <h4
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          {playlist.name}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-white/60" : "text-black/60"
                          }`}
                        >
                          {Array.isArray(playlist.videos)
                            ? playlist.videos.length
                            : 0}{" "}
                          videos
                        </p>
                        {playlist.description && (
                          <p
                            className={`mt-2 text-sm ${
                              isDarkMode ? "text-white/80" : "text-black/80"
                            }`}
                          >
                            {playlist.description}
                          </p>
                        )}
                      </div>

                      {/* Videos List */}
                      {Array.isArray(playlist.videos) &&
                        playlist.videos.length > 0 && (
                          <div className="space-y-2">
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {playlist.videos.map((video: any) => (
                                <div
                                  key={video._id}
                                  className="flex items-center justify-between bg-black/10 rounded px-2 py-1 cursor-pointer hover:bg-black/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVideoClick(video);
                                  }}
                                >
                                  <div className="flex items-center space-x-2">
                                    <Play className="w-4 h-4" />
                                    <span
                                      className={
                                        isDarkMode ? "text-white" : "text-black"
                                      }
                                    >
                                      {video.title}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </GlassmorphicCard>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Tweets Tab */}
            <TabsContent value="tweets">
              <h3
                className={`text-xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Tweets
              </h3>
              {tweets.length === 0 ? (
                <div className="text-center py-10">
                  <p className={isDarkMode ? "text-white/60" : "text-black/60"}>
                    No tweets available.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tweets.map((tweet: any) => (
                    <GlassmorphicCard key={tweet._id} className="p-6">
                      <div className="flex items-start space-x-4">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {user.fullName?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4
                              className={`font-semibold ${
                                isDarkMode ? "text-white" : "text-black"
                              }`}
                            >
                              {user.fullName}
                            </h4>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              @{user.username}
                            </span>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-white/40" : "text-black/40"
                              }`}
                            >
                              · {new Date(tweet.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p
                            className={`mb-4 ${
                              isDarkMode ? "text-white/80" : "text-black/80"
                            }`}
                          >
                            {tweet.content}
                          </p>
                          <div className="flex items-center space-x-6">
                            <div
                              className={`flex items-center space-x-1 ${
                                isDarkMode ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              <Heart className="w-4 h-4" />
                              <span>{tweet.likes || 0}</span>
                            </div>
                            <div
                              className={`flex items-center space-x-1 ${
                                isDarkMode ? "text-white/60" : "text-black/60"
                              }`}
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>{tweet.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Video Player Modal */}
        {selectedVideo && (
          <VideoPlayerModal
            open={isVideoModalOpen}
            onClose={handleVideoModalClose}
            video={selectedVideo}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default ViewProfile;
