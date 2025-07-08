
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
  X
} from 'lucide-react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ConstellationBackground } from '@/components/ConstellationBackground';
import { GlassmorphicCard } from '@/components/GlassmorphicCard';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState(null);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication
    setUser({ name: 'StarGazer User', username: '@staruser' });
    setCurrentView('dashboard');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (currentView === 'landing') {
    return (
      <ThemeProvider isDark={isDarkMode}>
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <ConstellationBackground />
          
          {/* Glassmorphic Navigation */}
          <nav className="fixed top-0 w-full z-50 backdrop-blur-lg bg-white/10 border-b border-white/20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Star className="w-8 h-8 text-yellow-400" />
                <span className="text-2xl font-bold text-white">StarGazer</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-white hover:bg-white/20"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={() => setCurrentView('auth')}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                >
                  Join StarGazer
                </Button>
              </div>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="flex items-center justify-center min-h-screen px-6">
            <div className="text-center max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 animate-fade-in">
                Connect Among the Stars
              </h1>
              <p className="text-xl md:text-2xl text-purple-200 mb-8 animate-fade-in">
                A cosmic social experience where your thoughts shine as bright as constellations
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                <Button
                  size="lg"
                  onClick={() => setCurrentView('auth')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 text-lg backdrop-blur-sm"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Join the Galaxy
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setAuthMode('login');
                    setCurrentView('auth');
                  }}
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg backdrop-blur-sm"
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

  if (currentView === 'auth') {
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
                    {authMode === 'login' ? 'Welcome Back' : 'Join StarGazer'}
                  </h2>
                  <p className="text-purple-200">
                    {authMode === 'login' 
                      ? 'Sign in to your cosmic journey' 
                      : 'Create your stellar profile'
                    }
                  </p>
                </div>

                <form onSubmit={handleAuth} className="space-y-6">
                  {authMode === 'signup' && (
                    <>
                      <div>
                        <Label htmlFor="fullName" className="text-white">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          placeholder="Your cosmic name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          placeholder="your@email.com"
                        />
                      </div>
                    </>
                  )}
                  
                  <div>
                    <Label htmlFor="username" className="text-white">
                      {authMode === 'login' ? 'Username or Email' : 'Username'}
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      placeholder={authMode === 'login' ? 'username or email' : '@yourusername'}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="text-white">Password</Label>
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
                    {authMode === 'login' ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="text-purple-300 hover:text-white transition-colors"
                  >
                    {authMode === 'login' 
                      ? "Don't have an account? Sign up" 
                      : "Already have an account? Sign in"
                    }
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setCurrentView('landing')}
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
      <div className={`min-h-screen transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950' 
          : 'bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100'
      }`}>
        {/* Header */}
        <header className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-500 ${
          isDarkMode 
            ? 'bg-black/20 border-white/10' 
            : 'bg-white/30 border-black/10'
        }`}>
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Star className={`w-8 h-8 ${isDarkMode ? 'text-yellow-400' : 'text-indigo-600'}`} />
                  <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-900'}`}>
                    StarGazer
                  </span>
                </div>
                
                <div className="relative">
                  <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    isDarkMode ? 'text-white/60' : 'text-black/60'
                  }`} />
                  <Input
                    placeholder="Search the galaxy..."
                    className={`pl-10 w-80 transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' 
                        : 'bg-black/5 border-black/20 text-black placeholder:text-black/60'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}
                >
                  <Home className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}
                >
                  <Bell className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}
                >
                  <MessageCircle className="w-5 h-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className={isDarkMode ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/10'}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>

                <Avatar>
                  <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    SU
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue="socials" className="space-y-8">
            <TabsList className={`grid w-full grid-cols-2 ${
              isDarkMode ? 'bg-white/10' : 'bg-black/5'
            }`}>
              <TabsTrigger value="socials" className={`${
                isDarkMode ? 'data-[state=active]:bg-white/20 text-white' : 'data-[state=active]:bg-white text-black'
              }`}>
                Socials
              </TabsTrigger>
              <TabsTrigger value="dashboard" className={`${
                isDarkMode ? 'data-[state=active]:bg-white/20 text-white' : 'data-[state=active]:bg-white text-black'
              }`}>
                My Dashboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="socials" className="space-y-8">
              {/* User Directory */}
              <section>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                            Cosmic User {i}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                            @cosmicuser{i}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex space-x-4 text-sm">
                          <span className={isDarkMode ? 'text-white/80' : 'text-black/80'}>
                            {Math.floor(Math.random() * 1000)} followers
                          </span>
                          <span className={isDarkMode ? 'text-white/80' : 'text-black/80'}>
                            {Math.floor(Math.random() * 500)} likes
                          </span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Follow
                      </Button>
                    </GlassmorphicCard>
                  ))}
                </div>
              </section>

              {/* Gaze Section */}
              <section>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                  Gaze
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
                            ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' 
                            : 'bg-black/5 border-black/20 text-black placeholder:text-black/60'
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
                            <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                              Cosmic User {i}
                            </h4>
                            <span className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                              @cosmicuser{i}
                            </span>
                            <span className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                              · 2h
                            </span>
                          </div>
                          <p className={`mb-4 ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                            Just witnessed the most beautiful constellation tonight. The universe never fails to amaze me! ✨🌟
                          </p>
                          <div className="flex items-center space-x-6">
                            <Button variant="ghost" size="sm" className={isDarkMode ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}>
                              <Heart className="w-4 h-4 mr-1" />
                              {Math.floor(Math.random() * 50)}
                            </Button>
                            <Button variant="ghost" size="sm" className={isDarkMode ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}>
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
                      <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                        StarGazer User
                      </h1>
                      <p className={`${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>@staruser</p>
                      <div className="flex space-x-6 mt-2">
                        <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                          <strong>128</strong> Following
                        </span>
                        <span className={`text-sm ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                          <strong>1.2K</strong> Followers
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Dashboard Tabs */}
              <Tabs defaultValue="playlists" className="space-y-6">
                <TabsList className={`${isDarkMode ? 'bg-white/10' : 'bg-black/5'}`}>
                  <TabsTrigger value="playlists" className={isDarkMode ? 'data-[state=active]:bg-white/20 text-white' : 'data-[state=active]:bg-white text-black'}>
                    My Playlists
                  </TabsTrigger>
                  <TabsTrigger value="videos" className={isDarkMode ? 'data-[state=active]:bg-white/20 text-white' : 'data-[state=active]:bg-white text-black'}>
                    My Videos
                  </TabsTrigger>
                  <TabsTrigger value="tweets" className={isDarkMode ? 'data-[state=active]:bg-white/20 text-white' : 'data-[state=active]:bg-white text-black'}>
                    My Tweets
                  </TabsTrigger>
                  <TabsTrigger value="liked" className={isDarkMode ? 'data-[state=active]:bg-white/20 text-white' : 'data-[state=active]:bg-white text-black'}>
                    Liked Videos
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="playlists">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          Cosmic Playlist {i}
                        </h4>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                          {Math.floor(Math.random() * 20)} videos
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="w-full">
                              Manage
                            </Button>
                          </DialogTrigger>
                          <DialogContent className={`${
                            isDarkMode ? 'bg-black/80' : 'bg-white/80'
                          } backdrop-blur-lg border-white/20`}>
                            <DialogHeader>
                              <DialogTitle className={isDarkMode ? 'text-white' : 'text-black'}>
                                Manage Playlist
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label className={isDarkMode ? 'text-white' : 'text-black'}>Playlist Name</Label>
                                <Input 
                                  defaultValue={`Cosmic Playlist ${i}`}
                                  className={`${
                                    isDarkMode 
                                      ? 'bg-white/10 border-white/20 text-white' 
                                      : 'bg-black/5 border-black/20 text-black'
                                  }`}
                                />
                              </div>
                              <div>
                                <Label className={isDarkMode ? 'text-white' : 'text-black'}>Description</Label>
                                <Textarea 
                                  placeholder="Describe your playlist..."
                                  className={`${
                                    isDarkMode 
                                      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/60' 
                                      : 'bg-black/5 border-black/20 text-black placeholder:text-black/60'
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
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          Stellar Journey {i}
                        </h4>
                        <div className="flex justify-between items-center mb-4">
                          <span className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                            {Math.floor(Math.random() * 1000)} views
                          </span>
                          <span className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
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
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
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
                            <p className={`mb-2 ${isDarkMode ? 'text-white/80' : 'text-black/80'}`}>
                              Exploring the cosmos tonight... The stars are telling amazing stories! 🌟✨ #StarGazing #CosmicJourney
                            </p>
                            <span className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-black/40'}`}>
                              {i}h ago
                            </span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Manage
                          </Button>
                        </div>
                        <div className="flex items-center space-x-6 text-sm">
                          <span className={isDarkMode ? 'text-white/60' : 'text-black/60'}>
                            <Heart className="w-4 h-4 inline mr-1" />
                            {Math.floor(Math.random() * 50)} likes
                          </span>
                          <span className={isDarkMode ? 'text-white/60' : 'text-black/60'}>
                            <MessageCircle className="w-4 h-4 inline mr-1" />
                            {Math.floor(Math.random() * 20)} replies
                          </span>
                        </div>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="liked">
                  <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                    Liked Videos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <GlassmorphicCard key={i} className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                        <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          Amazing Galaxy Tour {i}
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-white/60' : 'text-black/60'}`}>
                          by @cosmicuser{i}
                        </p>
                      </GlassmorphicCard>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
