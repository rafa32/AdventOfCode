import loadInput from '../../utils/loader.js';

const moves = loadInput()
    .split( '\r\n' )
    .map( ( move ) => move.split( ' ' ).map( ( moveInfo, ind ) => ( ind === 0 ? moveInfo : +moveInfo ) ) );
// All possible column movements for the head/tail knots
const directionMoves = {
    R : { x : 1, y : 0 }, // 'Right' moves x-axis 1 unit forward -> (1, 1) + (1, 0) = (2, 1)
    D : { x : 0, y : -1 }, // 'Down' moves y-axis 1 unit back -> (1, 1) + (0, -1) = (1, 0)
    L : { x : -1, y : 0 }, // 'Left' moves x-axis 1 unit back -> (1, 1) + (-1, 0) = (0, 1)
    U : { x : 0, y : 1 }, // 'Up' moves y-axis 1 unit forward -> (1, 1) + (0, 1) = (1, 2)
};
// All possible column & diagonal movements for the head/tail knots
const diagonalMoves = [
    { x : 1, y : 0 },
    { x : 1, y : 1 },
    { x : 0, y : 1 },
    { x : -1, y : 1 },
    { x : -1, y : 0 },
    { x : -1, y : -1 },
    { x : 0, y : -1 },
    { x : 1, y : -1 },
];
// Initial head/tail states
const head = { x : 0, y : 0 };
const tail = { x : 0, y : 0 };
// Set that holds the visited tail coordinates
const visited = new Set();

function traverseRopeBridge(){
    for( const [ direction, stepCount ] of moves ){
        // Get the motion direction based on the direction given to the head of the rope
        const motionDirection = directionMoves[ direction ];
        // Iterate over the step count, e.g. 'R 4' -> head 4 steps to the right
        for( let i = 0; i < stepCount; i++ ){
            // Move head in the motion direction
            head.x += motionDirection.x;
            head.y += motionDirection.y;
            // Calculate the new distance between the head and tail points. If the distance is greater or equal than 2, a new position needs to be given to the tail
            const currDistance = calcDistance( tail, head );
            if( currDistance >= 2 ){
                const nextBestPosition = getNextBestPosition( tail, head );
                tail.x = nextBestPosition.x;
                tail.y = nextBestPosition.y;
            }
            // Add the visited coordinate of the tail to the set
            const visitedCoordKey = `${ tail.x }:${ tail.y }`;
            visited.add( visitedCoordKey );
        }
    }
}

// Part #2
//  Create an empty array of 10 knots, with coordinates (0, 0). Head will be the 1st knot, tail will be the last
const rope = Array( 10 ).fill().map( () => ( { x : 0, y : 0 } ) );
const ropeHead = rope[ 0 ];
const ropeTail = rope[ rope.length - 1 ];

function traverseRopeBridgePart2(){
    for( const [ direction, stepCount ] of moves ){
        // Get the motion direction based on the direction given to the head of the rope
        const motionDirection = directionMoves[ direction ];
        // Iterate over the step count, e.g. 'R 4' -> head 4 steps to the right
        for( let i = 0; i < stepCount; i++ ){
            // Move head in the motion direction
            ropeHead.x += motionDirection.x;
            ropeHead.y += motionDirection.y;

            for( let j = 1; j < rope.length; j++ ){ // Here, the head of the rope already moved above, so start on ind = 1
                const prevRopeKnot = rope[ j - 1 ];
                const currRopeKnot = rope[ j ];
                // Calculate the new distance between the current head (prevRopeKnot) and tail (currRopeKnot) points.
                // If the distance is greater or equal than 2, a new position needs to be given to the tail (currRopeKnot). It follows the same logic as in Part #1, but
                //  it iterates over all the knots on the rope, not just head/tail.
                const currDistance = calcDistance( currRopeKnot, prevRopeKnot );
                if( currDistance >= 2 ){
                    const nextBestPosition = getNextBestPosition( currRopeKnot, prevRopeKnot );
                    currRopeKnot.x = nextBestPosition.x;
                    currRopeKnot.y = nextBestPosition.y;
                }
            }
            // Add the visited coordinate of the tail to the set
            const visitedCoordKey = `${ ropeTail.x }:${ ropeTail.y }`;
            visited.add( visitedCoordKey );
        }
    }
}


function getNextBestPosition( currentPoint, targetPoint ){
    let minDistance = Infinity;
    let nextBestPosition = null;
    for( const { x : dx, y : dy } of diagonalMoves ){
        const newCurrPosition = {
            x : currentPoint.x + dx,
            y : currentPoint.y + dy
        };
        const newCurrDistance = calcDistance( newCurrPosition, targetPoint );
        if( newCurrDistance < minDistance ){
            minDistance = newCurrDistance;
            nextBestPosition = newCurrPosition;
        }
    }

    return nextBestPosition;
}

// Distance formula, as derived from Pythagoras theorem
function calcDistance( pointA, pointB ){
    return Math.sqrt( Math.pow( pointB.x - pointA.x, 2 ) + Math.pow( pointB.y - pointA.y, 2 ) );
}

// Part #1
// traverseRopeBridge();
// Part #2
traverseRopeBridgePart2();

console.log( visited.size );