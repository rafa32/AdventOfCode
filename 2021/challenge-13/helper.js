import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function calculateOrigami( input ){
    let origamiMatrix = [];
    let lastInputIndex = 0;
    // Process input, save last input line
    for( let [ i, line ] of input.entries() ){
        let lineSplit = line.split( /[ ,]+/ ).filter( Boolean );
        if( lineSplit.length < 1 ){
            lastInputIndex = i + 1;
            break;
        }
        origamiMatrix.push( [ +lineSplit[ 0 ], +lineSplit[ 1 ] ] );
    }

    sortMatrix( origamiMatrix );

    // Nice one!
    // console.table( origamiMatrix );
    //
    // for( let [ i, coord ] of origamiMatrix.entries() ){
    //     console.log( `## COORD IN ${ i } MATRIX => ${ coord }` );
    // }

    // matrixSize.maxRow = Math.max( ...origamiMatrix.map( elem => elem[ 0 ] ) );
    // matrixSize.maxCol = Math.max( ...origamiMatrix.map( elem => elem[ 1 ] ) );

    // console.log( `## MAX NUMBER COLUMNS ${ Math.max( ...origamiMatrix.map( elem => elem[ 0 ] ) ) }` );
    // console.log( `## MAX NUMBER ROWS ${ Math.max( ...origamiMatrix.map( elem => elem[ 1 ] ) ) }` );


    // const matrix = [ ...Array( matrixSize.maxRow + 1 ) ].map( x => Array( matrixSize.maxCol + 1 ).fill( 0 ) );

    origamiMatrix = deduplicateTuples( foldColumn( origamiMatrix, 655 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 447 ) );
    origamiMatrix = deduplicateTuples( foldColumn( origamiMatrix, 327 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 223 ) );
    origamiMatrix = deduplicateTuples( foldColumn( origamiMatrix, 163 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 111 ) );
    origamiMatrix = deduplicateTuples( foldColumn( origamiMatrix, 81 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 55 ) );
    origamiMatrix = deduplicateTuples( foldColumn( origamiMatrix, 40 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 27 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 13 ) );
    origamiMatrix = deduplicateTuples( foldRow( origamiMatrix, 6 ) );

    // fold along x = 655
    // fold along y = 447
    // fold along x = 327
    // fold along y = 223
    // fold along x = 163
    // fold along y = 111
    // fold along x = 81
    // fold along y = 55
    // fold along x = 40
    // fold along y = 27
    // fold along y = 13
    // fold along y = 6

    console.table( origamiMatrix );
    printMatrix( origamiMatrix );
}

function foldColumn( matrix, x ){
    // const maxCol = Math.max( ...matrix.map( elem => elem[ 0 ] ) );
    // console.log( `### MAX COL! ${ maxCol }` );
    let leftSideMatrix = [];
    for( let i = 0; i < matrix.length; i++ ){
        let matrixEl = matrix[ i ];
        if( matrixEl[ 0 ] > x ){
            let newMatrixEl = [ ...matrixEl ];
            // console.log( `#### BEFORE PUSHING NEW ELEMENT! ${ newMatrixEl }` );
            newMatrixEl[ 0 ] = x - ( newMatrixEl[ 0 ] - x );
            leftSideMatrix.push( newMatrixEl );
            // console.log( `#### PUSHING NEW ELEMENT! ${ newMatrixEl }` );
        }

        if( matrixEl[ 0 ] < x ){
            leftSideMatrix.push( matrixEl );
            // console.log( `#### NOTHING TO DO! ${ matrixEl }` );
        }
    }

    sortMatrix( leftSideMatrix )
    return leftSideMatrix;
}

function foldRow( matrix, y ){
    let upSideMatrix = [];
    for( let i = 0; i < matrix.length; i++ ){
        let matrixEl = matrix[ i ];
        if( matrixEl[ 1 ] > y ){
            let newMatrixEl = [ ...matrixEl ];
            newMatrixEl[ 1 ] = y - ( newMatrixEl[ 1 ] - y );
            upSideMatrix.push( newMatrixEl );
        }

        if( matrixEl[ 1 ] < y ){
            upSideMatrix.push( matrixEl );
        }
    }

    sortMatrix( upSideMatrix )
    return upSideMatrix;
}

function printMatrix( matrix ){
    const maxCol = Math.max( ...matrix.map( elem => elem[ 0 ] ) );
    const maxRow = Math.max( ...matrix.map( elem => elem[ 1 ] ) );

    for( let i = 0; i <= maxRow; i++ ){
        let printLine = '';
        for( let j = 0; j <= maxCol; j++ ){
            if( matrix.some( el => ( el[ 0 ] === j && el[ 1 ] === i ) ) ){
                printLine += ' X ';
            } else{
                printLine += ' - ';
            }
        }
        console.log( `## ${ i } -> ${ printLine } ` );
    }
}

function sortMatrix( matrix ){
    // Sort matrix
    matrix.sort( ( element_a, element_b ) => {
        return element_a[ 0 ] - element_b[ 0 ] || element_a[ 1 ] - element_b[ 1 ];
    } );
}

function deduplicateTuples( matrix ){
    return Array.from( new Set( matrix.map( JSON.stringify ) ), JSON.parse );
    // Check https://www.kirupa.com/javascript/removing_duplicate_arrays_from_array.htm
}

loadLines( './input-13.txt' )
    .then( input => {
        calculateOrigami( input );
    } ).catch( console.error );