import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Recycle, Menu, X, User, LogOut, Shield, LogIn, Leaf, Globe, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { localStorageManager } from "@/lib/storage";

export function Navigation() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorageManager.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState(localStorageManager.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(localStorageManager.isAdmin());

  useEffect(() => {
    // Update authentication status on location change
    const user = localStorageManager.getCurrentUser();
    const authenticated = localStorageManager.isAuthenticated();
    const admin = localStorageManager.isAdmin();
    
    setCurrentUser(user);
    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
  }, [location]);

  const handleLogout = () => {
    localStorageManager.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setLocation("/");
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/guide", label: "Guide" },
    { path: "/quiz", label: "Quiz" },
    { path: "/locator", label: "Locator" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  // Split navigation items for new layout
  const leftNavItems = navItems.slice(0, 3); // Home, Guide, Quiz
  const rightNavItems = navItems.slice(3); // Locator, Leaderboard

  return (
    <nav className="relative sticky top-0 z-50 overflow-hidden backdrop-blur-md">
      {/* Enhanced Creative Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
        {/* Primary gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/15 to-pink-500/10"></div>
        
        {/* Animated geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-4 left-8 w-20 h-20 bg-gradient-to-br from-cyan-400/25 to-blue-500/20 rounded-full animate-pulse blur-sm"></div>
          <div className="absolute top-8 right-12 w-10 h-10 bg-gradient-to-br from-pink-400/30 to-rose-500/25 rounded-full animate-bounce blur-sm" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-4 left-20 w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-orange-500/15 rounded-full animate-pulse blur-sm" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-6 right-8 w-8 h-8 bg-gradient-to-br from-emerald-400/30 to-green-500/25 rounded-full animate-bounce blur-sm" style={{animationDelay: '0.5s'}}></div>
          
          {/* Enhanced floating particles */}
          <div className="absolute top-2 left-1/4 w-3 h-3 bg-gradient-to-r from-white/50 to-cyan-200/40 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
          <div className="absolute bottom-3 left-3/4 w-4 h-4 bg-gradient-to-r from-white/40 to-purple-200/30 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-gradient-to-r from-pink-300/50 to-rose-200/40 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
          
          {/* Enhanced gradient waves */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent animate-pulse" style={{animationDuration: '4s'}}></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-cyan-200/5 to-transparent animate-pulse" style={{animationDuration: '6s', animationDelay: '2s'}}></div>
        </div>
        
        {/* Enhanced overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10"></div>
      </div>

      <div className="relative max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Left Navigation Items */}
          <div className="hidden md:flex items-center space-x-10 flex-1 justify-start">
            {leftNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative font-semibold text-lg tracking-wide transition-all duration-500 hover:scale-110 group ${
                  isActive(item.path)
                    ? "text-cyan-300 font-bold"
                    : "text-white/90 hover:text-cyan-200"
                }`}
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 -m-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Center - Logo extending slightly beyond frame */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <Link href="/" className="group" data-testid="link-home">
              <div className="relative">
                {/* Main logo container - extending slightly beyond normal bounds */}
                <div className="relative bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl p-4 md:p-5 shadow-2xl group-hover:shadow-cyan-400/30 transition-all duration-700 group-hover:scale-105 transform backdrop-blur-sm border border-white/20">
                  {/* Enhanced animated background shimmer */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/25 via-cyan-100/30 to-white/20 opacity-60 group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Logo Stack */}
                  <div className="relative flex flex-col items-center justify-center">
                    {/* Main Recycle Icon */}
                    <div className="relative mb-1">
                      <Recycle className="w-8 h-8 md:w-10 md:h-10 text-white relative z-10 motion-safe:group-hover:rotate-180 transition-transform motion-safe:duration-700 motion-reduce:duration-75" />
                      
                      {/* Orbiting icons */}
                      <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-yellow-300 animate-spin" style={{animationDuration: '3s'}} />
                      </div>
                      <div className="absolute -bottom-1 -left-1">
                        <Leaf className="w-3 h-3 md:w-4 md:h-4 text-green-300 animate-bounce" style={{animationDelay: '1s'}} />
                      </div>
                      <div className="absolute top-1/2 -right-3 transform -translate-y-1/2">
                        <Globe className="w-2 h-2 md:w-3 md:h-3 text-blue-300 animate-pulse" style={{animationDelay: '2s'}} />
                      </div>
                    </div>
                    
                    {/* Brand Name - Enhanced typography */}
                    <div className="text-center">
                      <span className="font-heading font-black text-xl md:text-3xl bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent group-hover:from-yellow-200 group-hover:via-white group-hover:to-cyan-200 transition-all duration-700 drop-shadow-2xl tracking-tight">
                        EcoSort
                      </span>
                      <div className="text-xs text-white/95 -mt-0.5 font-bold tracking-[0.2em] drop-shadow-lg">
                        SUSTAINABLE • FUTURE
                      </div>
                    </div>
                  </div>

                  {/* Floating elements around the logo */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <div className="absolute -bottom-2 left-1/4 transform">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{animationDelay: '0.8s'}}></div>
                  </div>
                  <div className="absolute -bottom-2 right-1/4 transform">
                    <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '1.4s'}}></div>
                  </div>
                </div>

                {/* Enhanced extended glow effects */}
                <div className="absolute inset-0 -m-3 bg-gradient-to-r from-cyan-500/20 via-purple-500/25 to-pink-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                <div className="absolute inset-0 -m-1 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
              </div>
            </Link>
          </div>

          {/* Right Navigation Items */}
          <div className="hidden md:flex items-center space-x-10 flex-1 justify-end">
            {rightNavItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative font-semibold text-lg tracking-wide transition-all duration-500 hover:scale-110 group ${
                  isActive(item.path)
                    ? "text-cyan-300 font-bold"
                    : "text-white/90 hover:text-cyan-200"
                }`}
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                <span className="relative z-10">{item.label}</span>
                {/* Enhanced hover effect */}
                <div className="absolute inset-0 -m-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
            
            {/* Authentication Section */}
            {isAuthenticated && currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    data-testid="button-user-menu"
                  >
                    <User className="w-4 h-4" />
                    <span className="ml-2 font-medium">{currentUser.username}</span>
                    {isAdmin && <Badge variant="secondary" className="ml-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none">Admin</Badge>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">{currentUser.username}</div>
                    <div className="text-muted-foreground text-xs">{currentUser.email}</div>
                    <div className="text-muted-foreground text-xs mt-1">
                      Level {currentUser.level} • {currentUser.score} points
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {/* Admin Link - Only show for admin users */}
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="w-full" data-testid="button-admin">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 border-none shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-105 font-semibold tracking-wide backdrop-blur-sm" data-testid="button-login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden relative z-20">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-white hover:text-cyan-200 transition-colors"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-br from-slate-900/98 via-purple-900/95 to-indigo-900/98 backdrop-blur-xl border-t border-white/20 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-6 pt-6 pb-8 space-y-4">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block w-full text-left px-5 py-4 rounded-xl font-medium tracking-wide transition-all duration-500 hover:scale-105 ${
                  isActive(item.path)
                    ? "text-cyan-300 bg-gradient-to-r from-white/15 to-cyan-500/10 font-bold shadow-lg border border-cyan-500/20"
                    : "text-white/90 hover:text-cyan-200 hover:bg-gradient-to-r hover:from-white/10 hover:to-white/5 hover:shadow-md"
                }`}
                style={{animationDelay: `${index * 100}ms`}}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Admin Link - Only show for admin users */}
            {isAdmin && (
              <Link href="/admin" className="block w-full">
                <Button 
                  className="w-full text-left mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="button-mobile-admin"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            
            {/* Enhanced Mobile Auth Section */}
            <div className="border-t border-gradient-to-r from-white/10 via-white/20 to-white/10 pt-6 mt-6">
              {isAuthenticated && currentUser ? (
                <>
                  <div className="px-5 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl mb-4 border border-white/10 shadow-lg">
                    <div className="font-semibold flex items-center text-white tracking-wide">
                      <User className="w-5 h-5 mr-3 text-cyan-300" />
                      {currentUser.username}
                      {isAdmin && <Badge variant="secondary" className="ml-3 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none">Admin</Badge>}
                    </div>
                    <div className="text-white/80 text-sm mt-2 ml-8 font-medium">
                      Level {currentUser.level} • {currentUser.score} points
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-white/10 border-white/30 text-white hover:bg-white/20 font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={handleLogout}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link href="/auth" className="block w-full">
                  <Button 
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold tracking-wide"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="button-mobile-login"
                  >
                    <LogIn className="w-5 h-5 mr-3" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
