import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function startBingo( input ){
    const startingInputPos = 2;
    const bingoNumbers = input[ 0 ].split( /[ ,]+/ ).filter( Boolean );
    const bingoBoards = constructBingoBoards( input, startingInputPos );
    bingoNumbers.forEach( bingoNumber => playBingo( bingoNumber, bingoBoards ) );
}

function playBingo( bingoNumber, bingoBoards ){
    for( let i = 0; i < bingoBoards.length; i++ ){
        let currentBoard = bingoBoards[ i ];
        let foundBingoNumber = false;
        currentBoard.rows.forEach( row => {
            row.forEach( el => {
                if( el === bingoNumber && !currentBoard.numbersMatched.includes( bingoNumber ) ){
                    currentBoard.numbersMatched.push( bingoNumber );
                }
            } )
        } );

        checkBingo( currentBoard );
        if( currentBoard.hasBingo && currentBoard.score == null ){
            calculateBoardScore( currentBoard, bingoNumber );
            console.log( ` ## BINGO BOARD ON INDEX ${ i }! || SCORE: ${ currentBoard.score }` )
        }
    }
}

function calculateBoardScore( board, bingoNumber ){
    const unmarkedNumbers = board.rows.flat().filter( elem => !board.numbersMatched.includes( elem ) );
    const somOfUnmarkedNumbers = unmarkedNumbers.reduce( ( el1, el2) => +el1 + +el2, 0 );
    // console.log( `# NUMBERS MATCHED! ${ JSON.stringify( board.numbersMatched ) }` );
    // console.log( `# UNMARKED NUMBERS! ${ JSON.stringify( unmarkedNumbers ) }` );
    // console.log( `# SUM OF UNMARKED NUMBERS! ${ JSON.stringify( somOfUnmarkedNumbers ) }` );

    board.score = somOfUnmarkedNumbers * bingoNumber;
}

function checkBingo( board ){
    if( !board || Object.keys( board ).length < 1 ){
        return;
    }

    let matchInRows = board.rows.some( row => row.every( elem => board.numbersMatched.includes( elem ) ) );
    let matchInColumns = board.cols.some( col =>  col.every( elem => board.numbersMatched.includes( elem ) ) );

    board.hasBingo = matchInRows || matchInColumns;
}

function constructBingoBoards( input, startingInputPos ){
    const bingoBoards = [];
    for( let i = startingInputPos, newRawBoard = [], numBoards = 0; i < input.length; i++ ){
        let boardLine = input[ i ];
        if( !boardLine ){
            addNewBingoBoard( bingoBoards, numBoards++, newRawBoard );
            newRawBoard = [];
        } else{
            newRawBoard.push( boardLine.split( /[ ]+/ ).filter( Boolean ) );
        }
    }

    return bingoBoards;
}

function addNewBingoBoard( bingoBoards, index, boardInput ){
    let newBingoBoard = bingoBoards[ index ] = {};
    newBingoBoard.numbersMatched = [];
    newBingoBoard.rows = boardInput;
    newBingoBoard.cols = boardInput[ 0 ].map( ( _, colIndex ) => boardInput.map( row => row[ colIndex ] ) ); // Transposing rows
    newBingoBoard.hasBingo = false;
}

loadLines( './input-4.txt' )
    .then( input => {
        startBingo( input );
    } ).catch( console.error );