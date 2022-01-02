import fs from 'fs';

const input = fs.readFileSync( './input-20.txt', { encoding: 'utf-8' } ).trimEnd();

runImageAlgorithm( input, 2 ); // Here be dragons, run the algorithm 50x and you'll get Part2..
runImageAlgorithm( input, 50 );

function runImageAlgorithm( input, times ){
    // console.log( JSON.stringify( algo ) );
    // console.log( JSON.stringify( inputImage ) );
    let [ algo, inputImage ] = input.split( '\r\n\r\n' ); // Apparently, input contains a return carriage character, didn't learn from challenge 4 bingo...
    algo = algo.split( '' ).map( ( char ) => +( char === '#' ) ); // 1st bit in the algorithm is a 1.. Noice
    inputImage = inputImage.split( '\n' ).map( ( row ) => row.split( '' ).map( ( char ) => +( char === '#' ) ) ); // It still contains return carriage character per image, but it does not matter for the image processing

    for( let t = 0; t < times; t++ ){
        const nextInputImage = [];
        for( let i = -1; i < inputImage.length + 1; i++ ){ // Account for infinite size of the images tadaaa, don't start a 0
            const nextInputImageRow = [];
            for( let j = -1; j < inputImage.length + 1; j++ ){
                const pixels = [];
                for( let distI = -1; distI <= 1; distI++ ){ // Adjacent in the matrix, to get all 9 input pixels in the input image
                    for( let distJ = -1; distJ <= 1; distJ++ ){
                        pixels.push( inputImage[ i + distI ]?.[ j + distJ ] ?? algo[ 0 ] & t % 2 ); // t % 2 to get whether the infinite characters should all be 0s or all be 1s
                    }
                }
                const num = parseInt( pixels.join( '' ), 2 ); // Join all 9 pixels and calculate index in algo
                nextInputImageRow.push( algo[ num ] ); // Push algo indexed number to the new image row
            }
            nextInputImage.push( nextInputImageRow ); // Push processed row
        }
        inputImage = nextInputImage; // Process again, output image becomes input image for the next iteration
    }

    console.log( inputImage.flat().filter( Boolean ).length );
}

