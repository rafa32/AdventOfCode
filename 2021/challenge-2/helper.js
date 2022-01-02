import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( '\n' ) ) )
            .catch( reject )
    } )
}

function calculatePosition( input ){
    let horPosition = 0, verPosition = 0;
    const directions = {
        'up' : 0,
        'down' : 0,
        'forward' : 0,
    };

    for( let i = 0; i < input.length; i++ ){
        let inputLine = input[ i ];
        let lineTokens = inputLine.split( ' ' );
        const direction = lineTokens[ 0 ];
        const steps = Number( lineTokens[ 1 ] );
        directions[ direction ] += steps;
    }

    horPosition = directions[ 'forward' ];
    verPosition = directions[ 'down' ] - directions[ 'up' ];
    let finalPosition = horPosition * verPosition;

    console.log( `** Horizontal position => ${ horPosition }` );
    console.log( `** Vertical position => ( down => +${ directions[ 'down' ] }, up => -${directions[ 'up' ]} ) => ${ verPosition }` );
    console.log( `** Final position => ${ finalPosition }` );
}

function calculatePositionWithAim( input ){
    let horPosition = 0, verPosition = 0, aim = 0;

    for( let i = 0; i < input.length; i++ ){
        let inputLine = input[ i ];
        let lineTokens = inputLine.split( ' ' );
        const direction = lineTokens[ 0 ];
        const steps = Number( lineTokens[ 1 ] );
        if( direction === 'forward' ){
            horPosition += steps;
            verPosition += aim * steps;
        } else if( direction === 'up' ){
            aim -= steps;
        } else if( direction === 'down' ){
            aim += steps;
        }
    }

    let finalPosition = horPosition * verPosition;

    console.log( `** Horizontal position => ${ horPosition }` );
    console.log( `** Vertical position => ${ verPosition }` );
    console.log( `** Final position => ${ finalPosition }` );
}

loadLines( './input-2.txt' )
    .then( values => {
        // calculatePosition( values );
        calculatePositionWithAim( values );
    } ).catch( console.error );
