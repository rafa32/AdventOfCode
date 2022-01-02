import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function calculateCrabFuel( input ){
    let crabPositions = [], crabFuel = [];
    // Process input, save last input line
    for( let [ i, line ] of input.entries() ){
        crabPositions = line.split( /[ ,]+/ ).map( Number );
        // crabPositions.forEach( ( crab, index ) => console.log( `## LINE ${ index } => ${ crab }` ) );
    }

    crabFuel = new Array( crabPositions.length ).fill( 0 ); // Create array of crab fuel to work in
    for( let crabPosIndex = 0; crabPosIndex < crabPositions.length; crabPosIndex++ ){
        crabFuel[ crabPosIndex ] = calculateFuel( crabPositions, crabPosIndex );
        // Calculate crab fuel for position
        // Set crab fuel for position in respective array
    }

    calculateFuelPart2( crabPositions );

    // Determine minimum
    console.log( `## Minimum crab fuel necessary: ${ Math.min( ...crabFuel ) } ` );
}

function calculateFuel( positionsArray, fixedPositionInd ){
    let totalFuelForPosition = 0;
    let fixedCrabPosition = positionsArray[ fixedPositionInd ];
    for( let index = 0; index < positionsArray.length; index++ ){
        if( index !== fixedPositionInd ){
            totalFuelForPosition += Math.abs( ( positionsArray[ index ] - fixedCrabPosition ) );
        }
    }

    return totalFuelForPosition;
}

function calculateFuelPart2( crabPositions ){
    const sum = crabPositions.reduce( ( sum, crab ) => sum + crab );
    const avg = Math.floor( sum / crabPositions.length );

    let best = Infinity;
    for( let i = -1000; i <= 1000; i += 1 ){
        let cost = 0;
        for( const num of crabPositions ){
            const diff = Math.abs( num - avg + i );
            const sum = ( 1 + diff ) * diff / 2;
            cost += sum;
        }
        if( cost < best ){
            best = cost;
        }
    }


    console.log( best );
}

loadLines( './input-7.txt' )
    .then( input => {
        calculateCrabFuel( input );
    } ).catch( console.error );