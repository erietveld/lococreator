
        // Function to draw the grid
        function drawGrid(data) {
            const grid = document.getElementById('grid');
            const idGrid = document.getElementById('id-grid');
            grid.innerHTML = ''; // Clear the grid
            idGrid.innerHTML = ''; // Clear the ID grid
            // Sort data by location to place squares in correct positions
            const sortedData = [...data].sort((a, b) => a.location - b.location);
            sortedData.forEach(square => {
                // Draw the colored square
                const div = document.createElement('div');
                div.classList.add('square');

                // Determine corner based on booleans
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

                div.classList.add(corner);

                const rect = document.createElement('div');
                rect.classList.add('rect', square.color);
                const triangle = document.createElement('div');
                triangle.classList.add('triangle', square.color);

                div.appendChild(rect);
                div.appendChild(triangle);
                grid.appendChild(div);

                // Draw the ID square
                const idDiv = document.createElement('div');
                idDiv.classList.add('id-square');
                idDiv.textContent = square.id;
                idGrid.appendChild(idDiv);
            });
        }
        function shuffleArray (array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
                }
                return array;
        };

        function shuffleBlocks(data) {
            let remainingBlocks = [...data];
            var colors = shuffleArray(['red', 'blue', 'green']);
            const newData = [];

            // Helper to get random element from array
            const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];
            
            const setBlock = (locationNumber, color, isLeftCondition, isTopCondition) => {
                // Find matching block
                const matchingBlocks = remainingBlocks.filter(b => 
                    b.color == color && 
                    (b.isLeft == isLeftCondition || isLeftCondition == null) && 
                    (b.isTop == isTopCondition || isTopCondition == null)
                );
                let selectedBlock = null;
                if (matchingBlocks.length === 1) {
                    selectedBlock = matchingBlocks[0];
                } 
                // If multiple blocks match, pick one randomly
                else {
                    selectedBlock = getRandomElement(matchingBlocks);
                }
                updateLocationAndRemove(selectedBlock, locationNumber);
             };

            // Helper to set location of block and remove from remainingBlocks
            const updateLocationAndRemove = (block, location) => {
                remainingBlocks = remainingBlocks.filter(b => b !== block);
                block.location = location;
                newData.push(block);
            };

            const findAndRemoveBlockWithDifferentColor = (referenceBlock, newColor, newLocation) => {
                // Find a block with same properties except for color
                const foundBlock = remainingBlocks.find(block => 
                    block.isTop === referenceBlock.isTop && 
                    block.isLeft === referenceBlock.isLeft && 
                    block.color === newColor
                );

                updateLocationAndRemove(foundBlock, newLocation);
            };

            const getBlock = (location) => {
                return newData.find(block => block.location === location);
            };

            setBlock(1, colors[0], null, null);
            setBlock(2, colors[0], !getBlock(1).isLeft, null);
            setBlock(7, colors[0], getBlock(1).isLeft, null);
            setBlock(8, colors[0], null, null);
            
            // Step 5: 
            if (Math.random() < 0.4) {
                findAndRemoveBlockWithDifferentColor(getBlock(1), colors[1], 3);
                findAndRemoveBlockWithDifferentColor(getBlock(2), colors[1], 4);
                findAndRemoveBlockWithDifferentColor(getBlock(7), colors[1], 9);
                findAndRemoveBlockWithDifferentColor(getBlock(8), colors[1], 10);

                findAndRemoveBlockWithDifferentColor(getBlock(1), colors[2], 5);
                findAndRemoveBlockWithDifferentColor(getBlock(2), colors[2], 6);
                findAndRemoveBlockWithDifferentColor(getBlock(7), colors[2], 11);
                findAndRemoveBlockWithDifferentColor(getBlock(8), colors[2], 12);
                return newData;
            }
            
            setBlock(3, colors[1], !getBlock(2).isLeft, null);
            setBlock(4, colors[1], !getBlock(3).isLeft, getBlock(3).isTop);
            setBlock(9, colors[1], getBlock(3).isLeft, !getBlock(3).isTop);
            setBlock(10, colors[1], null, null);

            setBlock(5, colors[2], !getBlock(2).isLeft, getBlock(2).isTop);
            setBlock(6, colors[2], !getBlock(1).isLeft, getBlock(1).isTop);
            setBlock(11, colors[2], !getBlock(8).isLeft, getBlock(8).isTop);
            setBlock(12, colors[2], null, null);

            return newData;
        }
