I'm building a simple html webpage that has a drawing of 12 squares, which are colored based on a json array with input details. Each element has two boolean, a color indication (red, blue or green) and an id number. Each square is partially colored with the color indicated, the color is each in top or bottom (as indicated by the first boolean) or left or right (indicated by the second boolean). The 12 sqaures are printed in a 2x6 grid.

rename topBottom to isTop, and rename leftRight to isLeft. The boolean indicate which corner is mostly that color. Sample attached for a top, left, blue piece. 
Please reduce the spacing between the squares.
We need an extra id-number to indicate in what location the square is. 
When I click the grid a function will be called that takes the squareData and shuffles the locations of them and then redraws the grid given the new data.

We're getting closer. This produces a colored square in the corner, instead could you adjust to make it a rectangle covering the left half or right half and then next to it a triangle. This results is each square being colored for 75%.
Please update the position number to start with 1.
Also update the mixing algorithm: the color of the first block is the same as the color of box 2, 7 and 8. Also the color of block 3 should be the same as box 4, 9 and 10.

Great, the coloring is perfect now. But the shuffle algo needs changes.
Please change the implementation to place them one by one:
- Choose a random color (from the 3)
- From the set of available blocks randomly select a square with that color, and set it at location 1.
- Next, from the remaining squares from the same color, select one that has inverted isLeft (!isLeft) compared to the fist one. Place that block at location 2.
- Next to find the block for location 7, from the remaining blocks of that color, find the one that has the same isLeft as block 1 (btw, where I say block I also mean square).
- To finish this first segment, put the remaining block of the same color at position 8.
-Next choose a new color from the two remaining colors.
- Find a random block with that color and place it as position 3.
- At position 4 place the block with the same color, but which has !isLeft and isTop compared to block 3.
- Posiiton 9 should be filled with the block that matches block 3 except that !isTop.
-Position 10 should the be last block of that color.
- From the last remaining color the block 5 should have the same isTop and isLeft as block 7.
- From the same set of final blocks, the one on location 6 needs to have the same isTop and isLeft as the block on location 8.
- At location 11 should put the same isLeft and isTop as block 1.
- You should now have only one block left, that should be put on location 12.
Finally print the ids of the block as numbers in a 2x6 grid underneath the image.

I need to create the same grid with squares but then in a PDF. I'm using jsPDF, so can use the draw functions in that library. I have my blocks in squaresData variable and already created some space in my PDF document to add it. It starts at Y position startY. Please loop through my squaresData in location order and create the 2x6 grid colored the same way as we did earlier with CSS, but now using the jsPDF drawing options.

It's time to adjust the answer mixing. The location and squareId data is the way the answers should be sorted. Please suggested an update to the line:
            let mixedAnswers = [...answers]; // No mixing for now
to sort the mixed answers according to the sorting specified in the square ids when going through them by location.

