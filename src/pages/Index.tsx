import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  Star,
  Moon,
  Sun,
  Search,
  Home,
  Bell,
  MessageCircle,
  User,
  Settings,
  LogOut,
  Heart,
  Play,
  Upload,
  Plus,
  Edit3,
  X,
  Shield,
  Palette,
  Volume2,
  Lock,
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ConstellationBackground } from "@/components/ConstellationBackground";
import { GlassmorphicCard } from "@/components/GlassmorphicCard";

const Index = () => {
  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const apiUrl = import.meta.env.VITE_BACKEND_API;
  const [currentView, setCurrentView] = useState<
    "landing" | "auth" | "dashboard"
  >("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("socials");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (user) {
      console.log("User updated:", user);
    }
  }, [user]);

  const handleLike = (postId: number) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  const handleFollow = (userId: number) => {
    const newFollowedUsers = new Set(followedUsers);
    if (newFollowedUsers.has(userId)) {
      newFollowedUsers.delete(userId);
    } else {
      newFollowedUsers.add(userId);
    }
    setFollowedUsers(newFollowedUsers);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formMode = authMode; // 'login' or 'signup'

    const username = (form.querySelector("#username") as HTMLInputElement)
      ?.value;
    const password = (form.querySelector("#password") as HTMLInputElement)
      ?.value;
    const email = (form.querySelector("#email") as HTMLInputElement)?.value;

    if (formMode === "signup") {
      const fullName = (form.querySelector("#fullName") as HTMLInputElement)
        ?.value;
      const avatarFile = (form.querySelector("#avatar") as HTMLInputElement)
        ?.files?.[0];
      const coverFile = (form.querySelector("#coverImage") as HTMLInputElement)
        ?.files?.[0];

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverFile) formData.append("coverImage", coverFile);

      try {
        const response = await axios.post(
          `${apiUrl}/users/register`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        const userData = response.data.data;
        setUser(userData);

        setCurrentView("dashboard");
      } catch (error) {
        console.error("Signup failed:", error);
        // optionally show error message
      }
    } else {
      // Login
      try {
        const response = await axios.post(
          `${apiUrl}/users/login`,
          {
            email,
            username,
            password,
          },
          { withCredentials: true }
        );

        const userData = response.data.data.user;
        setUser(userData);
        //console.log(userData);
        setCurrentView("dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        // optionally show error message
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${apiUrl}/users/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setUser(null);
      setCurrentView("landing");
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
      setCurrentView("landing");
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = fullNameRef.current?.value;
    const email = emailRef.current?.value;

    try {
      const response = await axios.patch(
        `${apiUrl}/users/update-account`,
        {
          fullName,
          email,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setUser((prev) => ({
          ...prev,
          fullName,
          email,
        }));
        console.log("Update successful:", response.data);
      }
      // Show success notification/toast if needed
    } catch (error) {
      if (error.response?.status === 401) {
        // Handle unauthorized - maybe redirect to login
        setCurrentView("auth");
      }
      console.error("Error updating account:", error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const oldPassword = (
      form.querySelector("#currentPassword") as HTMLInputElement
    )?.value;
    const newPassword = (form.querySelector("#newPassword") as HTMLInputElement)
      ?.value;
    const confirmPassword = (
      form.querySelector("#confirmPassword") as HTMLInputElement
    )?.value;

    if (newPassword !== confirmPassword) {
      // You can show a toast or alert here
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/users/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        // Optionally show success notification
        alert("Password changed successfully.");
      }
    } catch (error) {
      // Optionally show error notification
      alert("Failed to change password.");
      console.error("Error changing password:", error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (currentView === "landing") {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ConstellationBackground />

          {/* Premium Glassmorphic Navigation */}
          <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border-none shadow-lg shadow-black/5">
            <div className="container mx-auto px-8 py-5 flex justify-between items-center">
              <div className="flex items-center space-x-3 animate-spring-up">
                <Star className="w-8 h-8 text-yellow-400 animate-twinkle" />
                <span className="text-2xl font-bold text-white shimmer-text tracking-wide">
                  StarGazer
                </span>
              </div>

              <div className="flex items-center space-x-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full p-3 backdrop-blur-sm bg-white/10 text-white hover:bg-white/20 transition-all duration-500 hover:scale-105 border-none"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>
                <Button
                  onClick={() => setCurrentView("auth")}
                  className="rounded-full px-6 py-3 backdrop-blur-sm bg-gradient-to-r from-white/15 to-white/25 hover:from-white/25 hover:to-white/35 text-white border-none transition-all duration-500 hover:scale-105 shadow-lg shadow-white/10"
                >
                  Join StarGazer
                </Button>
              </div>
            </div>
          </nav>

          {/* Hero Section with Kinetic Typography */}
          <div className="flex items-center justify-center min-h-screen px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-kinetic-text">
                <span className="inline-block shimmer-text">Connect</span>{" "}
                <span
                  className="inline-block shimmer-text"
                  style={{ animationDelay: "0.2s" }}
                >
                  Among
                </span>{" "}
                <span
                  className="inline-block shimmer-text"
                  style={{ animationDelay: "0.4s" }}
                >
                  the
                </span>{" "}
                <span
                  className="inline-block shimmer-text text-yellow-400"
                  style={{ animationDelay: "0.6s" }}
                >
                  Stars
                </span>
              </h1>
              <p
                className="text-xl md:text-2xl text-purple-200 mb-8 animate-spring-up"
                style={{ animationDelay: "0.8s" }}
              >
                A cosmic social experience where your thoughts shine as bright
                as constellations
              </p>

              <div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                style={{ animationDelay: "1s" }}
              >
                <Button
                  size="lg"
                  onClick={() => setCurrentView("auth")}
                  className="premium-button glass-panel bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg backdrop-blur-sm hover-lift animate-spring-up"
                >
                  <Star className="w-5 h-5 mr-2 animate-twinkle" />
                  Join the Galaxy
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setAuthMode("login");
                    setCurrentView("auth");
                  }}
                  className="glass-button border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm animate-spring-up"
                  style={{ animationDelay: "1.1s" }}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  if (currentView === "auth") {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ConstellationBackground />

          <div className="flex items-center justify-center min-h-screen px-6">
            <GlassmorphicCard className="w-full max-w-md">
              <div className="p-8">
                <div className="text-center mb-8">
                  <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {authMode === "login" ? "Welcome Back" : "Join StarGazer"}
                  </h2>
                  <p className="text-purple-200">
                    {authMode === "login"
                      ? "Sign in to your cosmic journey"
                      : "Create your stellar profile"}
                  </p>
                </div>

                {/* Login/SignUp form submission */}
                <form onSubmit={handleAuth} className="space-y-6">
                  {authMode === "signup" && (
                    <>
                      <div>
                        <Label htmlFor="fullName" className="text-white">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          placeholder="Your cosmic name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <Label htmlFor="avatar" className="text-white">
                          Avatar Image
                        </Label>
                        <Input
                          id="avatar"
                          type="file"
                          accept="image/*"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </div>

                      <div>
                        <Label htmlFor="coverImage" className="text-white">
                          Cover Image (optional)
                        </Label>
                        <Input
                          id="coverImage"
                          type="file"
                          accept="image/*"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="username" className="text-white">
                      {authMode === "login" ? "Username" : "Username"}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder={
                        authMode === "login" ? "username" : "@yourusername"
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder="Enter your password"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                  >
                    {authMode === "login" ? "Sign In" : "Create Account"}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() =>
                      setAuthMode(authMode === "login" ? "signup" : "login")
                    }
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    {authMode === "login"
                      ? "Don't have an account? Sign up"
                      : "Already have an account? Sign in"}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCurrentView("landing")}
                    className="text-purple-300 hover:text-white transition-colors text-sm"
                  >
                    ← Back to landing
                  </button>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </ThemeProvider>
    );
  }

  // Dashboard View
  return (
    <ThemeProvider isDark={isDarkMode}>
      <div
        className={`min-h-screen transition-all duration-500 ${
          isDarkMode
            ? "bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
            : "bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100"
        }`}
      >
        {/* Premium Glassmorphic Header */}
        <header
          className={`sticky top-0 z-50 backdrop-blur-2xl border-none shadow-lg transition-all duration-500 ${
            isDarkMode
              ? "bg-gradient-to-r from-black/10 via-purple-900/15 to-black/10 shadow-purple-500/5"
              : "bg-gradient-to-r from-white/20 via-blue-100/25 to-white/20 shadow-blue-500/5"
          }`}
        >
          <div className="container mx-auto px-8 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <Star
                    className={`w-8 h-8 ${
                      isDarkMode ? "text-yellow-400" : "text-indigo-600"
                    }`}
                  />
                  <span
                    className={`text-2xl font-bold tracking-wide ${
                      isDarkMode ? "text-white" : "text-indigo-900"
                    }`}
                  >
                    StarGazer
                  </span>
                </div>

                <div className="relative">
                  <Search
                    className={`w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? "text-white/60" : "text-black/60"
                    }`}
                  />
                  <Input
                    placeholder="Search the galaxy..."
                    className={`pl-12 w-96 h-12 rounded-full transition-all duration-300 border-none ${
                      isDarkMode
                        ? "bg-white/10 text-white placeholder:text-white/60 backdrop-blur-sm focus:bg-white/15"
                        : "bg-black/5 text-black placeholder:text-black/60 backdrop-blur-sm focus:bg-black/10"
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-3 backdrop-blur-sm ${
                    isDarkMode
                      ? "text-white hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                  } border-none transition-all duration-300 hover:scale-105`}
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full p-3 backdrop-blur-sm ${
                    isDarkMode
                      ? "text-white hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                  } border-none transition-all duration-300 hover:scale-105`}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={`rounded-full p-3 backdrop-blur-sm ${
                    isDarkMode
                      ? "text-white hover:bg-white/10"
                      : "text-black hover:bg-black/10"
                  } border-none transition-all duration-300 hover:scale-105`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm">
                          SG
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className={`w-64 rounded-2xl border-none shadow-2xl ${
                      isDarkMode
                        ? "bg-black/60 backdrop-blur-2xl text-white"
                        : "bg-white/60 backdrop-blur-2xl text-black"
                    }`}
                    align="end"
                    forceMount
                  >
                    <DropdownMenuItem
                      className="flex items-center gap-3 cursor-pointer p-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="w-5 h-5" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center gap-3 cursor-pointer p-4 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-8"
          >
            <TabsList
              className={`grid w-full grid-cols-4 ${
                isDarkMode
                  ? "bg-white/10 backdrop-blur-sm"
                  : "bg-black/5 backdrop-blur-sm"
              }`}
            >
              <TabsTrigger
                value="socials"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Socials
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className={`${
                  isDarkMode
                    ? "data-[state=active]:bg-white/20 text-white"
                    : "data-[state=active]:bg-white text-black"
                }`}
              >
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="socials" className="space-y-8">
              {/* User Directory */}
              <section>
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Stellar Community
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <GlassmorphicCard key={i} className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            U{i}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3
                            className={`font-semibold ${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            Cosmic User {i}
                          </h3>
                          <p
                            className={`text-sm ${
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }`}
                          >
                            @cosmicuser{i}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4 text-sm">
                          <span
                            className={
                              isDarkMode ? "text-white/80" : "text-black/80"
                            }
                          >
                            {Math.floor(Math.random() * 1000)} followers
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-white/80" : "text-black/80"
                            }
                          >
                            {Math.floor(Math.random() * 500)} likes
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleFollow(i)}
                        className={`w-full transition-all duration-300 hover-lift ${
                          followedUsers.has(i)
                            ? "bg-green-500 hover:bg-green-600 text-white"
                            : "premium-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        }`}
                      >
                        {followedUsers.has(i) ? "✓ Following" : "Follow"}
                      </Button>
                    </GlassmorphicCard>
                  ))}
                </div>
              </section>

              {/* GAZE and Vidss Sections Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gaze Section */}
                <section>
                  <h2
                    className={`text-2xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    GAZE
                  </h2>

                  {/* Post Input */}
                  <GlassmorphicCard className="p-6 mb-6">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          SU
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="What's on your mind? Share your cosmic thoughts..."
                          className={`resize-none ${
                            isDarkMode
                              ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                              : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                          }`}
                        />
                        <div className="flex justify-end mt-3">
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>

                  {/* Posts Feed */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <GlassmorphicCard key={i} className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              U{i}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4
                                className={`font-semibold ${
                                  isDarkMode ? "text-white" : "text-black"
                                }`}
                              >
                                Cosmic User {i}
                              </h4>
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-white/60" : "text-black/60"
                                }`}
                              >
                                @cosmicuser{i}
                              </span>
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-white/40" : "text-black/40"
                                }`}
                              >
                                · 2h
                              </span>
                            </div>
                            <p
                              className={`mb-4 ${
                                isDarkMode ? "text-white/80" : "text-black/80"
                              }`}
                            >
                              Just witnessed the most beautiful constellation
                              tonight. The universe never fails to amaze me!
                              ✨🌟
                            </p>
                            <div className="flex items-center space-x-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(i)}
                                className={`transition-all duration-300 ${
                                  likedPosts.has(i)
                                    ? `text-red-500 hover:text-red-600 ${
                                        isDarkMode ? "" : "hover:text-red-700"
                                      }`
                                    : `${
                                        isDarkMode
                                          ? "text-white/60 hover:text-white"
                                          : "text-black/60 hover:text-black"
                                      }`
                                }`}
                              >
                                <Heart
                                  className={`w-4 h-4 mr-1 ${
                                    likedPosts.has(i)
                                      ? "fill-current animate-heart-pulse"
                                      : ""
                                  }`}
                                />
                                {Math.floor(Math.random() * 50) +
                                  (likedPosts.has(i) ? 1 : 0)}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={
                                  isDarkMode
                                    ? "text-white/60 hover:text-white"
                                    : "text-black/60 hover:text-black"
                                }
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {Math.floor(Math.random() * 20)}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </section>

                {/* Vidss Section */}
                <section>
                  <h2
                    className={`text-2xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Vidss
                  </h2>

                  {/* Video Upload */}
                  <GlassmorphicCard className="p-6 mb-6">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            SU
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Input
                            placeholder="Share a stellar video..."
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Video
                        </Button>
                      </div>
                    </div>
                  </GlassmorphicCard>

                  {/* Video Feed */}
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <GlassmorphicCard key={i} className="p-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                              V{i}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4
                                className={`font-semibold ${
                                  isDarkMode ? "text-white" : "text-black"
                                }`}
                              >
                                Video Creator {i}
                              </h4>
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-white/60" : "text-black/60"
                                }`}
                              >
                                @creator{i}
                              </span>
                              <span
                                className={`text-sm ${
                                  isDarkMode ? "text-white/40" : "text-black/40"
                                }`}
                              >
                                · 1h
                              </span>
                            </div>
                            <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                            <p
                              className={`mb-4 ${
                                isDarkMode ? "text-white/80" : "text-black/80"
                              }`}
                            >
                              Stellar Journey Episode {i} - Exploring the cosmos
                              beyond imagination! 🚀
                            </p>
                            <div className="flex items-center space-x-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(i + 10)}
                                className={`transition-all duration-300 ${
                                  likedPosts.has(i + 10)
                                    ? `text-red-500 hover:text-red-600 ${
                                        isDarkMode ? "" : "hover:text-red-700"
                                      }`
                                    : `${
                                        isDarkMode
                                          ? "text-white/60 hover:text-white"
                                          : "text-black/60 hover:text-black"
                                      }`
                                }`}
                              >
                                <Heart
                                  className={`w-4 h-4 mr-1 ${
                                    likedPosts.has(i + 10)
                                      ? "fill-current animate-heart-pulse"
                                      : ""
                                  }`}
                                />
                                {Math.floor(Math.random() * 100) +
                                  (likedPosts.has(i + 10) ? 1 : 0)}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={
                                  isDarkMode
                                    ? "text-white/60 hover:text-white"
                                    : "text-black/60 hover:text-black"
                                }
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                {Math.floor(Math.random() * 50)}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={
                                  isDarkMode
                                    ? "text-white/60 hover:text-white"
                                    : "text-black/60 hover:text-black"
                                }
                              >
                                <Volume2 className="w-4 h-4 mr-1" />
                                {Math.floor(Math.random() * 1000)}K
                              </Button>
                            </div>
                          </div>
                        </div>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </section>
              </div>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-8">
              {/* Cover Header */}
              <GlassmorphicCard className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
                <div className="p-6">
                  <div className="flex items-end space-x-6 -mt-16">
                    <Avatar className="w-24 h-24 border-4 border-white">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                        SU
                      </AvatarFallback>
                    </Avatar>
                    <div className="pb-2">
                      <h1
                        className={`text-3xl font-bold ${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        StarGazer User
                      </h1>
                      <p
                        className={`${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        @staruser
                      </p>
                      <div className="flex space-x-6 mt-2">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>128</strong> Following
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>1.2K</strong> Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Dashboard Tabs */}
              <Tabs defaultValue="playlists" className="space-y-6">
                <TabsList
                  className={`${isDarkMode ? "bg-white/10" : "bg-black/5"}`}
                >
                  <TabsTrigger
                    value="playlists"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    My Playlists
                  </TabsTrigger>
                  <TabsTrigger
                    value="videos"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    My Videos
                  </TabsTrigger>
                  <TabsTrigger
                    value="tweets"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    My Tweets
                  </TabsTrigger>
                  <TabsTrigger
                    value="liked"
                    className={
                      isDarkMode
                        ? "data-[state=active]:bg-white/20 text-white"
                        : "data-[state=active]:bg-white text-black"
                    }
                  >
                    Liked Videos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="playlists">
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      My Playlists
                    </h3>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Playlist
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <GlassmorphicCard key={i} className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4"></div>
                        <h4
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          Cosmic Playlist {i}
                        </h4>
                        <p
                          className={`text-sm mb-4 ${
                            isDarkMode ? "text-white/60" : "text-black/60"
                          }`}
                        >
                          {Math.floor(Math.random() * 20)} videos
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                            >
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent
                            className={`${
                              isDarkMode ? "bg-black/80" : "bg-white/80"
                            } backdrop-blur-lg border-white/20`}
                          >
                            <DialogHeader>
                              <DialogTitle
                                className={
                                  isDarkMode ? "text-white" : "text-black"
                                }
                              >
                                Manage Playlist
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label
                                  className={
                                    isDarkMode ? "text-white" : "text-black"
                                  }
                                >
                                  Playlist Name
                                </Label>
                                <Input
                                  defaultValue={`Cosmic Playlist ${i}`}
                                  className={`${
                                    isDarkMode
                                      ? "bg-white/10 border-white/20 text-white"
                                      : "bg-black/5 border-black/20 text-black"
                                  }`}
                                />
                              </div>
                              <div>
                                <Label
                                  className={
                                    isDarkMode ? "text-white" : "text-black"
                                  }
                                >
                                  Description
                                </Label>
                                <Textarea
                                  placeholder="Describe your playlist..."
                                  className={`${
                                    isDarkMode
                                      ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                      : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                                  }`}
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline">Cancel</Button>
                                <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                                  Save Changes
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="videos">
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      My Videos
                    </h3>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                      <GlassmorphicCard key={i} className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <h4
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          Stellar Journey {i}
                        </h4>
                        <div className="flex justify-between items-center mb-4">
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }`}
                          >
                            {Math.floor(Math.random() * 1000)} views
                          </span>
                          <span
                            className={`text-sm ${
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }`}
                          >
                            {Math.floor(Math.random() * 100)} likes
                          </span>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          Manage
                        </Button>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="tweets">
                  <div className="flex justify-between items-center mb-6">
                    <h3
                      className={`text-xl font-bold ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      My Tweets
                    </h3>
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Edit3 className="w-4 h-4 mr-2" />
                      New Tweet
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <GlassmorphicCard key={i} className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p
                              className={`mb-2 ${
                                isDarkMode ? "text-white/80" : "text-black/80"
                              }`}
                            >
                              Exploring the cosmos tonight... The stars are
                              telling amazing stories! 🌟✨ #StarGazing
                              #CosmicJourney
                            </p>
                            <span
                              className={`text-sm ${
                                isDarkMode ? "text-white/40" : "text-black/40"
                              }`}
                            >
                              {i}h ago
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <span
                            className={
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }
                          >
                            <Heart className="w-4 h-4 inline mr-1" />
                            {Math.floor(Math.random() * 50)} likes
                          </span>
                          <span
                            className={
                              isDarkMode ? "text-white/60" : "text-black/60"
                            }
                          >
                            <MessageCircle className="w-4 h-4 inline mr-1" />
                            {Math.floor(Math.random() * 20)} replies
                          </span>
                        </div>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="liked">
                  <h3
                    className={`text-xl font-bold mb-6 ${
                      isDarkMode ? "text-white" : "text-black"
                    }`}
                  >
                    Liked Videos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <GlassmorphicCard key={i} className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <h4
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-white" : "text-black"
                          }`}
                        >
                          Amazing Galaxy Tour {i}
                        </h4>
                        <p
                          className={`text-sm ${
                            isDarkMode ? "text-white/60" : "text-black/60"
                          }`}
                        >
                          by @cosmicuser{i}
                        </p>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="profile" className="space-y-8">
              {/* Profile Header */}
              <GlassmorphicCard className="relative overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600"></div>
                <div className="p-6">
                  <div className="flex items-end space-x-6 -mt-16">
                    <Avatar className="w-24 h-24 border-4 border-white">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                        SG
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
                        {user.username}
                      </p>
                      <div className="flex space-x-6 mt-2">
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>128</strong> Following
                        </span>
                        <span
                          className={`text-sm ${
                            isDarkMode ? "text-white/80" : "text-black/80"
                          }`}
                        >
                          <strong>1.2K</strong> Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Profile Edit Section */}
              <GlassmorphicCard className="p-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Edit Profile
                </h2>
                <div className="space-y-6">
                  <form onSubmit={handleUpdateAccount}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label
                          className={isDarkMode ? "text-white" : "text-black"}
                        >
                          Full Name
                        </Label>
                        <Input
                          defaultValue={user.fullName}
                          ref={fullNameRef}
                          className={
                            isDarkMode
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-black/5 border-black/20 text-black"
                          }
                        />
                      </div>
                      <div>
                        <Label
                          className={isDarkMode ? "text-white" : "text-black"}
                        >
                          Email
                        </Label>
                        <Input
                          defaultValue={user.email}
                          type="email"
                          ref={emailRef}
                          className={
                            isDarkMode
                              ? "bg-white/10 border-white/20 text-white"
                              : "bg-black/5 border-black/20 text-black"
                          }
                        />
                      </div>
                      <div className="flex justify-end space-x-4 col-span-full">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </form>

                  <div>
                    <h3
                      className={`text-lg font-semibold mb-4 ${
                        isDarkMode ? "text-white" : "text-black"
                      }`}
                    >
                      Change Password
                    </h3>
                    <form onSubmit={handleChangePassword}>
                      <div className="space-y-4">
                        <div>
                          <Label
                            className={`${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            Current Password
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder="Enter current password"
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                        <div>
                          <Label
                            className={`${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            New Password
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                        <div>
                          <Label
                            className={`${
                              isDarkMode ? "text-white" : "text-black"
                            }`}
                          >
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            className={`${
                              isDarkMode
                                ? "bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                : "bg-black/5 border-black/20 text-black placeholder:text-black/60"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-4 mt-4">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </GlassmorphicCard>
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-black"
                }`}
              >
                Settings
              </h2>

              {/* General Settings */}
              <GlassmorphicCard className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  <Settings className="w-5 h-5 inline mr-2" />
                  General
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Dark Mode
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Privacy Settings */}
              <GlassmorphicCard className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  <Shield className="w-5 h-5 inline mr-2" />
                  Privacy & Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Private Account
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Only followers can see your posts
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Show Online Status
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Let others see when you're online
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Two-Factor Authentication
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Lock className="w-4 h-4 mr-2" />
                      Setup
                    </Button>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Notification Settings */}
              <GlassmorphicCard className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  <Bell className="w-5 h-5 inline mr-2" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Push Notifications
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Receive notifications on your device
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Email Notifications
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Get updates via email
                      </p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        className={`${
                          isDarkMode ? "text-white" : "text-black"
                        }`}
                      >
                        Sound Effects
                      </Label>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-white/60" : "text-black/60"
                        }`}
                      >
                        Play sounds for notifications
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Account Actions */}
              <GlassmorphicCard className="p-6">
                <h3
                  className={`text-lg font-semibold mb-4 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  Account Actions
                </h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Export Data
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-500 hover:text-red-600"
                  >
                    Delete Account
                  </Button>
                </div>
              </GlassmorphicCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
