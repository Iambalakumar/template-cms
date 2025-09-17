import React from 'react';
import { useFavorites } from '../context/FavoritesContext.jsx';
import TemplateCard from '../components/TemplateCard';

const FavoritesPage = () => {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return <p>Loading favorites...</p>;
  }

  if (!favorites.length) {
    return <p>You have no favorite templates yet.</p>;
  }

  return (
    <div>
      <h2 class="page-title">Your Favorites</h2>
      <div className='template-grid'>
        {favorites.map(fav => (
          <TemplateCard key={fav._id} template={fav.templateId} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
