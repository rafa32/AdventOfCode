import loadInput from '../../utils/loader.js';

const rucksacks = loadInput().split( '\r\n' );
// Each char index represents its priority. For upper-case chars, add 26 to loop over the priority list
const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function organizeRucksacks(){
    let sumPriorities = 0;

    for( const rucksack of rucksacks ){
        // Slice to get the left/right compartments of the rucksack
        const leftCompartment = rucksack.slice( 0, rucksack.length / 2 );
        const rightCompartment = rucksack.slice( rucksack.length / 2 );
        // Find every duplicate present in both left/right compartments
        const duplicateChars = [ ...new Set( leftCompartment ) ].filter( ( char ) => rightCompartment.includes( char ) );
        // Compute the priority score for this rucksack, as an aggregate of the priorities of each duplicate found for this rucksack
        sumPriorities += duplicateChars
            // Get all priority values for each of the duplicate characters
            .map( ( duplicateChar ) => {
                if( lowerCaseChars.includes( duplicateChar ) ){
                    const index = lowerCaseChars.indexOf( duplicateChar );
                    return index + 1;
                }
                if( upperCaseChars.includes( duplicateChar ) ){
                    const index = upperCaseChars.indexOf( duplicateChar );
                    return index + 27;
                }
                // Error handling?...
            } )
            // Reduce the array of priorities for this rucksack
            .reduce( ( acc, current ) => acc + current, 0 );
    }

    console.log( sumPriorities );
}

function organizeRucksacksByTypes(){
    let sumPriorities = 0;

    for( let i = 0; i < rucksacks.length; i += 3 ){
        const firstRucksack = [ ...rucksacks[ i ] ]; // Transforming into an Array[], to make it easier to find badges (i.e., chars present in all 3 rucksacks of the group)
        const secondRucksack = rucksacks[ i + 1 ];
        const thirdRucksack = rucksacks[ i + 2 ];
        // Badge is the character present in all 3 rucksacks belonging to the group being scanned
        const elfBadge = firstRucksack.find(
            ( item ) => secondRucksack.includes( item ) && thirdRucksack.includes( item )
        );

        if( lowerCaseChars.includes( elfBadge ) ){
            sumPriorities += lowerCaseChars.indexOf( elfBadge ) + 1;
        } else{
            sumPriorities += upperCaseChars.indexOf( elfBadge ) + 27;
        }
    }

    console.log( sumPriorities );
}

organizeRucksacks();
organizeRucksacksByTypes();