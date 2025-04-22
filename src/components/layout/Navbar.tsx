import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";

export default function Navbar() {
  const { isLoggedIn, userType, userData, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isSearchOpen &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative h-8 w-8 overflow-hidden">
            <div className="absolute inset-0 bg-nature-600 rounded-full"></div>
            <div className="absolute inset-[2px] bg-white rounded-full"></div>
            <div className="absolute inset-[4px] bg-nature-600 rounded-full opacity-80"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">Green Bridge</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/GreenBridge/" className="nav-link font-medium">Home</Link>
          <Link to="/products" className="nav-link font-medium">Products</Link>
          <Link to="/farmers" className="nav-link font-medium">Farmers</Link>
          <Link to="/about" className="nav-link font-medium">About Us</Link>
          <Link to="/contact" className="nav-link font-medium">Contact</Link>
        </nav>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="relative">
            <button 
              className={cn(
                "hover:text-nature-600 transition-colors",
                isSearchOpen && "text-nature-600"
              )} 
              aria-label="Search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>
            {isSearchOpen && (
              <form 
                onSubmit={handleSearchSubmit}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-64 animate-in slide-in-from-right-8"
              >
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-8 pl-4 py-2 w-full"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nature-600"
                >
                  <Search size={16} />
                </button>
              </form>
            )}
          </div>
          
          {isLoggedIn && userData ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-0 hover:bg-transparent">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{userData.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/account" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                {userType === 'farmer' && (
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>Manage Products</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/account" className="hover:text-nature-600 transition-colors" aria-label="Account">
              <User size={20} />
            </Link>
          )}
          
          <Link to="/cart" className="hover:text-nature-600 transition-colors relative" aria-label="Cart">
            <ShoppingCart size={20} />
            {userData && (
              <span className="absolute -top-2 -right-2 bg-nature-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {userData.cart.items}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-gray-800 hover:text-nature-600 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 top-16 bg-white z-40 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col p-8 space-y-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-8"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-nature-600"
            >
              <Search size={16} />
            </button>
          </form>

          <Link to="/" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/products" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Products</Link>
          <Link to="/farmers" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Farmers</Link>
          <Link to="/about" className="font-medium text-lg" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link to="/contact" className="font-medium text-lg" onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className="pt-6 border-t border-gray-100 flex justify-around">
            {isLoggedIn && userData ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback>{getInitials(userData.name)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{userData.name}</span>
                  <button 
                    onClick={logout}
                    className="text-sm text-red-600 text-left hover:text-red-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/account" className="p-2 hover:text-nature-600 transition-colors" onClick={() => setIsOpen(false)} aria-label="Account">
                <User size={20} />
                <span className="text-sm ml-1">Account</span>
              </Link>
            )}
            <Link to="/cart" className="p-2 hover:text-nature-600 transition-colors" onClick={() => setIsOpen(false)} aria-label="Cart">
              <ShoppingCart size={20} />
              <span className="text-sm ml-1">Cart ({userData?.cart.items || 0})</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
