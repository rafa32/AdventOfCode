import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function calculateShoal( input ){
    let initialShoal = [];
    // Process input, save last input line
    for( let [ i, line ] of input.entries() ){
        initialShoal = line.split( /[ ,]+/ ).filter( Boolean );
        // initialShoal.forEach( ( fish, index ) => console.log( `## ${ index } -> ${ fish }` ) );
    }
    console.log( `## Initial state: ${ initialShoal } ` );
    // simulateShoalLifecycle( initialShoal, 80 );
    simulateShoalLifecyclePart2( initialShoal, 256 );
    // console.log( `## Final number of fish in shoal => ${ initialShoal.length } fish` );
}

function simulateShoalLifecyclePart2( shoal, numDays ){
    const fishBuckets = new Array( 9 ).fill( 0 ); // Create array for working in
    shoal.forEach( fish => fishBuckets[ fish ]++ ); // Populate the buckets

    for( let day = 1; day <= numDays; day++ ){
        const fishBucket = fishBuckets.shift(); // Remove the birthing lantern fish (new ones)
        fishBuckets.push( fishBucket ); // Add same number of new fish as a new bucket
        fishBuckets[ 6 ] += fishBucket; // Increment day #6 fish
    }

    let totalNumFishes = 0;
    fishBuckets.forEach( fishBucket => totalNumFishes += fishBucket ); // total the buckets
    console.log( `## Final number of fish in shoal => ${ totalNumFishes } fish` );
}

function simulateShoalLifecycle( shoal, numDays ){
    for( let day = 1; day <= numDays; day++ ){
        const totalNewFish = calculateShoalLifecycle( shoal );
        spawnNewFish( shoal, totalNewFish );
        // console.log( `## After  ${ day } days: ${ shoal }` );
    }
}

function calculateShoalLifecycle( shoal ){
    let numNewFish = 0;
    for( let i = 0; i < shoal.length; i++ ){
        if( shoal[ i ] === 0 ){
            numNewFish++;
            shoal[ i ] = 6; // Reset here
        } else{
            shoal[ i ]--;
        }
    }

    return numNewFish;
}

function spawnNewFish( shoal, numNewFish ){
    for( let i = 0; i < numNewFish; i++ ){
        shoal.push( 8 );
    }
}

// Cool stuff, O(1)
function calculateNumElems( array, elem ){
    return array.reduce( ( count, num ) => ( num === elem ? count + 1 : count ), 0 );
}

loadLines( './input-6.txt' )
    .then( input => {
        calculateShoal( input );
    } ).catch( console.error );