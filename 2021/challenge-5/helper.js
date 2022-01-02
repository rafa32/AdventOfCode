import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function hydrothermalAdventure( input ){
    let startingPosArray = [], endingPosArray = [];
    // Process input, save last input line
    for( let [ i, line ] of input.entries() ){
        let lineSplit = line.split( /[ ,]+/ ).filter( Boolean );
        startingPosArray.push( [ +lineSplit[ 0 ], +lineSplit[ 1 ] ] );
        endingPosArray.push( [ +lineSplit[ 3 ], +lineSplit[ 4 ] ] );
    }

    // printPositions( startingPosArray, endingPosArray );

    const maxCol = Math.max( ...[ ...startingPosArray.map( elem => elem[ 0 ] ), ...endingPosArray.map( elem => elem[ 0 ] ) ] );
    const maxRow = Math.max( ...[ ...startingPosArray.map( elem => elem[ 1 ] ), ...endingPosArray.map( elem => elem[ 1 ] ) ] );
    console.log( `## MAX NUMBER COLUMNS ${ maxCol }` );
    console.log( `## MAX NUMBER ROWS ${ maxRow }` );
    const hydrothermalMatrix = [ ...Array( maxRow + 1 ) ].map( x => Array( maxCol + 1 ).fill( 0 ) );
    // for( let i = 0; i < hydrothermalMatrix.length; i++ ){
    //     for( let j = 0; j < hydrothermalMatrix[ i ].length; j++ ){
    //         if( i > 986 ){
    //             console.log( `#### (${ j }, ${ i }) => ${ JSON.stringify( hydrothermalMatrix[ i ][ j ] ) }` );
    //         }
    //     }
    //
    // }
    let finalOverlap = calculateVenture( hydrothermalMatrix, startingPosArray, endingPosArray );
    console.log( `## FINAL OVERLAP => ${ finalOverlap }` );
}

function calculateVenture( matrix, startingPosArray, endingPosArray ){
    for( let i = 0; i < startingPosArray.length; i++ ){
        let startingPos = startingPosArray[ i ];
        let endingPos = endingPosArray[ i ];
        console.log( `## INCREMENTING FROM ${ JSON.stringify( startingPos ) } => ${ JSON.stringify( endingPos ) }` );
        incrementPath( matrix, startingPos, endingPos );
    }

    return calculateOverlap( matrix );
}

function calculateOverlap( matrix ){
    let overlap = 0;
    for( let y = 0; y < matrix.length; y++ ){
        for( let x = 0; x < matrix[ y ].length; x++ ){
            if( matrix[ y ][ x ] >= 2 ){
                overlap++;
            }
        }
    }

    return overlap;
}

function incrementPath( matrix, startingPos, endingPos ){
    let startPosX = startingPos[ 0 ], endPosX = endingPos[ 0 ];
    let startPosY = startingPos[ 1 ], endPosY = endingPos[ 1 ];

    let lowestStartPosY = ( startPosY < endPosY ? startPosY : endPosY );
    let highestStartPosY = ( startPosY > endPosY ? startPosY : endPosY );
    let lowestStartPosX = ( startPosX < endPosX ? startPosX : endPosX );
    let highestStartPosX = ( startPosX > endPosX ? startPosX : endPosX );
    // Horizontal
    if( startPosX === endPosX ){
        for( let y = lowestStartPosY; y <= highestStartPosY; y++ ){
            matrix[ y ][ startPosX ]++;
            // console.log( `#### (${ startPosX }, ${ y }) => ${ JSON.stringify( matrix[ y ][ startPosX ] ) }` );
        }
    // Vertical
    } else if( startPosY === endPosY ){
        for( let x = lowestStartPosX; x <= highestStartPosX; x++ ){
            matrix[ startPosY ][ x ]++;
            // console.log( `#### (${ x }, ${ startPosY }) => ${ JSON.stringify( matrix[ startPosY ][ x ] ) }` );
        }
    // Side-ways
    } else{
        let xIncrement = startPosX < endPosX;
        let yIncrement = startPosY < endPosY;
        let y = startPosY, x = startPosX;
        while( y !== endPosY || x !== endPosX ){
            matrix[ y ][ x ]++;
            // console.log( `#### (${ x }, ${ y }) => ${ JSON.stringify( matrix[ y ][ x ] ) }` );
            ( xIncrement ? x++ : x-- );
            ( yIncrement ? y++ : y-- );
        }

        matrix[ y ][ x ]++;
        // console.log( `#### (${ x }, ${ y }) => ${ JSON.stringify( matrix[ y ][ x ] ) }` );
    }
}

function printPositions( startingPos, endingPos ){
    console.log( `# STARTING POS` );
    sortMatrix( startingPos );
    sortMatrix( endingPos );
    startingPos.forEach( startingPosition => console.log( `## -> ${ JSON.stringify( startingPosition ) }` ) );
    console.log( `# ENDING POS` );
    endingPos.forEach( endingPositions => console.log( `## -> ${ JSON.stringify( endingPositions ) }` ) );
}

function sortMatrix( matrix ){
    // Sort matrix
    matrix.sort( ( element_a, element_b ) => {
        return element_a[ 0 ] - element_b[ 0 ] || element_a[ 1 ] - element_b[ 1 ];
    } );
}

loadLines( './input-5.txt' )
    .then( input => {
        hydrothermalAdventure( input );
    } ).catch( console.error );