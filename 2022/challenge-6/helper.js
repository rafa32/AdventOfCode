import loadInput from '../../utils/loader.js';

const rawInput = loadInput();

let ind, markerSize = 14; // Part #1 -> 4;
// Start on index #markerSize of datastream buffer, we're concerned with subsets [] of chars of size #markerSize
for( ind = markerSize; ind < rawInput.length; ind++ ){
    // Iterate over the raw input and slice the input 
    const prevMarkerChars = rawInput.slice( ind - markerSize, ind );
    // Make it into a new Set(), if all characters in the slice are different, we have found the marker
    if( new Set( prevMarkerChars ).size === prevMarkerChars.length ){
        break;
    }
}

console.log( ind );