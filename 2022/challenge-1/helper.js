import loadInput from '../../utils/loader.js';

const rawInput = loadInput();

function calorieCounter(){
    const elves = rawInput
        .split( '\r\n\r\n' ) // Adding \r to filter, ensures that carriage return is excluded
        .map( ( elf ) =>
            // console.log( `--> ${ JSON.stringify( elf.split( '\r\n' ).map( Number ).reduce( ( acc, n ) => acc + n ), null, 2 ) }` );
            elf
                .split( '\r\n' ) // Same here
                .map( Number ) // Type conversion to number of all calorie values
                .reduce( ( acc, n ) => acc + n )
        )
        .sort( ( a, b ) => b - a ); // We want descending order by calorie count
    // # Part 1
    console.log( elves[ 0 ] );
    // console.log( elves[ 0 ] + elves[ 1 ] + elves[ 2 ] ); Why not?
    console.log( elves.slice( 0, 3 ).reduce( ( acc, n ) => acc + n ) );
}

calorieCounter();