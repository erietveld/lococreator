
function createLoco(squaresData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // // Add and set the custom font
     doc.setFont('NotoSerif-Regular', 'normal');

    // Parse input from textarea
    const input = document.getElementById('qaInput').value.split('\n');
    const questionName = input.shift().replace('Question: ', '').trim();
    const hint = input.shift().replace('Hint: ', '').trim();

    const selectedRadio = document.querySelector('input[name="questionOrder"]:checked').value;
    if (selectedRadio === 'randomize'){
        input.sort(() => Math.random() - 0.5); // Simple random sort
    }
    // Example:  'keepOrder', 'randomize', or 'keepAnswerOrder'

    const questions = [];
    const answers = [];
    for (let i = 0; i < input.length; i++) {
        if (input[i].trim() === "") continue;
        const [num, qa] = input[i].split('. ');
        const [question, answer] =  qa.split(/Answer:\s*/i);
        questions.push(question.trim());
        answers.push(answer.trim());
    }


    let finalAnswers, finalQuestions;
    if (selectedRadio === 'keepAnswerOrder'){
        const sortedSquares = [...squaresData].sort((a, b) => a.id - b.id);
        const idOrder = sortedSquares.map(square => square.location - 1); // Adjust for 0-based index
        finalQuestions = idOrder.map(index => questions[index]);
        finalAnswers = answers; 
    }
    else{
        //Working
        const sortedSquares = [...squaresData].sort((a, b) => a.location - b.location);
        const idOrder = sortedSquares.map(square => square.id - 1); // Adjust for 0-based index
        
        finalQuestions = questions;
        finalAnswers = idOrder.map(index => answers[index]);
    }

    // Page dimensions (A4 landscape: 297mm x 210mm)
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 10;
    const squareSize = 41;
    const startX = margin;
    let startY = 5;//margin + 10;

    // Draw question grid (2 rows, 6 columns, connected)
    doc.setFontSize(12);
    for (let i = 0; i < 12; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = startX + col * squareSize;
        const y = startY + row * squareSize;

        // Draw individual square borders (will connect due to no gaps)
        doc.rect(x, y, squareSize, squareSize);

        // Draw small number square in top-left corner
        const numSquareSize = 8;
        doc.rect(x, y, numSquareSize, numSquareSize);
        doc.text(String(i + 1), x + 1.6, y + 6.1);

        // Center the question text in the square
        const fontSize = doc.getFontSize(); // Get current font size
        const lineHeight = fontSize * 0.5; // Approximate line height (adjust if needed)
        const maxWidth = squareSize - 5; // Maximum width for text wrapping
        
        // Split text into lines to calculate total height
        const lines = doc.splitTextToSize(finalQuestions[i], maxWidth);
        const textHeight = lines.length * lineHeight; // Total height of wrapped text
        
        // Calculate vertical position to center the text block
        const textY = y + (squareSize - textHeight) / 2 + lineHeight * 0.8; // Adjust for baseline
        
        // Draw the text with automatic centering
        doc.text(lines, x + squareSize / 2, textY, { maxWidth: maxWidth, align: 'center' });

    }
 
    startY += 2 * squareSize + 5;
    // Add question name and hint at the top
    doc.setFontSize(12);
    doc.text(questionName, margin, startY);
    doc.text(hint, margin, startY + 5);

  //  startY -= 10;

   // Draw answer grid (2 rows, 6 columns, connected) below the question grid
    startY = drawGridPDF(doc, squaresData, startY);
    startY += 10;

    // startY += 10; // Move down for answers
    for (let i = 0; i < 12; i++) {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const x = startX + col * squareSize;
        const y = startY + row * squareSize;

        // Draw individual square borders (will connect due to no gaps)
        doc.rect(x, y, squareSize, squareSize);

        // Center the answer text in the square
        const fontSize = doc.getFontSize(); // Get current font size
        const lineHeight = fontSize * 0.5; // Approximate line height (adjust if needed)
        const maxWidth = squareSize - 5; // Maximum width for text wrapping
        
        // Split text into lines to calculate total height
        const lines = doc.splitTextToSize(finalAnswers[i], maxWidth);
        const textHeight = lines.length * lineHeight; // Total height of the text block
        
        // Center the entire text block vertically in the square
        const textY = y + (squareSize - textHeight) / 2 + lineHeight * 0.8; // Adjust for baseline
                
        // Draw the text with automatic horizontal centering
        doc.text(lines, x + squareSize / 2, textY, { maxWidth: maxWidth, align: 'center' });
    }
    // Save the PDF
    doc.save('loco_output.pdf');
}

