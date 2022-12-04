import loadInput from '../../utils/loader.js';

const rawInput = loadInput();

const endScorePart1 = {
    A : { X : 4, Y : 8, Z : 3, },
    B : { X : 1, Y : 5, Z : 9, },
    C : { X : 7, Y : 2, Z : 6, },
};

const endScorePart2 = {
    A : { X : 3, Y : 4, Z : 8, },
    B : { X : 1, Y : 5, Z : 9, },
    C : { X : 2, Y : 6, Z : 7, },
}; // For Part #2, only the end score change for each combination, adding-up the shape score + end score is still a valid approach but adjusted to the new rules

// const shapeScore = { X: 1, Y: 2, Z: 3 };
// Redundant to 'endScorePart', since it already adds it up for each rock/paper/scissors combination of the opponent (A, B, C)

function playRPC(){
    let score = 0;
    for( const game of rawInput.split( '\r\n' ) ){
        let [ opponent, player ] = game.split( ' ' );
        // score += endScorePart1[ opponent ][ player ];
        score += endScorePart2[ opponent ][ player ];
    }
    // TODO: Can be transformed into a reducer
    console.log( score );
}

playRPC();