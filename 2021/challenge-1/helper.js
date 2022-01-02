import fs from 'fs';
import readLine from 'readline';

async function readFile( filePath ){
    const readInterface = readLine.createInterface( {
        input : fs.createReadStream( filePath ),
        console : false
    } );
    let index = 0, increment = 0, prevLine = '';
    for await ( const line of readInterface ){
        // Each line in input-1.txt will be successively available here as `line`.
        ( line - prevLine > 0 && index !== 0 ? increment++ : increment );
        console.log( `** CURRENT LINE: #${ index++ } -> ${ line } | (${ ( line - prevLine > 0 ? 'increment' : 'decrement' ) })` );
        prevLine = line;
    }

    console.log( `** INCREMENTS = ${ increment }` );
}

async function readFileByMeasurements( filePath, measurement = 1 ){
    const readInterface = readLine.createInterface( {
        input : fs.createReadStream( filePath ),
        console : false
    } );
    let fileInput = [];
    for await ( const line of readInterface ){
        fileInput.push( line );
    }
    let increment = 0;
    for( let i = measurement; i < fileInput.length ; i++ ){
        let firstMeasurement = Number( fileInput[ i - measurement ]);
        let secondMeasurement = Number( fileInput[ i ] );
        if( secondMeasurement - firstMeasurement > 0 ){
            increment++;
        }
        // console.log( `** FIRST MEASUREMENT = ( ${fileInput[ i ]} + ${fileInput[ i + 1 ]} + ${fileInput[ i + 2 ]} ) = ${firstMeasurement} )` );
        // console.log( `** SECOND MEASUREMENT = ( ${fileInput[ i + 1 ]} + ${fileInput[ i + 2 ]} + ${fileInput[ i + 3 ]} ) = ${secondMeasurement} )` );
        // console.log( `**** => ( ${ ( secondMeasurement > firstMeasurement ? 'increment' : ( secondMeasurement === firstMeasurement ? '(no change)' : 'decrement' ) ) } )` );
        // console.log( `**** => ( ${fileInput[ i ]} + ${fileInput[ i + 1 ]} + ${fileInput[ i + 2 ]} ) - ( ${fileInput[ i + 1 ]} + ${fileInput[ i + 2 ]} + ${fileInput[ i + 3 ]} ) = ${ firstMeasurement } - ${ secondMeasurement } = ${ secondMeasurement - firstMeasurement } ( ${ ( secondMeasurement > firstMeasurement ? 'increment' : ( secondMeasurement === firstMeasurement ? '(no change)' : 'decrement' ) ) } )` );
        console.log( `**** => ( ${secondMeasurement} ) - ( ${firstMeasurement} ) = ${ secondMeasurement - firstMeasurement } ( ${ ( secondMeasurement > firstMeasurement ? 'increment' : ( secondMeasurement === firstMeasurement ? '(no change)' : 'decrement' ) ) } )` );
    }

    console.log( `** INCREMENTS = ${ increment }` );

}

readFileByMeasurements( './input-1.txt', 3 );