function drawGridPDF(doc, squaresData, startY) {
    // Constants for grid layout
    const squareSize = 10; // Size of each square in mm
    const gap = .5; // Gap between squares in mm
    const gridWidth = 6; // 6 columns
    const gridHeight = 2; // 2 rows

    // Colors in RGB format for jsPDF
    const colors = {
        red: [255, 0, 0],
        blue: [0, 0, 255],
        green: [0, 128, 0]
    };

    // Sort squaresData by location
    const sortedData = [...squaresData].sort((a, b) => a.location - b.location);
    const xMargin = 190;
    sortedData.forEach((square, index) => {
        // Calculate row and column based on location (1 to 12)
        const row = Math.floor(index / gridWidth);
        const col = index % gridWidth;

        // Calculate position in the PDF
        const x = col * (squareSize + gap) + xMargin;
        const y = startY + row * (squareSize + gap);

        // Set the border of the square
        doc.setLineWidth(0.2);
        doc.setDrawColor(0, 0, 0); // Black border
        doc.rect(x, y, squareSize, squareSize);

        // Determine corner and direction for coloring
        let corner;
        if (square.isTop && square.isLeft) {
            corner = 'top-left';
        } else if (square.isTop && !square.isLeft) {
            corner = 'top-right';
        } else if (!square.isTop && square.isLeft) {
            corner = 'bottom-left';
        } else {
            corner = 'bottom-right';
        }

        // Set fill color
        const [r, g, b] = colors[square.color];
        doc.setFillColor(r, g, b);

        // Draw the 75% coloring (50% rectangle + 25% triangle)
        if (corner === 'top-left') {
            // Rectangle: left half
            doc.rect(x, y, squareSize / 2, squareSize, 'F');
            // Triangle: top-left to bottom-right in right half
            doc.triangle(
                x + squareSize / 2, y, // Top-left of right half
                x + squareSize, y,     // Top-right of square
                x + squareSize / 2, y + squareSize, // Bottom-left of right half
                'F'
            );
        } else if (corner === 'top-right') {
            // Rectangle: right half
            doc.rect(x + squareSize / 2, y, squareSize / 2, squareSize, 'F');
            // Triangle: top-right to bottom-left in left half
            doc.triangle(
                x + squareSize / 2, y, // Top-right of left half
                x, y,                  // Top-left of square
                x + squareSize / 2, y + squareSize, // Bottom-right of left half
                'F'
            );
        } else if (corner === 'bottom-left') {
            // Rectangle: left half
            doc.rect(x, y, squareSize / 2, squareSize, 'F');
            // Triangle: top-left to bottom-right in right half
            doc.triangle(
                x + squareSize / 2, y, // Top-left of right half
                x + squareSize, y + squareSize,     // Top-right of square
                x + squareSize / 2, y + squareSize, // Bottom-left of right half
                'F'
            );
        } else if (corner === 'bottom-right') {
            // Rectangle: right half
            doc.rect(x + squareSize / 2, y, squareSize / 2, squareSize, 'F');
            // Triangle: top-right to bottom-left in left half
            doc.triangle(
                x + squareSize / 2, y, // Top-right of left half
                x, y + + squareSize,                  // Top-left of square
                x + squareSize / 2, y + squareSize, // Bottom-right of left half
                'F'
            );
        }
    });

    // Return the Y position after the grid for further drawing
    return startY + gridHeight * (squareSize + gap);
}
