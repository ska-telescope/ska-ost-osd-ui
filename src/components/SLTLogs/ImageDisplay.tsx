import React from 'react';

const ImageDisplay = ({ images }) => {
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
        images.map((image, index) => (
          <div key={image.id}>
            <img
              key={`${`img${index}`}`}
              src={`data:image/jpg;base64,${image.media_content}`}
              width={700}
              height={500}
              alt={`Image${index}`}
            />
            <br />
          </div>
        ))}
    </div>
  );
};

export default ImageDisplay;
