import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function simulateTrickShot( input ){
    const [ minX, maxX, minY, maxY ] = input[ 0 ].match( /-?\d+/g ).map( Number );
    // let best = 0;
    let count = 0;
    for( let row = -1000; row <= 1000; row += 1 ){ // Yeah, not to forget that it can go as high as the sky, give it enough space for gravity to due its trick
        for( let column = 1; column <= 1000; column += 1 ){
            const result = testProbe( column, row );
            if( result != null ){
                // best = result; console.log( count ); --> Part 1
                count++; // --> Part 2
            }
        }
    }

    console.log( count );

    function testProbe( startX, startY ){
        let currentX = 0;
        let currentY = 0;
        let velocityX = startX;
        let velocityY = startY;
        let maxHeight = 0;
        while( currentX <= maxX && currentY >= minY ){
            currentX += velocityX;
            currentY += velocityY;
            velocityX += velocityX < 0 ? 1 : velocityX > 0 ? -1 : 0; // Check rules for how to calculate velocity at each step
            velocityY -= 1;
            if( currentY > maxHeight ){
                maxHeight = currentY;
            }
            if( currentX >= minX && currentX <= maxX && currentY >= minY && currentY <= maxY ){
                return maxHeight;
            }
        }
        return null;
    }
}

loadLines( './input-17.txt' )
    .then( input => {
        simulateTrickShot( input )
    } ).catch( console.error );