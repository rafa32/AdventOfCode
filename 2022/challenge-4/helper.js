import loadInput from '../../utils/loader.js';

const rawInput = loadInput();

const allPairs = rawInput.split( '\r\n' ).map( pair => pair.split( ',' ).map( elfSection => elfSection.split( '-' ).map( Number ) ) );
// Simply walkthrough input and create Array[ [ a1, b1 ], [ a2, b2 ], ... ] by splitting 1) by '-', 2) by ',' and 3) by '\r\n' for each line

function startCampCleanup(){
    let count = 0;
    for( const [ [ leftA, rightA ], [ leftB, rightB ] ] of allPairs ){
        // if( ( leftA <= leftB && rightA >= rightB ) || ( leftA >= leftB && rightA <= rightB ) ){
        // Part #1
        //  This catches all enclosing pairs:
        //      -> [ LA < LB < RB < RA ], meaning that 1st pair fully encloses 2nd pair
        //      -> [ LB < LA < RA < RB ], meaning that 2nd pair fully encloses 1st pair
        if( ( leftA >= leftB && leftA <= rightB ) || ( leftB >= leftA && leftB <= rightA ) ){
            // Part #2
            //  We're just concerned with any interception, meaning, we want to check if 1st pair starts within the 2nd, or vice-versa
            //      -> [ LB < LA < RB ], meaning that 1st pair includes partially/fully 2nd pair
            //      -> [ LA < LB < RA ], meaning that 2nd pair includes partially/fully 1st pair
            count++;
        }
    }
    // TODO: Another opportunity for a reducer..
    console.log( count );
}

startCampCleanup();