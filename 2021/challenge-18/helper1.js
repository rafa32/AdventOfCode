import fs from 'fs';

const input = fs.readFileSync( './input-18.txt', { encoding : 'utf-8' } ).trimEnd(); // Found a more straight-forward way to read content from the file -> 'fs' vs 'fs/promises'

function snailFishAddition( input ){
    console.log( JSON.stringify( input ) );
    const assignment = input.split( '\n' ).map( ( line ) => { // Processing of input
        let depth = 0;
        const elements = [];
        for( const char of line ){
            if( char === '[' ){
                depth++;
            } else if( char === ']' ){
                depth--;
            } else if( /\d/.test( char ) ){
                elements.push( {
                    num : +char,
                    depth,
                } );
            }
        }
        return elements;
    } );
    console.log( magnitude( assignment.reduce( ( accumulator, snailFishNum ) => add( accumulator, snailFishNum ) ) ) );

    /********************************************************************************************************************/ // -> Part 2
    let maxMagnitude = 0; // Store maximum value calculated so far while comparing
    for( let i = 0; i < assignment.length - 1; i++ ){ // For each pair and sub-sequent pair
        for( let j = 1; j < assignment.length; j++ ){
            maxMagnitude = Math.max(
                maxMagnitude,
                magnitude( add( assignment[ i ], assignment[ j ] ) ),
                magnitude( add( assignment[ j ], assignment[ i ] ) )
            );
        }
    }
    console.log( maxMagnitude );
}

/**
 * Usage of labelled statements -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
 * reduce/magnify -> // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue#using_continue_with_a_label
 */
function reduce( snailFishNum ){
    reduce: while( true ){
        for( let i = 0; i < snailFishNum.length - 1; i++ ){
            const elemA = snailFishNum[ i ];
            const elemB = snailFishNum[ i + 1 ];
            if( elemA.depth !== elemB.depth ){
                continue;
            }

            if( elemA.depth > 4 ){
                if( snailFishNum[ i - 1 ] ){
                    snailFishNum[ i - 1 ].num += elemA.num;
                }
                if( snailFishNum[ i + 2 ] ){
                    snailFishNum[ i + 2 ].num += elemB.num;
                }
                snailFishNum.splice( i, 2, {
                    num : 0,
                    depth : elemA.depth - 1,
                } );
                continue reduce;
            }
        }

        for( let fishNum = 0; fishNum < snailFishNum.length; fishNum++ ){
            const { num, depth } = snailFishNum[ fishNum ];
            if( snailFishNum[ fishNum ].num >= 10 ){
                snailFishNum.splice(
                    fishNum,
                    1,
                    {
                        num : Math.floor( num / 2 ),
                        depth : depth + 1,
                    },
                    {
                        num : Math.ceil( num / 2 ),
                        depth : depth + 1,
                    }
                );
                continue reduce;
            }
        }
        break;
    }
    return snailFishNum;
}

/**
 * Usage of labelled statements -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
 * reduce/magnify -> // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue#using_continue_with_a_label
 */
function magnitude( snailFishNum ){
    magnify: while( snailFishNum.length > 1 ){
        const maxDepth = snailFishNum.reduce( ( accumulator, elem ) => Math.max( accumulator, elem.depth ), 0 );
        for( let i = 0; i < snailFishNum.length; i++ ){
            const el = snailFishNum[ i ];
            if( el.depth === maxDepth ){
                snailFishNum.splice( i, 2, {
                    num : 3 * el.num + 2 * snailFishNum[ i + 1 ].num,
                    depth : el.depth - 1,
                } );
                continue magnify;
            }
        }
    }

    return snailFishNum[ 0 ].num;
}

function add( elemA, elemB ){
    return reduce( elemA.concat( elemB ).map( ( elem ) => ( { num : elem.num, depth : elem.depth + 1 } ) ) );
}

snailFishAddition( input );