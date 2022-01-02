import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function determineRiskPath( input ){
    let cave = []; // can't be const due to re-assignment when processing caveCopy
    // Process input, save last input line
    for( let [ i, line ] of input.entries() ){
        cave.push( line.split( '' ).map( Number ) );
        // console.log( `## LINE ${ i } => ${ cave[ i ] }` );
    }

    const repetitions = 5;
    for( let caveRow = 0; caveRow < cave.length; caveRow++ ){
        let row = cave[ caveRow ];
        for( let rep = 1; rep < repetitions; rep += 1 ){
            row = row.map( cell => add( cell, 1 ) );
            cave[ caveRow ] = cave[ caveRow ].concat( row );
        }
    }
    /*****************************************************************************/
    let caveCopy = cave.map( row => row.slice() );
    for( let rep = 1; rep < repetitions; rep += 1 ){
        caveCopy = caveCopy.map( row => row.map( cell => add( cell, 1 ) ) );
        cave = cave.concat( caveCopy );
    }

    /*****************************************************************************/
    const graph = [], dictionary = {};
    for( let caveRow = 0; caveRow < cave.length; caveRow++ ){
        for( let caveColumn = 0; caveColumn < cave[ caveRow ].length; caveColumn++ ){
            const key = `${ caveColumn }:${ caveRow }`;
            const item = {
                value : cave[ caveRow ][ caveColumn ],
                key,
                x : caveColumn,
                y : caveRow
            }
            graph.push( item );
            dictionary[ key ] = item;
        }
    }

    for( const vertex of graph ){
        vertex.adjs = [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ].map( ( [ aX, aY ] ) => {
            const normalizedX = aX + vertex.x;
            const normalizedY = aY + vertex.y;
            const key = `${ normalizedX }:${ normalizedY }`;
            return dictionary[ key ];
        } ).filter( elem => elem );
    }

    // Find start (0, 0) and end (cave[ 0 ].length, cave.length) and kick-start Dijkstra's (+ prio queue) -> check implementation here
    // The shortest distance is [${ path += item.value }].`);
    let start = graph.find( item => item.x === 0 && item.y === 0 );
    let end = graph.find( item => item.x === cave[ 0 ].length - 1 && item.y === cave.length - 1 );
    const path = findMinPath( graph, start, end );

    /*****************************************************************************/
    let risk = 0;
    for( const item of path.slice( 1 ) ){
        risk += item.value;
    }

    console.log( risk );
}

function findMinPath( graph, start, end ){
    const distance = {};
    const prev = {};
    const queue = [];

    for( const vertex of graph ){
        distance[ vertex.key ] = Infinity;
        queue.push( vertex );
    }
    distance[ start.key ] = 0;

    while( queue.length ){
        const item = queue.shift();
        if( item === end ){
            break;
        }

        for( const adj of item.adjs ){
            if( !queue.includes( adj ) ) {
                continue;
            }
            const alt = distance[ item.key ] + adj.value;
            if( alt < distance[ adj.key ] ){
                distance[ adj.key ] = alt;
                prev[ adj.key ] = item;
                updateQueue( adj, distance, queue ); // Could use consts and an inner function
            }
        }
    }

    const path = [ end ];
    let current = end.key;
    while( current !== start.key ){
        const prevElem = prev[ current ];
        path.unshift( prevElem );
        current = prevElem.key;
    }

    return path;
}

function updateQueue( item, distance, queue ){
    let itemDistance = distance[ item.key ];
    let queueIndex = queue.indexOf( item );
    for( let index = 0; index < queueIndex; index += 1 ){
        const vert = queue[ index ];
        const dist = distance[ vert.key ];
        if( itemDistance < dist ){
            queue.splice( queueIndex, 1 );
            queue.splice( index, 0, item );
            return;
        }
    }
}

function add( coordX, coordY ){
    const coordZ = coordX + coordY;
    if( coordZ > 9 ){
        return 1; //retun
    }
    return coordZ;
}

loadLines( './input-15.txt' )
    .then( input => {
        determineRiskPath( input )
    } ).catch( console.error );