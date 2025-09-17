import React, { useState } from 'react';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useAuth } from '../context/authContext.jsx';
import { MdDeleteForever, MdFavorite, MdFavoriteBorder, MdFileDownload } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const TemplateCard = ({ template, onEdit, onDelete }) => {
  const { isFavorited, addToFavorites, removeFromFavorites } = useFavorites();
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if template is null or undefined or missing required properties
  if (!template || !template._id) {
    return <div>Template not available</div>;
  }

  const favorited = isFavorited(template._id);

  const handleFavoriteClick = async () => {
    if (!token) {
      alert('Please log in to favorite templates.');
      return;
    }
    
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (favorited) {
        await removeFromFavorites(template._id);
      } else {
        await addToFavorites(template._id);
      }
    } catch (error) {
      console.error('Error handling favorite:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadClick = () => {
    if (template.downloadLink) {
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = template.downloadLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Extract filename from URL or use template title
      const filename = template.downloadLink.split('/').pop() || `${template.title || 'template'}.zip`;
      link.download = filename;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Download link not available for this template.');
    }
  };

  return (
    <div className="template-card"  style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
      <img 
        src={template.thumbnail || '/placeholder-image.png'} 
        alt={template.title || 'Template'} 
        style={{ width: '100%', borderRadius: '8px' }} 
        onError={(e) => {
          e.target.src = '/placeholder-image.png';
        }}
      />
     <div 
       onClick={() => template.previewLink && window.open(template.previewLink, '_blank')} 
       style={{
         cursor: template.previewLink ? 'pointer' : 'default', 
         background:'#F0F0F0',
         padding:'0.5em 1em',
         borderRadius:'8px'
       }}
     >
       <h3>{template.title || 'Untitled Template'}</h3>
      <p><strong>Description:</strong> {template.description || 'No description available'}</p>
     </div>
      <div style={{
        display: 'flex',
        position:'absolute',
        top: '10px',
        right:'10px'

      }}> 
        <button
        onClick={handleFavoriteClick}
        aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: favorited ? 'red' : 'gray',
        }}
      >
        {favorited ? <MdFavorite /> : <MdFavoriteBorder />}
      </button>
      <button
        onClick={handleDownloadClick}
        aria-label="Download template"
        style={{
          background: 'none',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          fontSize: '1.5rem',
          color: 'gray',
          marginLeft: '0.5rem',
        }}
      >
        <MdFileDownload />
      </button>
      {user?.role === 'admin' && (
        <>
          {/* Show edit button only for templates created by this admin */}
          {template.author === user?.name && (
            <button
              onClick={() => onEdit(template)}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: 'blue',
              }}
              aria-label="Edit template"
            >
              <FaEdit />
            </button>
          )}
          <button
            onClick={() => onDelete(template._id)}
            style={{
              background: 'none',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: 'red',
            }}
            aria-label="Delete template"
          >
            <MdDeleteForever />
          </button>
        </>
      )}
      </div>
    </div>
  );
};

export default TemplateCard;
