'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  X,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

export default function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.length >= 2) {
      setLoading(true);
      
      // Debounce API calls
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `/api/search/suggestions?q=${encodeURIComponent(query)}`
          );
          const data = await response.json();

          if (data.success) {
            setSuggestions(data.suggestions || []);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setLoading(false);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToRecentSearches = (searchQuery) => {
    const updated = [
      searchQuery,
      ...recentSearches.filter((s) => s !== searchQuery),
    ].slice(0, 5);
    
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    saveToRecentSearches(searchQuery.trim());
    setShowSuggestions(false);

    // Try to enhance the search with AI
    try {
      const response = await fetch('/api/search/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (data.success && data.enhanced) {
        const params = new URLSearchParams();
        params.set('search', searchQuery);

        // Apply AI-suggested filters
        if (data.enhanced.category && data.enhanced.categoryExists) {
          params.set('category', data.enhanced.category);
        }

        if (data.enhanced.suggestedPriceRange) {
          if (data.enhanced.suggestedPriceRange.min !== null) {
            params.set('minPrice', data.enhanced.suggestedPriceRange.min);
          }
          if (data.enhanced.suggestedPriceRange.max !== null) {
            params.set('maxPrice', data.enhanced.suggestedPriceRange.max);
          }
        }

        router.push(`/products?${params.toString()}`);
        
        // Show smart filter toast
        if (data.enhanced.category || data.enhanced.suggestedPriceRange) {
          toast.success('Smart filters applied! ✨', {
            description: 'We optimized your search with AI',
          });
        }
      } else {
        // Fallback to simple search
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      }
    } catch (error) {
      console.error('Error enhancing search:', error);
      // Fallback to simple search
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearRecentSearch = (search) => {
    const updated = recentSearches.filter((s) => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Search for products... (AI-powered)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="pl-12 pr-24 py-6 text-base rounded-full border-2 border-gray-200 focus:border-emerald-500 shadow-lg"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />}
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
          <Button
            onClick={() => handleSearch()}
            size="sm"
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-4"
          >
            Search
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (query.length >= 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          >
            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500">
                  <Sparkles className="h-4 w-4 text-emerald-600" />
                  AI-Powered Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-3 group"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                    <span className="text-gray-700 group-hover:text-emerald-700 font-medium">
                      {suggestion}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && query.length < 2 && (
              <div className="p-2 border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear All
                  </Button>
                </div>
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <button
                      onClick={() => handleSuggestionClick(search)}
                      className="flex-1 text-left text-gray-700 hover:text-emerald-700"
                    >
                      {search}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearRecentSearch(search);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {query.length >= 2 && !loading && suggestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No suggestions found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
