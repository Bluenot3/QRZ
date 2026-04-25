import QRCode from 'qrcode';

// Core logic for creating an artistic QR code
export async function generateArtisticQRCode(
  url: string,
  aiImageUrl: string,
  qrStyle: 'dark' | 'neon' | 'cyber' | 'matrix' | 'synthwave' = 'dark',
  dotShape: 'rounded' | 'square' | 'circle' | 'diamond' = 'rounded',
  finderShape: 'square' | 'rounded' | 'circle' = 'square'
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // 1. Generate base QR matrix
      // Using 'Q' or 'M' could be safer for extremely long URLs, but 'H' is better for artistic hiding since 30% can be obscured.
      // If the URL is absurdly long, this could throw.
      const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
      const modules = qr.modules;
      const size = modules.size;
      
      // 2. Load the AI image
      const img = new Image();
      if (!aiImageUrl.startsWith('data:')) {
        img.crossOrigin = 'anonymous';
      }
      img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // We will render high-res for better quality
        const outputSize = 1024;
        canvas.width = outputSize;
        canvas.height = outputSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('No canvas context'));

        // 3. Draw AI image as full background
        ctx.drawImage(img, 0, 0, outputSize, outputSize);

        // We'll create an overlay map that makes the image scannable
        // We determine how big each cell is
        const margin = 2; // 2 module margin
        const totalSize = size + margin * 2;
        const cellSize = outputSize / totalSize;

        // Add a global background overlay to improve contrast against chaotic images
        let overlayColor = 'rgba(255, 255, 255, 0.6)';
        if (qrStyle === 'neon' || qrStyle === 'cyber' || qrStyle === 'matrix') {
          overlayColor = 'rgba(0, 0, 0, 0.7)'; // Dark overlay to make bright QR modules pop
        } else if (qrStyle === 'synthwave') {
          overlayColor = 'rgba(40, 0, 60, 0.6)';
        }

        ctx.fillStyle = overlayColor;
        ctx.fillRect(0, 0, outputSize, outputSize);
        
        const isFinderRegion = (r: number, c: number) => {
          return (r < 7 && c < 7) || 
                 (r < 7 && c >= size - 7) || 
                 (r >= size - 7 && c < 7);
        };

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            if (isFinderRegion(row, col)) continue; // Skip finder regions, we draw them manually

            const isDark = modules.data[row * size + col];
            const x = (col + margin) * cellSize;
            const y = (row + margin) * cellSize;

            if (isDark) {
              if (qrStyle === 'dark') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
              } else if (qrStyle === 'neon') {
                ctx.fillStyle = 'rgba(240, 255, 0, 0.95)';
              } else if (qrStyle === 'cyber') {
                ctx.fillStyle = 'rgba(0, 255, 255, 0.95)';
              } else if (qrStyle === 'matrix') {
                ctx.fillStyle = 'rgba(0, 255, 65, 0.9)';
              } else if (qrStyle === 'synthwave') {
                ctx.fillStyle = 'rgba(255, 0, 255, 0.9)';
              }
              
              // Only draw them slightly smaller to let the image show, but large enough for scanners
              drawShape(ctx, x + cellSize * 0.1, y + cellSize * 0.1, cellSize * 0.8, dotShape);
            } else {
               // Draw light modules to heavily increase scannability contrast, particularly for dark themes
               if (qrStyle === 'dark') {
                 ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
               } else {
                 ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
               }
               drawShape(ctx, x + cellSize * 0.2, y + cellSize * 0.2, cellSize * 0.6, dotShape);
            }
          }
        }

        // Draw the 3 perfect finder patterns
        const drawFinder = (startRow: number, startCol: number) => {
          const fx = (startCol + margin) * cellSize;
          const fy = (startRow + margin) * cellSize;
          const fSize = cellSize * 7;

          let primaryColor = 'rgba(0, 0, 0, 1)';
          let secondaryColor = 'rgba(255, 255, 255, 1)';
          let bgOuter = 'rgba(255, 255, 255, 1)';

          if (qrStyle === 'neon') {
            primaryColor = 'rgba(240, 255, 0, 1)';
            secondaryColor = 'rgba(0, 0, 0, 1)';
            bgOuter = 'rgba(0, 0, 0, 1)';
          } else if (qrStyle === 'cyber') {
            primaryColor = 'rgba(0, 255, 255, 1)';
            secondaryColor = 'rgba(0, 0, 0, 1)';
            bgOuter = 'rgba(0, 0, 0, 1)';
          } else if (qrStyle === 'matrix') {
            primaryColor = 'rgba(0, 255, 65, 1)';
            secondaryColor = 'rgba(0, 0, 0, 1)';
            bgOuter = 'rgba(0, 0, 0, 1)';
          } else if (qrStyle === 'synthwave') {
            primaryColor = 'rgba(255, 0, 255, 1)';
            secondaryColor = 'rgba(0, 0, 0, 1)';
            bgOuter = 'rgba(0, 0, 0, 1)';
          }

          // Helper to draw finder shapes
          const drawFinderLayer = (cx: number, cy: number, size: number, shapeMode: string) => {
            if (shapeMode === 'circle') {
              ctx.beginPath();
              ctx.arc(cx + size/2, cy + size/2, size/2, 0, Math.PI * 2);
              ctx.fill();
            } else if (shapeMode === 'rounded') {
              drawRoundedRect(ctx, cx, cy, size, size, size * 0.25);
              ctx.fill();
            } else {
              ctx.fillRect(cx, cy, size, size);
            }
          }

          // Outer border to ensure it pops safely
          ctx.fillStyle = bgOuter;
          drawFinderLayer(fx - cellSize * 0.5, fy - cellSize * 0.5, fSize + cellSize, finderShape);

          // Outer contrasting pattern (7x7)
          ctx.fillStyle = primaryColor;
          drawFinderLayer(fx, fy, fSize, finderShape);

          // Inner contrasting pattern (5x5)
          ctx.fillStyle = secondaryColor;
          drawFinderLayer(fx + cellSize, fy + cellSize, cellSize * 5, finderShape);

          // Inner solid pattern (3x3)
          ctx.fillStyle = primaryColor;
          drawFinderLayer(fx + cellSize * 2, fy + cellSize * 2, cellSize * 3, finderShape);
        };

        drawFinder(0, 0); // Top-Left
        drawFinder(0, size - 7); // Top-Right
        drawFinder(size - 7, 0); // Bottom-Left

        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image. If using a custom upload, ensure it is a valid image.'));
    img.src = aiImageUrl;
    } catch (e) {
      reject(e);
    }
  });
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: string) {
  if (shape === 'square') {
    ctx.fillRect(x, y, size, size);
  } else if (shape === 'rounded') {
    drawRoundedRect(ctx, x, y, size, size, size * 0.3);
    ctx.fill();
  } else if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (shape === 'diamond') {
    ctx.beginPath();
    ctx.moveTo(x + size / 2, y);
    ctx.lineTo(x + size, y + size / 2);
    ctx.lineTo(x + size / 2, y + size);
    ctx.lineTo(x, y + size / 2);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(x, y, size, size);
  }
}

