import fs from 'fs';
import path from 'path';

const DEFAULT_INPUT_FILENAME = 'input.txt';

export default function loadInput( fileName = null ){
    // Get the current running module directory from the args
    //  Note: Might be worth to explore import.meta in the future, in placement of require.main[.filename]
    const dirName = path.dirname( process.argv[ 1 ] );
    const fileRef = path.join( dirName, fileName || DEFAULT_INPUT_FILENAME );
    // Return Array[] with each input item allocated to an index
    return fs.readFileSync( fileRef, { encoding : 'utf-8' } );
    // Async alternative using 'fs/promises'
        // return new Promise( async( resolve, reject ) => {
        //     fs.readFile( fileRef, { encoding : 'utf-8' } )
        //         .then( text => resolve( text.split( /\r?\n/ ) ) )
        //         .catch( reject )
        // } );
};