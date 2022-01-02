import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( '\n' ) ) )
            .catch( reject )
    } )
}

function getFrequency( arr, val ){
    return arr.reduce( ( a, v ) => ( v === val ? a + 1 : a ), 0 );
}

function binaryDiagnostic( input ){
    const lineLength = input[ 0 ].length - 1;
    const rateIndex = {};
    for( let i = 0; i < lineLength; i++ ){
        rateIndex[ i ] = [];
    }

    for( let i = 0; i < input.length; i++ ){
        let inputLine = input[ i ];
        // console.log( `** INPUT LINE => ${ inputLine }` );
        // console.log( `** INPUT LINE => ${ inputLine.length }` );
        for( let j = 0; j < inputLine.length - 1; j++ ){
            rateIndex[ j ].push( inputLine.charAt( j ) );
            // console.log( `**** CHAR AT #${ j } => ${ inputLine.charAt( j ) }` );
        }
    }

    let gammaRate = '';
    let threshold = input.length / 2;
    console.log( `** THRESHOLD = ${ threshold }` );
    for( let i = 0; i < lineLength; i++ ){
        // console.log( `**** ARRAY ${i} -> ${ JSON.stringify( rateIndex[ i ] ) }` );
        // console.log( `**** Most common: ${ getFrequency( rateIndex[ i ] ) }` );
        let oneFrequency = getFrequency( rateIndex[ i ], '1' );
        let zeroFrequency = input.length - oneFrequency;
        console.log( `**** One frequency: ${ oneFrequency }` );
        console.log( `**** Zero frequency: ${ zeroFrequency }` );
        gammaRate += `${ ( oneFrequency >= zeroFrequency ? '1' : '0' ) }`;
        console.log( `**** Gamma rate: ${ gammaRate }` );
    }

    let gammaRateInt = parseInt( gammaRate, 2 );
    console.log( `****** Gamma rate (binary): ${gammaRate} | (integer) ${ gammaRateInt }` );
}

function lifeSupportDiagnostic( input ){
    let mostFrequentFirstBit = calculateFrequency( input, 0, '1', true );
    let leastFrequentFirstBit = calculateFrequency( input, 0, '0', false );

    let oxygenLevel = ratingGenerator( input, mostFrequentFirstBit, 0, '1', true );
    let scrubberLevel = ratingGenerator( input, leastFrequentFirstBit, 0, '0', false );
    console.log( `** OXYGEN LEVEL => ${ oxygenLevel }` );
    console.log( `** SCRUBBER LEVEL => ${ scrubberLevel }` );
}

function ratingGenerator( arr, bitFrequency, nextBitPosition, tieBreaker, mostFrequent ){
    let new_arr = [];
    if( arr.length === 1 ){
        return arr[ 0 ];
    }

    console.log( `**** BIT FREQUENCY => ${ bitFrequency }` );
    console.log( `**** NEXT BIT POSITION => ${ nextBitPosition }` );
    console.log( `**** TIEBREAKER => ${ tieBreaker }` );

    for( let i = 0; i < arr.length; i++ ){
        let arrEl = arr[ i ];
        if( arrEl.charAt( nextBitPosition ) === bitFrequency ){
            new_arr.push( arrEl );
        }
    }
    let newBitFrequency = calculateFrequency( new_arr, nextBitPosition + 1, tieBreaker, mostFrequent );
    console.log( `**** NEW BIT FREQUENCY => ${ newBitFrequency }` );
    console.log( `**** FOR ARRAY => ${ JSON.stringify( new_arr ) }` );
    return ratingGenerator( new_arr, newBitFrequency, nextBitPosition + 1, tieBreaker, mostFrequent );
}

function calculateFrequency( arr, position, tieBreaker, mostFrequent = true ){
    let allElemsForPosition = [];
    for( let i = 0; i < arr.length; i++ ){
        let inputLine = arr[ i ];
        allElemsForPosition.push( inputLine.charAt( position ) );
    }

    let oneFrequency = getFrequency( allElemsForPosition, '1' );
    let zeroFrequency = arr.length - oneFrequency;
    if( oneFrequency > zeroFrequency ){
        return ( mostFrequent ? '1' : '0' );
    } else if( zeroFrequency > oneFrequency ){
        return ( mostFrequent ? '0' : '1' );
    } else{
        return ( tieBreaker === '1' ? '1' : '0' )
    }
}

loadLines( './input-3.txt' )
    .then( values => {
        // calculatePosition( values );
        // binaryDiagnostic( values );
        lifeSupportDiagnostic( values );
    } ).catch( console.error );