import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritedIds, setFavoritedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchFavorites = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch favorites');
      const data = await res.json();
      setFavorites(data);
      
      // Handle null templateId values more robustly
      const validIds = data
        .map(fav => {
          if (!fav || !fav.templateId) return null;
          // Handle both populated template object and templateId string
          const templateId = fav.templateId._id || fav.templateId;
          return templateId ? templateId.toString() : null;
        })
        .filter(id => id !== null);
      
      setFavoritedIds(new Set(validIds));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (templateId) => {
    if (!token) return false;
    // Optimistic UI update
    setFavoritedIds(prev => {
      const newSet = new Set(prev);
      newSet.add(templateId);
      return newSet;
    });
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${templateId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.status === 409) {
        // Template already favorited - this is not an error, just return true
        await fetchFavorites(); // Refresh to ensure consistency
        return true;
      }
      
      if (!res.ok) throw new Error('Failed to add favorite');
      
      await fetchFavorites(); // Refresh favorites from server
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Revert optimistic update
      setFavoritedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(templateId);
        return newSet;
      });
      return false;
    }
  };

  const removeFromFavorites = async (templateId) => {
    if (!token) return false;
    // Optimistic UI update
    setFavoritedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(templateId);
      return newSet;
    });
    try {
      const res = await fetch(`http://localhost:5000/api/favorites/${templateId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error('Failed to remove favorite');
      await fetchFavorites(); // Refresh favorites from server
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Revert optimistic update
      setFavoritedIds(prev => {
        const newSet = new Set(prev);
        newSet.add(templateId);
        return newSet;
      });
      return false;
    }
  };

  const isFavorited = (templateId) => {
    return favoritedIds.has(templateId);
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritedIds,
        loading,
        fetchFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorited,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
