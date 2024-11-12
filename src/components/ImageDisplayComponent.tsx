import React from 'react';
import { useTranslation } from 'react-i18next';

const ImageDisplayComponent = ({ images }) => {
  const { t } = useTranslation('translations');
  let id = 1;
  if (images && images.length > 0) {
    images.map((row) => {
      row.id = id++;
      return row;
    });
  }

  return (
    <div>
      {images &&
        images.length > 0 &&
        !images[0].isEmpty &&
        images.map((image, index) => (
          <div key={image.id}>
            <img
              key={`${`img${index}`}`}
              src={`data:image/jpg;base64,${image.media_content}`}
              alt={`Image${index}`}
            />
            <br />
            <hr />
          </div>
        ))}
      {images && images.length > 0 && images[0].isEmpty && <p>{t('label.noImageFound')}</p>}
      {images && images.length === 0 && <p>Loading please wait...</p>}
    </div>
  );
};

export default ImageDisplayComponent;
