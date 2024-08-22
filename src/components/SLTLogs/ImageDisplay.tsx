import React from 'react';

const ImageDisplay = ({ images }) => (
  <div>
    {images &&
      images.length > 0 &&
      images.map((image, index) => (
        <>
          <img
            key={`${`img${index}`}`}
            src={`data:image/jpg;base64,${image}`}
            width={700}
            height={500}
            alt={`Image${index}`}
          />
          <hr />
        </>
      ))}
  </div>
);

export default ImageDisplay;
