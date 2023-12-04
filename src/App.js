import React, { useRef, useEffect, useState } from 'react';
import Papa from 'papaparse';
import './App.css';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import logo from './logo.png'; // Import your logo

function App() {
    const canvasRef = useRef(null);
    const [csvData, setCsvData] = useState([]);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    setCsvData(results.data);
                }
            });
        }
    };
      
    const drawRoundedRectangle = (ctx, x, y, width, height, radius, gradient) => {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
        
        ctx.fillStyle = gradient;
        ctx.fill();
    };
    
    // Función para generar un degradado aleatorio
    const getRandomGradient = (ctx, x, y, width, height) => {
        const [color1, color2] = getRandomColorPair();
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        return gradient;
    };

    const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
    
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
    
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    };
    const textoEnLineas = (texto, maxWidth, font) => {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = font;
        const palabras = texto.split(' ');
        let lineas = [];
        let lineaActual = '';
    
        palabras.forEach(palabra => {
            const lineaConPalabra = lineaActual + palabra + ' ';
            const anchoLinea = ctx.measureText(lineaConPalabra).width;
    
            if (anchoLinea > maxWidth && lineaActual) {
                lineas.push(lineaActual);
                lineaActual = palabra + ' ';
            } else {
                lineaActual = lineaConPalabra;
            }
        });
    
        lineas.push(lineaActual.trim());
        return lineas;
    };
   
    

    const drawCsvDataOnCanvas = (data, index) => {
        const item = data[index];
        if (!item) {
            console.error('No data item found at index:', index);
            return; // Salir si no hay ningún dato
        }
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const maxWidth = canvas.width - 200; // o el ancho que consideres apropiado
        const lineHeight = 100; // o la altura que consideres apropiada
    
        // Restablecer el canvas para un nuevo dibujo
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        generateRandomGradientBackground(ctx); // Fondo diferente para cada imagen
        generateTechOverlay(ctx);
        
        // Dibujar el contenido predeterminado (logo e información de contacto)
        drawDefaultContent();
    
        // Luego dibujar los datos del CSV si están disponibles
        const align = getRandomAlign(); 
        ctx.textAlign = align;
        
        // Calcular la posición x en función de la alineación del texto
        let x;
        if (align === "left") {
            x = 100;
        } else if (align === "center") {
            x = canvas.width / 2;  
        } else {
            x = canvas.width - 100;
        }
        const calculateTotalContentHeight = (item, ctx, maxWidth) => {
            let totalHeight = 0;
        
            // Agrega la altura y el margen para cada elemento si está presente
            if (item.title) {
                totalHeight += 180 * textoEnLineas(item.title, maxWidth, 'bold 120px Poppins').length + 20;
            }
            if (item.titulotamañomenor) {
                totalHeight += 80 * textoEnLineas(item.titulotamañomenor, maxWidth, '50px Poppins').length + 20; // Altura más pequeña
            }
            if (item.titulolargo) {
                totalHeight += 120 * textoEnLineas(item.titulolargo, maxWidth, '65px Poppins').length + 20;
            }
            if (item.frase) {
                totalHeight += 140 * textoEnLineas(item.frase, maxWidth, 'bold 80px Poppins').length + 20;
            }
            if (item.cortadescripcion) {
                totalHeight += 140 * textoEnLineas(item.cortadescripcion, maxWidth, 'bold 70px Poppins').length + 20;
            }
            if (item.description) {
                totalHeight += 100 * textoEnLineas(item.description, maxWidth, '55px Poppins').length + 20;
            }
            if (item.caracteristicas) {
                totalHeight += 100 * textoEnLineas(item.caracteristicas, maxWidth, '600 55px Poppins').length + 20;
            }
            if (item.boton) {
                ctx.font = 'bold 52px Poppins'; // Se establece el estilo de fuente para medir el texto del botón
                const textMetrics = ctx.measureText(item.boton);
                const buttonHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + 3.5 * 20;
                totalHeight += buttonHeight + 20;
            }
        
            return totalHeight;
        };
        // Asumiendo que item es tu objeto de datos y canvas es tu elemento canvas
        const totalContentHeight = calculateTotalContentHeight(item, ctx, maxWidth);
        let currentY = (canvas.height - totalContentHeight) / 2;
      

        
        
       if (item.title) {
    const LineHeight = 200;
    ctx.fillStyle = 'white';
    ctx.font = 'bold 150px Poppins';
    currentY += 0; // Añade margen superior
    wrapText(ctx, item.title, x, currentY, maxWidth, LineHeight);
    const numLines = textoEnLineas(item.title, maxWidth, ctx.font).length;
    currentY += LineHeight * numLines + 0; // Añade margen inferior
}

if (item.titulotamañomenor) {
    const LineHeight = 90; // Menor que el de 'title'
    ctx.fillStyle = 'white';
    ctx.font = '140px Poppins'; // Tamaño de fuente menor que el de 'title'
    currentY += 40; // Añade margen superior
    wrapText(ctx, item.titulotamañomenor, x, currentY, maxWidth, LineHeight);
    const numLines = textoEnLineas(item.titulotamañomenor, maxWidth, ctx.font).length;
    currentY += LineHeight * numLines + 40; // Añade margen inferior
}

if (item.titulolargo) {
    const LineHeight = 120;
    ctx.fillStyle = 'white';
    ctx.font = '65px Poppins';
    currentY += -20; // Añade margen superior
    wrapText(ctx, item.titulolargo, x, currentY, maxWidth, LineHeight);
    const numLines = textoEnLineas(item.titulolargo, maxWidth, ctx.font).length;
    currentY += LineHeight * numLines + 20; // Añade margen inferior
}

if (item.frase) {
    const LineHeight = 140; // Altura de línea específica para la frase
    ctx.fillStyle = 'white'; // Establece el color del texto
    ctx.font = 'bold 80px Poppins'; // Peso de fuente ligero y tamaño
    wrapText(ctx, item.frase, x, currentY, maxWidth, LineHeight); // Dibuja el texto con ajuste automático
    const numLines = textoEnLineas(item.frase, maxWidth, ctx.font).length; // Calcula el número de líneas
    currentY += LineHeight * numLines + 40; // Añade un margen adicional después del texto
}

if (item.cortadescripcion) {
    const LineHeight = 140; // Altura de línea específica para la descripción corta
    ctx.fillStyle = 'white'; // Establece el color del texto
    ctx.font = 'bold 70px Poppins'; // Tamaño de fuente más pequeño para la descripción corta
    wrapText(ctx, item.cortadescripcion, x, currentY, maxWidth, LineHeight); // Dibuja el texto con ajuste automático
    const numLines = textoEnLineas(item.cortadescripcion, maxWidth, ctx.font).length; // Calcula el número de líneas
    currentY += LineHeight * numLines + 40; // Añade un margen adicional después del texto
}

if (item.description) {
    const LineHeight = 100; // Altura de línea específica para la descripción
    ctx.fillStyle = 'white'; // Establece el color del texto
    ctx.font = '55px Poppins'; // Tamaño de fuente para la descripción
    wrapText(ctx, item.description, x, currentY, maxWidth, LineHeight); // Dibuja el texto con ajuste automático
    const numLines = textoEnLineas(item.description, maxWidth, ctx.font).length; // Calcula el número de líneas
    currentY += LineHeight * numLines + 40; // Añade un margen adicional después del texto
}



        if (item.caracteristicas) {
            const characteristics = item.caracteristicas.split(',');

    const maxCharacteristics = 6;
    characteristics.length = Math.min(characteristics.length, maxCharacteristics);

    const LineHeight = 100;
    ctx.fillStyle = 'white';
    ctx.font = '600 55px Poppins';

    let currentLine = currentY;

    for (let i = 0; i < characteristics.length; i++) {
        let text;
        if (align === "left") {
            text = `• ${characteristics[i].trim()}`; // Punto a la izquierda para alineación izquierda
        } else if (align === "right") {
            text = `${characteristics[i].trim()} •`; // Punto
                    text = `${characteristics[i].trim()} •`; // Punto a la derecha para alineación derecha
                } else {
                    text = characteristics[i].trim(); // Sin puntos para alineación central
                }
        
                wrapText(ctx, text, x, currentLine, maxWidth, LineHeight);
                currentLine += LineHeight; 
            }
          
            currentY = currentLine;
        }
        
        
      if (item.boton) {
    const buttonText = item.boton;
    ctx.font = 'bold 52px Poppins';
    const textMetrics = ctx.measureText(buttonText);
    const textWidth = textMetrics.width;
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

    // Padding y tamaños adicionales para el botón
    const buttonPaddingHorizontal = 60;
    const buttonPaddingVertical = 20;
    const buttonWidth = textWidth + buttonPaddingHorizontal * 2;
    const buttonHeight = textHeight + buttonPaddingVertical * 3.5;

    // Calcular la posición del texto y del botón
    let textX, buttonX;
    if (align === "left") {
        textX = 100 + buttonPaddingHorizontal;
        buttonX = 100; // Botón alineado a la izquierda
    } else if (align === "center") {
        textX = canvas.width / 2;
        buttonX = textX - buttonWidth / 2; // Centrar el botón en el canvas
    } else { // align === "right"
        textX = canvas.width - 100 - buttonPaddingHorizontal;
        buttonX = canvas.width - 100 - buttonWidth; // Botón alineado a la derecha
    }
    
    const buttonY = currentY;
    const textY = buttonY + (buttonHeight / 2) + (textMetrics.actualBoundingBoxAscent - textMetrics.actualBoundingBoxDescent) / 2;

    // Dibujar el botón
    const gradient = getRandomGradient(ctx, buttonX, buttonY, buttonWidth, buttonHeight);
    drawRoundedRectangle(ctx, buttonX, buttonY, buttonWidth, buttonHeight, 20, gradient);

    // Dibujar el texto
    ctx.fillStyle = 'white';
    ctx.fillText(buttonText, textX, textY);

    currentY += buttonHeight + 20; // Añadir margen después del botón
}

        
        
                
        
        

}


