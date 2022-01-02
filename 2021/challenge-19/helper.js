import fs from 'fs';

const input = fs.readFileSync( './input-19.txt', { encoding: 'utf-8' } ).trimEnd();

const rotations = [
    ( [ x, y, z ] ) => [ x, y, z ],
    ( [ x, y, z ] ) => [ y, z, x ],
    ( [ x, y, z ] ) => [ z, x, y ],
    ( [ x, y, z ] ) => [ -x, z, y ],
    ( [ x, y, z ] ) => [ z, y, -x ],
    ( [ x, y, z ] ) => [ y, -x, z ],
    ( [ x, y, z ] ) => [ x, z, -y ],
    ( [ x, y, z ] ) => [ z, -y, x ],
    ( [ x, y, z ] ) => [ -y, x, z ],
    ( [ x, y, z ] ) => [ x, -z, y ],
    ( [ x, y, z ] ) => [ -z, y, x ],
    ( [ x, y, z ] ) => [ y, x, -z ],
    ( [ x, y, z ] ) => [ -x, -y, z ],
    ( [ x, y, z ] ) => [ -y, z, -x ],
    ( [ x, y, z ] ) => [ z, -x, -y ],
    ( [ x, y, z ] ) => [ -x, y, -z ],
    ( [ x, y, z ] ) => [ y, -z, -x ],
    ( [ x, y, z ] ) => [ -z, -x, y ],
    ( [ x, y, z ] ) => [ x, -y, -z ],
    ( [ x, y, z ] ) => [ -y, -z, x ],
    ( [ x, y, z ] ) => [ -z, x, -y ],
    ( [ x, y, z ] ) => [ -x, -z, -y ],
    ( [ x, y, z ] ) => [ -z, -y, -x ],
    ( [ x, y, z ] ) => [ -y, -x, -z ],
]; // Storing possible rotations to ease scanning of beacon1 rotation


/**
 * Usage of labelled statements -> https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
 * scanner2Loop -> // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/continue#using_continue_with_a_label
 */
function scanBeacons( input ){
    const scanners = input.split( '\r\n\r\n' ).map( ( scanner ) => { // Apparently, input contains a return carriage character... Each scanner will be separate by \r\n
        return scanner
            .split( '\n' )
            .slice( 1 )
            .map( ( line ) => line.split( ',' ).map( Number ) );
    } );

    // Figure out all overlapping detection cubes --> inspired by stackoverflow
    const transforms = scanners.map( () => ( {} ) );
    transforms[ 0 ] = {
        0 : [
            {
                rotation : rotations[ 0 ],
                distance : [ 0, 0, 0 ],
            },
        ],
    };
    // Loop over scanners
    for( let i = 1; i < scanners.length; i++ ){
        const scanner1 = scanners[ i ];

        scannerToLoop: for( let j = 0; j < scanners.length; j++ ){
            if( i === j ){
                continue;
            }

            const scanner2 = scanners[ j ];
            for( const rotation of rotations ){
                const distCounts = {};
                for( const beacon1 of scanner1 ){
                    const [ x1, y1, z1 ] = rotation( beacon1 );
                    for( const beacon2 of scanner2 ){
                        const [ x2, y2, z2 ] = beacon2;
                        const distance = [ x2 - x1, y2 - y1, z2 - z1 ].join();
                        distCounts[ distance ] = ( distCounts[ distance ] ?? 0 ) + 1;
                        if( distCounts[ distance ] === 12 ){
                            transforms[ i ][ j ] = [
                                {
                                    rotation : rotation,
                                    distance : distance.split( ',' ).map( Number ),
                                },
                            ];
                            continue scannerToLoop;
                        }
                    }
                }
            }
        }
    }

    // Make sure all scanners can be transformed relative to scanner 0
    while( transforms.some( ( t ) => !t[ 0 ] ) ){
        for( let i = 1; i < transforms.length; i++ ){
            if( transforms[ i ][ 0 ] ){
                continue;
            }

            for( const j in transforms[ i ] ){
                if( !transforms[ j ][ 0 ] ){
                    continue;
                }

                transforms[ i ][ 0 ] = transforms[ i ][ j ].concat( transforms[ j ][ 0 ] );
                break;
            }
        }
    }

    // Find the unique beacons -> Part 1
    const beacons = new Set( scanners[ 0 ].map( ( beacon ) => beacon.join() ) );
    for( let i = 1; i < scanners.length; i++ ){
        let scanner = scanners[ i ];
        for( const { rotation, distance } of transforms[ i ][ 0 ] ){
            scanner = transform( scanner, rotation, distance );
        }
        for( const beacon of scanner ){
            beacons.add( beacon.join() );
        }
    }
    console.log( beacons.size ); // 323

    // Find max distance (Manhattan distance https://en.wikipedia.org/wiki/Taxicab_geometry) -> Part 2
    const scannerCoords = [ [ 0, 0, 0 ] ];
    for( let num = 1; num < scanners.length; num++ ){
        let scanner = [ [ 0, 0, 0 ] ];
        for( const { rotation, distance } of transforms[ num ][ 0 ] ){
            scanner = transform( scanner, rotation, distance );
        }
        scannerCoords.push( scanner[ 0 ] );
    }

    // let maxDistance = 0;
    // for( let i = 0; i < scannerCoords.length - 1; i++ ){
    //     const [ x1, y1, z1 ] = scannerCoords[ i ];
    //     for( let j = 1; j < scannerCoords.length; j++ ){
    //         const [ x2, y2, z2 ] = scannerCoords[ j ];
    //         maxDistance = Math.max(
    //             maxDistance,
    //             Math.abs( x2 - x1 ) + Math.abs( y2 - y1 ) + Math.abs( z2 - z1 )
    //         );
    //     }
    // }

    let maxDistance = 0;
    for( let i = 0; i < scannerCoords.length - 1; i++ ){
        const [ x1, y1, z1 ] = scannerCoords[ i ];
        for( let j = 1; j < scannerCoords.length; j++ ){
            const [ x2, y2, z2 ] = scannerCoords[ j ];
            maxDistance = Math.max(
                maxDistance,
                Math.abs( x2 - x1 ) + Math.abs( y2 - y1 ) + Math.abs( z2 - z1 )
            );
        }
    }
    console.log( maxDistance );
}

function transform( scanner, rotation, distance ){
    return scanner.map( ( beacon ) => {
        return rotation( beacon ).map( ( coord, i ) => {
            return coord + distance[ i ];
        } );
    } );
}

scanBeacons( input );