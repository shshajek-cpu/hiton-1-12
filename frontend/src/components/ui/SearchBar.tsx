import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';
import { theme } from '@/lib/theme';

export interface SearchSuggestion {
  id: string;
  text: string;
  type?: 'recent' | 'trending' | 'suggestion';
  metadata?: string;
}

export interface SearchBarProps {
  placeholder?: string;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  onSearch: (value: string) => void;
  onSuggestionClick?: (suggestion: SearchSuggestion) => void;
  loading?: boolean;
  showRecentSearches?: boolean;
  maxRecentSearches?: number;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '캐릭터 이름 또는 서버 검색...',
  suggestions = [],
  recentSearches: externalRecentSearches,
  onSearch,
  onSuggestionClick,
  loading = false,
  showRecentSearches = true,
  maxRecentSearches = 5,
  size = 'md',
  fullWidth = false,
  autoFocus = false,
}) => {
  const [value, setValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [internalRecentSearches, setInternalRecentSearches] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recentSearches = externalRecentSearches || internalRecentSearches;

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchValue: string) => {
    if (!searchValue.trim()) return;

    onSearch(searchValue);

    // Add to recent searches if not externally managed
    if (!externalRecentSearches && showRecentSearches) {
      setInternalRecentSearches(prev => {
        const newRecent = [searchValue, ...prev.filter(s => s !== searchValue)];
        return newRecent.slice(0, maxRecentSearches);
      });
    }

    setValue('');
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(value);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setValue(suggestion.text);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      handleSearch(suggestion.text);
    }
  };

  const handleRecentClick = (recent: string) => {
    setValue(recent);
    handleSearch(recent);
  };

  const clearRecentSearches = () => {
    setInternalRecentSearches([]);
  };

  const filteredSuggestions = suggestions.filter(s =>
    s.text.toLowerCase().includes(value.toLowerCase())
  );

  const showSuggestions = showDropdown && (filteredSuggestions.length > 0 || recentSearches.length > 0);

  return (
    <div ref={wrapperRef} className={`search-bar ${fullWidth ? 'full-width' : ''}`}>
      <div className={`search-input-container ${size}`}>
        <div className="search-icon">
          <Search size={getSizeValue(size)} />
        </div>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
        />

        {loading && (
          <div className="loading-spinner">
            <div className="spinner" />
          </div>
        )}

        {value && !loading && (
          <button
            className="clear-button"
            onClick={() => {
              setValue('');
              inputRef.current?.focus();
            }}
            aria-label="Clear"
          >
            <X size={getSizeValue(size)} />
          </button>
        )}
      </div>

      {showSuggestions && (
        <div className="dropdown">
          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && !value && (
            <div className="dropdown-section">
              <div className="section-header">
                <div className="section-title">
                  <Clock size={16} />
                  <span>최근 검색</span>
                </div>
                <button className="clear-all-button" onClick={clearRecentSearches}>
                  전체 삭제
                </button>
              </div>
              {recentSearches.map((recent, index) => (
                <button
                  key={`recent-${index}`}
                  className="suggestion-item recent"
                  onClick={() => handleRecentClick(recent)}
                >
                  <Clock size={16} />
                  <span className="suggestion-text">{recent}</span>
                </button>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="dropdown-section">
              {value && (
                <div className="section-header">
                  <div className="section-title">
                    <TrendingUp size={16} />
                    <span>추천 검색어</span>
                  </div>
                </div>
              )}
              {filteredSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className={`suggestion-item ${suggestion.type || 'suggestion'}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.type === 'trending' && <TrendingUp size={16} />}
                  {suggestion.type === 'recent' && <Clock size={16} />}
                  {!suggestion.type && <Search size={16} />}
                  <div className="suggestion-content">
                    <span className="suggestion-text">{suggestion.text}</span>
                    {suggestion.metadata && (
                      <span className="suggestion-metadata">{suggestion.metadata}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No results */}
          {value && filteredSuggestions.length === 0 && recentSearches.length === 0 && (
            <div className="no-results">
              <Search size={24} />
              <p>검색 결과가 없습니다</p>
              <p className="no-results-hint">다른 검색어를 입력해보세요</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .search-bar {
          position: relative;
          display: inline-block;
        }

        .full-width {
          width: 100%;
        }

        .search-input-container {
          display: flex;
          align-items: center;
          background-color: ${theme.colors.background.tertiary};
          border: 1px solid ${theme.colors.border.light};
          border-radius: ${theme.borderRadius.lg};
          transition: all ${theme.transitions.normal};
        }

        .search-input-container:focus-within {
          border-color: ${theme.colors.brand.primary};
          box-shadow: 0 0 0 3px rgba(251, 219, 81, 0.1);
        }

        .search-input-container:hover {
          border-color: ${theme.colors.text.tertiary};
        }

        .search-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${theme.colors.text.muted};
          pointer-events: none;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: ${theme.colors.text.primary};
          font-family: ${theme.typography.fontFamily.primary};
        }

        .search-input::placeholder {
          color: ${theme.colors.text.muted};
        }

        .loading-spinner {
          display: flex;
          align-items: center;
          padding-right: ${theme.spacing[2]};
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid ${theme.colors.background.tertiary};
          border-top-color: ${theme.colors.brand.primary};
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: ${theme.colors.text.muted};
          transition: color ${theme.transitions.fast};
          padding: 0;
        }

        .clear-button:hover {
          color: ${theme.colors.text.primary};
        }

        /* Sizes */
        .sm {
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          gap: ${theme.spacing[2]};
        }

        .sm .search-input {
          font-size: ${theme.typography.fontSize.sm};
        }

        .md {
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
          gap: ${theme.spacing[2]};
        }

        .md .search-input {
          font-size: ${theme.typography.fontSize.base};
        }

        .lg {
          padding: ${theme.spacing[4]} ${theme.spacing[5]};
          gap: ${theme.spacing[3]};
        }

        .lg .search-input {
          font-size: ${theme.typography.fontSize.lg};
        }

        /* Dropdown */
        .dropdown {
          position: absolute;
          top: calc(100% + ${theme.spacing[2]});
          left: 0;
          right: 0;
          background-color: ${theme.colors.background.secondary};
          border: 1px solid ${theme.colors.border.light};
          border-radius: ${theme.borderRadius.lg};
          box-shadow: ${theme.shadows.lg};
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
        }

        .dropdown-section {
          padding: ${theme.spacing[2]};
        }

        .dropdown-section + .dropdown-section {
          border-top: 1px solid ${theme.colors.border.light};
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: ${theme.spacing[2]};
          margin-bottom: ${theme.spacing[1]};
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: ${theme.spacing[2]};
          font-size: ${theme.typography.fontSize.xs};
          font-weight: ${theme.typography.fontWeight.semibold};
          color: ${theme.colors.text.muted};
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .clear-all-button {
          background: transparent;
          border: none;
          color: ${theme.colors.text.muted};
          font-size: ${theme.typography.fontSize.xs};
          cursor: pointer;
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          border-radius: ${theme.borderRadius.sm};
          transition: all ${theme.transitions.fast};
        }

        .clear-all-button:hover {
          color: ${theme.colors.text.primary};
          background-color: ${theme.colors.background.hover};
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          gap: ${theme.spacing[3]};
          width: 100%;
          padding: ${theme.spacing[3]};
          background: transparent;
          border: none;
          border-radius: ${theme.borderRadius.md};
          cursor: pointer;
          text-align: left;
          color: ${theme.colors.text.primary};
          font-family: ${theme.typography.fontFamily.primary};
          font-size: ${theme.typography.fontSize.sm};
          transition: all ${theme.transitions.fast};
        }

        .suggestion-item:hover {
          background-color: ${theme.colors.background.hover};
        }

        .suggestion-item :global(svg) {
          color: ${theme.colors.text.muted};
          flex-shrink: 0;
        }

        .suggestion-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: ${theme.spacing[1]};
        }

        .suggestion-text {
          color: ${theme.colors.text.primary};
        }

        .suggestion-metadata {
          font-size: ${theme.typography.fontSize.xs};
          color: ${theme.colors.text.muted};
        }

        .no-results {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: ${theme.spacing[8]} ${theme.spacing[4]};
          color: ${theme.colors.text.muted};
          text-align: center;
        }

        .no-results :global(svg) {
          margin-bottom: ${theme.spacing[3]};
          opacity: 0.5;
        }

        .no-results p {
          margin: ${theme.spacing[1]} 0;
        }

        .no-results-hint {
          font-size: ${theme.typography.fontSize.sm};
          color: ${theme.colors.text.muted};
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

function getSizeValue(size: 'sm' | 'md' | 'lg'): number {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };
  return sizes[size];
}