const getRandomAlign = () => {
    const options = ['left', 'center', 'right'];
    return options[Math.floor(Math.random() * options.length)]; 
  }

  const harmoniousColors = [
    // Azul real a Celeste claro (tonos más claros)
    ['#89CFF0', '#B0E0E6', '#ADD8E6', '#E0FFFF'], // Gama de azules claros
    // Verde mar medio a Verde pálido (tonos más claros)
    ['#90EE90', '#98FB98', '#AFEEEE', '#E0FFF0'], // Gama de verdes claros
    // Rosa pálido a Rosa claro (tonos más claros)
    ['#FFC0CB', '#FFD1DC', '#FFE4E1', '#FFF0F5'], // Gama de rosas claros
    // Púrpura medio a Lavanda (tonos más claros)
    ['#D8BFD8', '#E6E6FA', '#F0E6FF', '#F8F0FE'], // Gama de púrpuras claros
    // Rojo naranja a Salmón claro (tonos más claros)
    ['#FFA07A', '#FFB6A0', '#FFC0AA', '#FFDAB9'], // Gama de salmones claros
    // Azul dodger a Aguamarina claro (tonos más claros)
    ['#B0E2FF', '#B0E6FF', '#C0EFFF', '#D0F7FF'], // Gama de azules y aguamarinas claros
];

    // Funciones auxiliares
    const getRandomColor = () => {
        const colorGroup = harmoniousColors[Math.floor(Math.random() * harmoniousColors.length)];
        return colorGroup[Math.floor(Math.random() * colorGroup.length)];
    };

    const drawTriangle = (ctx, x, y, size) => {
        let height = size * (Math.sqrt(3) / 2);
        ctx.moveTo(x, y - height / 2);
        ctx.lineTo(x + size / 2, y + height / 2);
        ctx.lineTo(x - size / 2, y + height / 2);
        ctx.closePath();
    };
    

    const generateTechOverlay = (ctx) => {
        const figureCount = 10;
        const smallCircleCount = 15; // Number of small circles
        const spacing = 20; // Reduced spacing between figures
        const figures = []; // To store the positions and sizes of figures
    
        for (let i = 0; i < figureCount; i++) {
            const canvas = canvasRef.current;
    
            let shape = Math.floor(Math.random() * 3);
            let size = Math.random() * 200 + 50; // Size variation from 50 to 250
            let x, y, overlap;
    
            do {
                x = Math.random() * (canvas.width - size) + size / 2;
                y = Math.random() * (canvas.height - size) + size / 2;
                overlap = figures.some(fig => {
                    let distance = Math.sqrt(Math.pow(x - fig.x, 2) + Math.pow(y - fig.y, 2));
                    return distance < (fig.size / 2 + size / 2 + spacing);
                });
            } while (overlap);
    
            figures.push({ x, y, size });
    
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(Math.random() * 2 * Math.PI);
            ctx.beginPath();
    
            let transparentBorder = Math.random() < 0; 
            ctx.strokeStyle = transparentBorder ? 'rgba(0, 0, 0, 0)' : getRandomColor();
    
            switch (shape) {
                case 0:
                    drawTriangle(ctx, 0, 0, size);
                    break;
                case 1:
                    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);
                    break;
                case 2:
                    ctx.rect(-size / 2, -size / 2, size, size);
                    break;
            }
    
            ctx.stroke(); // Apply the defined border style
            ctx.restore();
        }
    
        for (let i = 0; i < smallCircleCount; i++) {
            const canvas = canvasRef.current;
            let x = Math.random() * canvas.width;
            let y = Math.random() * canvas.height;
            let radius = Math.random() * 10 + 5; // Small circle radius between 5 and 15
            let color = getRandomColor(); // Get random color for each circle
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.8)`;
            ctx.fillStyle = rgbaColor;
            ctx.fill();
        }
    };
    
    
  
  
const colorPairs = [
    ['#4169E1', '#00BFFF'], // Azul real a Azul cielo profundo
    ['#3CB371', '#32CD32'], // Verde mar medio a Verde lima
    ['#9370DB', '#BA55D3'], // Púrpura medio a Orquídea medio
    ['#1E90FF', '#87CEEB'], // Azul dodger a Celeste claro
    ['#FF69B4', '#C71585'],
    ['#7B68EE', '#483D8B'],
    ['#87CEFA', '#4682B4'],
    ['#98FB98', '#2E8B57'],
    ['#FFD700', '#FF8C00'], // Oro a Naranja oscuro
    ['#FFA07A', '#FF4500'], // Salmón claro a Rojo-naranja
    ['#6A5ACD', '#483D8B'], // Azul pizarra a Azul pizarra oscuro
];



const getRandomColorPair = () => {
    const selectedSet = colorPairs[Math.floor(Math.random() * colorPairs.length)];
    // Logic to select two different colors from the set
    if (selectedSet.length > 2) {
        let color1 = selectedSet[Math.floor(Math.random() * selectedSet.length)];
        let color2;
        do {
            color2 = selectedSet[Math.floor(Math.random() * selectedSet.length)];
        } while (color1 === color2);
        return [color1, color2];
    } else {
        return selectedSet; // Return the pair as is if it only contains two colors
    }
};

// Function to generate gradient background with the selected colors
const generateRandomGradientBackground = (ctx) => {
  const [color1, color2] = getRandomColorPair();
  
  const canvas = canvasRef.current;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
const drawDefaultContent = () => {
    return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const image = new Image();
        image.onload = () => {
        const logoHeight = 100; // Set desired logo height
        const aspectRatio = image.width / image.height;
        const logoWidth = logoHeight * aspectRatio; // Maintain aspect ratio

        // Include space on the left side of the logo
        const logoLeftSpace = 60;
        // Adjust the Y position to move the logo up, creating space below
        const logoYPosition = canvas.height - logoHeight - 68; // Increase this value to move the logo up

        ctx.drawImage(image, logoLeftSpace, logoYPosition, logoWidth, logoHeight);

        // Start drawing contact info next to the logo with space
        const textStartX = logoLeftSpace + logoWidth + 58; // Space after the logo
        drawContactInfo(ctx, canvas, textStartX);
        resolve(); // Resuelve la promesa una vez que el logo se ha dibujado
        };
        image.onerror = reject; // Rechaza la promesa en caso de error al cargar la imagen
        image.src = logo;
    });
};


const drawContactInfo = (ctx, canvas, startX) => {
    const textElements = ['+51 953 117 390', 'info@orbix-tech.com', 'www.orbix-tech.com'];
    ctx.font = '44px Poppins'; // Set the font size
    ctx.fillStyle = 'white'; // drawCsvDataOnCanvas  the text color to white
    ctx.textAlign = 'left'; // Explicitly set text alignment for contact info

    // Define a fixed spacing between text elements
    const fixedSpacing = 78;

    // Calculate the total width including fixed spacings
    const totalTextWidth = textElements.reduce((totalWidth, text, index) => {
        return totalWidth + ctx.measureText(text).width + (index < textElements.length - 1 ? fixedSpacing : 0);
    }, 0);

    let currentX = startX; // Start position for the first text element

    textElements.forEach((text, index) => {
        ctx.fillText(text, currentX, canvas.height - 90); // Draw text
        currentX += ctx.measureText(text).width + (index < textElements.length - 1 ? fixedSpacing : 0);
    });

    // Check for right side spacing
    const rightSideSpacing = 30;
    if (currentX + rightSideSpacing > canvas.width) {
        console.warn('Content may exceed canvas width. Consider adjusting font size, content, or spacings.');
    }
};

// Replace generateGradientBackground in generateCombinedBackground with generateRandomGradientBackground
const generateCombinedBackground = () => {
  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');
  generateRandomGradientBackground(ctx); // Updated call
  generateTechOverlay(ctx);
  drawDefaultContent();
};

  // Efecto para inicializar el lienzo
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    generateCombinedBackground(ctx);
    drawDefaultContent(); // Call the new function to draw default content
}, []);

  // Handler para descargar la imagen
  
 
  const generateAndDownloadImages = async () => {
    const zip = new JSZip();
    for (let index = 0; index < csvData.length-1; index++) {
        await drawDefaultContent(); // Esperar a que se complete el dibujo del contenido por defecto
        drawCsvDataOnCanvas(csvData, index); // Dibujar los datos del CSV
        await new Promise((resolve) => {
            setTimeout(() => {
                const canvas = canvasRef.current;
                canvas.toBlob(blob => {
                    zip.file(`image_${index}.png`, blob);
                    resolve();
                });
            }, 0); 
        });
    }

    zip.generateAsync({ type: "blob" }).then(content => {
        saveAs(content, "images.zip");
    });
};

  return (
      <div>
        <div className="rooot">
        <div>
          <canvas ref={canvasRef} width="1920" height="1920"></canvas>
          </div>
          <div className="button-container">
      <div className="top-buttons">
      <button onClick={generateAndDownloadImages}>Descargar</button>
      <button >Generar Videos</button>
        <button onClick={() => generateCombinedBackground(canvasRef.current.getContext('2d'))}>Fondo Combinado</button>
      </div>
      <div className="bottom-button">
      <label className="file-upload-btn">
      Seleccionar Archivo
        <input type="file" accept=".csv" onChange={handleFileUpload} />  
        </label>
      </div>
    </div>
     </div> 
     </div>
  );
}

export default App;
