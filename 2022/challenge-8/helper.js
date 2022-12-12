import loadInput from '../../utils/loader.js';

const grid = loadInput()
    .split( '\r\n' )
    // Map is a 2D-grid of trees, each represented by a number (height)
    // Processing each line creating an Object{} for each tree -> { indX : x, indY : y, treeHeight : number read from the input }
    // Flattening the grid will help scanning on all directions for trees that have lower height value
    .map( ( line, indY ) => line.split( '' ).map( ( treeHeight, indX ) => ( { indX, indY, treeHeight : +treeHeight } ) ) );

const maxGridWidth = grid[ 0 ].length;
const maxGridHeight = grid.length;
// #flatTreeGrid is an Array[] of Object{}, each Object{} being a tree represented by its coordinates and height value
const flatTreeGrid = grid.flat();

function determineTreeVisibility(){
    // Process all trees for each row (bottom-to-top) and compare heights from left to right
    for( let y = 0; y < maxGridHeight; y++ ){
        let maxTreeHeight = -1;
        for( let x = 0; x < maxGridWidth; x++ ){
            const currentTree = grid[ y ][ x ];
            if( currentTree.treeHeight > maxTreeHeight ){
                maxTreeHeight = currentTree.treeHeight;
                currentTree.visible = true;
            }
        }
    }
    // Process all trees for each row (bottom-to-top) and compare heights from right to left
    for( let y = 0; y < maxGridHeight; y++ ){
        let maxTreeHeight = -1;
        for( let x = maxGridWidth - 1; x >= 0; x-- ){
            const currentTree = grid[ y ][ x ];
            if( currentTree.treeHeight > maxTreeHeight ){
                maxTreeHeight = currentTree.treeHeight;
                currentTree.visible = true;
            }
        }
    }
    // Process all trees for each column (left-to-right) and compare heights from bottom to top
    for( let x = 0; x < maxGridWidth; x++ ){
        let maxTreeHeight = -1;
        for( let y = 0; y < maxGridHeight; y++ ){
            const currentTree = grid[ y ][ x ];
            if( currentTree.treeHeight > maxTreeHeight ){
                maxTreeHeight = currentTree.treeHeight;
                currentTree.visible = true;
            }
        }
    }
    // Process all trees for each column (left-to-right) and compare heights from top to bottom
    for( let x = 0; x < maxGridWidth; x++ ){
        let maxTreeHeight = -1;
        for( let y = maxGridHeight - 1; y >= 0; y-- ){
            const currentTree = grid[ y ][ x ];
            if( currentTree.treeHeight > maxTreeHeight ){
                maxTreeHeight = currentTree.treeHeight;
                currentTree.visible = true;
            }
        }
    }
}

let maxScore = 0;
function calculateScenicScore(){
    
    for( let currY = 0; currY < maxGridHeight; currY++ ){
        for( let currX = 0; currX < maxGridWidth; currX++ ){
            const currentTree = grid[ currY ][ currX ];

            let bottomScore = 0;
            for( let nextY = currY + 1; nextY < maxGridHeight; nextY++ ){
                const nextTree = grid[ nextY ][ currX ];
                if( !nextTree ){
                    break;
                }
                bottomScore++;
                if( nextTree.treeHeight >= currentTree.treeHeight ){
                    break;
                }
            }

            let topScore = 0;
            for( let nextY = currY - 1; nextY >= 0; nextY-- ){
                const nextTree = grid[ nextY ][ currX ];
                if( !nextTree ){
                    break;
                }
                topScore++;
                if( nextTree.treeHeight >= currentTree.treeHeight ){
                    break;
                }
            }

            let rightScore = 0;
            for( let nextX = currX + 1; nextX < maxGridWidth; nextX++ ){
                const nextTree = grid[ currY ][ nextX ];
                if( !nextTree ){
                    break;
                }
                rightScore++;
                if( nextTree.treeHeight >= currentTree.treeHeight ){
                    break;
                }
            }

            let leftScore = 0;
            for( let nextX = currX - 1; nextX >= 0; nextX-- ){
                const nextTree = grid[ currY ][ nextX ];
                if( !nextTree ){
                    break;
                }
                leftScore++;
                if( nextTree.treeHeight >= currentTree.treeHeight ){
                    break;
                }
            }

            const currScore = bottomScore * topScore * rightScore * leftScore;
            if( currScore > maxScore ){
                maxScore = currScore;
            }
        }
    }
}
// Part #1
determineTreeVisibility();
// Part #2
calculateScenicScore();

console.log( flatTreeGrid.filter( ( objTree ) => objTree.visible ).length );
console.log( maxScore );