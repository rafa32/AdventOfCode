import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function determineRiskPath( input ){
    const cave = [];
    // Process input, save last input line
    for( let [ i, line ] of input.entries() ){
        cave.push( line.split( '' ).map( Number ) );
        console.log( `## LINE ${ i } => ${ cave[ i ] }` );
    }

    const graph = [];
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
        }
    }

    for( const vertex of graph ){
        vertex.adjs = [ [ 0, 1 ], [ 0, -1 ], [ 1, 0 ], [ -1, 0 ] ].map( ( [ aX, aY ] ) => {
            const normalizedX = aX + vertex.x;
            const normalizedY = aY + vertex.y;
            return graph.find( item => item.x === normalizedX && item.y === normalizedY );
        } ).filter( elem => elem );
    }

    // Find start (0, 0) and end (cave[ 0 ].length, cave.length) and kick-start Dijkstra's -> check implementation here
    // The shortest distance is [${ path += item.value }].`);
    let start = graph.find( item => item.x === 0 && item.y === 0 );
    let end = graph.find( item => item.x === cave[ 0 ].length - 1 && item.y === cave.length - 1 );
    const path = findPath( graph, start, end );

    /*****************************************************************************/
    let risk = 0;
    for( const item of path.slice( 1 ) ){
        risk += item.value;
    }

    console.log( risk );
}


function findPath( graph, start, end ){
    const distance = {};
    const prev = {};
    const queue = [];

    for( const vertex of graph ){
        distance[ vertex.key ] = Infinity;
        queue.push( vertex );
    }
    distance[ start.key ] = 0;

    while( queue.length ){
        const { item, index } = findMinDistance();
        queue.splice( index, 1 )
        if( item === end ){
            break;
        }

        for( const adj of item.adjs ){
            if( !queue.includes( adj ) ){
                continue;
            }
            const alt = distance[ item.key ] + adj.value;
            if( alt < distance[ adj.key ] ){
                distance[ adj.key ] = alt;
                prev[ adj.key ] = item;
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

    function findMinDistance(){
        let MAX_MIN = Infinity;
        let minItem = null;
        let index = -1;
        for( let i = 0; i < queue.length; i += 1 ){
            const item = queue[ i ];
            if( MAX_MIN > distance[ item.key ] ){
                minItem = item;
                MAX_MIN = distance[ item.key ];
                index = i;
            }
        }
        return { item : minItem, index };
    }
}

loadLines( './input-15.txt' )
    .then( input => {
        determineRiskPath( input )
    } ).catch( console.error );