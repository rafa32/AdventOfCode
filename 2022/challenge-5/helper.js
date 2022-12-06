import loadInput from '../../utils/loader.js';

const [ cratesInfo, operatorInstructions ] = loadInput().split( '\r\n\r\n' );

// /\d+(?!.*\d)/  -> We want the total # of crates, to create an Array[ [], [], ... ] with crate info
//      1) \d matches a digit 1+ times -> with (), can be made into a capturing group
//      2) Negative lookahead on any character (except line terminator) or digit 0+ times
// Result of regex: # of crates to provide as size to array creation, i.e. last digit of #cratesInfo as read from the input
//      https://regex101.com/ --> nice visual tool for constructing regular expressions/results
const crates = Array( +cratesInfo.match( /\d+(?!.*\d)/ )[ 0 ] )
    .fill() // Otherwise, crate array would be populated with null
    .map( () => [] );

function completeStackProcedure(){
    // Reverse lines as read from the input, so that Array[ [], [], ... ] can be populated with the crate info from bottom to top
    for( const line of cratesInfo.split( '\r\n' ).slice( 0, -1 ).reverse() ){
        // We're only concerned with crate info or cargo -> char every 4 indexes
        for( let i = 1; i < line.length; i += 4 ){
            // Ignore empty cargo, i.e. for this crate, there's no cargo, represented by blank space ' '
            if( line[ i ] !== ' ' ){
                // Because index is incrementing by 4, division gives us the multiplier (aka the "real" index). Subtract 1, since #i starts at 1
                crates[ ( i - 1 ) / 4 ].push( line[ i ] );
            }
        }
    }

    for( const line of operatorInstructions.split( '\r\n' ) ){
        const [ count, from, to ] = line.match( /\d+/g ); // --> move 6 from 4 to 3 -> count = 6, from = 4, to = 3
        // for( let i = 0; i < count; i++ ){
        //     const movingCargo = crates[ from - 1 ].pop(); // Remove top-of-the-stack cargo and push it to the correspondent crate
        //     crates[ to - 1 ].push( movingCargo ); // Added to the end of the array (i.e. the top of the stack)
        // }

        // # Part 2
        //      Keep the order of the cargos being moved. Instead of popping 1-by-1, move a complete set from a crate to another
        //      Simply move a subset of cargos from #crates[ from - 1 ] to #crates[ to - 1 ]
        //          -> Get the last #count cargos with splice( -count, +count )
        //          -> Spread array, so we can get individual cargos and push to #crates[ to - 1 ]
        const toMove = crates[ from - 1 ].splice( -count, +count );
        crates[ to - 1 ].push( ...toMove );
    }
    // Get the last cargo for each of the crates and join. Together, these cargos form the message to transmit
    const message = crates.map( ( crate ) => crate[ crate.length - 1 ] ).join( '' );
    console.log( message );
}

completeStackProcedure();