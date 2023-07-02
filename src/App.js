
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';


const App = () => {
  const azukiURI = 'https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/';
  const dzukiURI = 'https://metadata.dreamzuki.xyz/images/';
  const [removeBackground, setRemoveBackground] = useState(false);

  const [collection, setCollection] = useState('azuki');
  const [skin, setSkin] = useState('light');
  const [tokenID, setTokenID] = useState('');
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [downloadDisabled, setDownloadDisabled] = useState(true);

  const canvasRef = useRef(null);
  const backgroundImage = useRef(new Image());
  const overlayImage = useRef(new Image());

  useEffect(() => {
    changeSkin(skin);
  }, [skin]);

  const changeSkin = (s) => {
    if (s === 'light') overlayImage.current.src = '/images/red-light.png';
    if (s === 'spirit-r') overlayImage.current.src = '/images/red-spirit.png';
    if (s === 'spirit-w') overlayImage.current.src = '/images/white-spirit.png';
    setIsImagesLoaded(false);
  };

  const drawImages = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!removeBackground) {
      ctx.drawImage(backgroundImage.current, 0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(overlayImage.current, 0, 0, canvas.width, canvas.height);
  };

  const checkAllImagesLoaded = () => {
    if (!isImagesLoaded) {
      let bg = collection === 'azuki' ? azukiURI : dzukiURI;
      fetchImage(bg + tokenID + '.png', backgroundImage.current)
        .then(() => fetchImage(overlayImage.current.src, overlayImage.current))
        .then(() => {
          drawImages();
          setIsImagesLoaded(true);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  const fetchImage = (url, image) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          image.src = url;
        })
        .then(() => {
          image.onload = () => {
            resolve();
          };
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const handleGenerateClick = () => {
    setDownloadDisabled(true);
    changeSkin(skin);
    checkAllImagesLoaded();
    setDownloadDisabled(false);
  };

  const handleDownloadClick = () => {
    downloadCanvasAsImage();
  };

  const downloadCanvasAsImage = () => {
    const canvas = canvasRef.current;

    // Create a temporary canvas element
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    // Fetch the background image externally
    fetch(backgroundImage.current.src)
      .then((response) => response.blob())
      .then((bgBlob) => {
        const bgUrl = URL.createObjectURL(bgBlob);

        // Load the background image onto the temporary canvas
        const bgImage = new Image();
        bgImage.onload = function () {
          tempCtx.drawImage(bgImage, 0, 0, tempCanvas.width, tempCanvas.height);

          // Fetch the overlay image externally
          fetch(overlayImage.current.src)
            .then((response) => response.blob())
            .then((overlayBlob) => {
              const overlayUrl = URL.createObjectURL(overlayBlob);

              // Load the overlay image onto the temporary canvas
              const overlayImage = new Image();
              overlayImage.onload = function () {
                tempCtx.drawImage(overlayImage, 0, 0, tempCanvas.width, tempCanvas.height);

                // Clean up the temporary URLs
                URL.revokeObjectURL(bgUrl);
                URL.revokeObjectURL(overlayUrl);

                // Create a link to download the canvas as an image
                const link = document.createElement('a');
                link.href = tempCanvas.toDataURL('image/png', 1.0); // Set the quality to 1.0 (maximum)
                link.download = 'redbean-azuki-' + tokenID + '.png';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              };
              overlayImage.src = overlayUrl;
            });
        };
        bgImage.src = bgUrl;
      });
  };

  return (
    <div className="App">
      <header>
        <a href="https://redbean.coffee/" target="_blank" rel="noopener noreferrer">
          <img src="images/logo.webp" className="logo" alt="Red Bean Coffee" />
        </a>
      </header>
      <div className="row">
        <canvas ref={canvasRef} width="4000" height="4000"></canvas>

     

        <div className="field-row">
          <label htmlFor="collection">Choose collection:</label>
          <select
            name="collection"
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
          >
            <option value="azuki">Azuki</option>
            <option value="dzuki">Dreamzuki</option>
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="skin">Choose skin:</label>
          <select
            name="skin"
            value={skin}
            onChange={(e) => setSkin(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="spirit-r">Spirit - Red</option>
            <option value="spirit-w">Spirit - White</option>
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="tokenID">Token ID:</label>
          <input
            type="text"
            name="tokenID"
            value={tokenID}
            onChange={(e) => setTokenID(e.target.value)}
          />
        </div>

        <div className="button-row">
          <button onClick={handleGenerateClick}>Generate</button>
          <button onClick={handleDownloadClick} disabled={downloadDisabled}>
            Download PNG
          </button>
        </div>
      </div>

      <footer>
        <p>
          Proudly built by{' '}
          <a
            href="https://blockgeni3.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Blockgeni3
          </a>{' '}
          for{' '}
          <a
            href="https://redbean.coffee"
            target="_blank"
            rel="noopener noreferrer"
          >
            Red Bean Coffee
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;