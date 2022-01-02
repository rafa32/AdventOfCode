import fs from 'fs/promises';

function loadLines( file ){
    return new Promise( async( resolve, reject ) => {
        fs.readFile( file, { encoding : 'utf-8' } )
            .then( text => resolve( text.split( /\r?\n/ ) ) )
            .catch( reject )
    } )
}

function readBitsTransmission( input ){
    let bits = input[ 0 ]
        .split( '' )
        .map( ( digit ) => parseInt( digit, 16 ).toString( 2 ).padStart( 4, '0' ) )
        .join( '' );

    // const part1= readPacket( bits );
    // console.log( part1 );

    let [ part2, part1 ] = readPacket( bits );
    console.log( part1, part2 );

}


function readPacket( bits ){
    let version = parseInt( bits.substr( 0, 3 ), 2 );
    let type = parseInt( bits.substr( 3, 3 ), 2 );

    let number = 0;
    let position = 0;

    if( type === 4 ){
        position = 6;
        bits = bits.substr( 6 );
        let more = true;
        while( more ){
            more = bits[ 0 ] === '1';
            number = 16 * number + parseInt( bits.substr( 1, 4 ), 2 );
            position += 5;
            bits = bits.substr( 5 );
        }
        return [ number, version, position ];
    }
    /**********************************************************************/ // Part 2
    let subValues = [];

    if( bits[ 6 ] === '0' ){
        let subLength = parseInt( bits.substr( 7, 15 ), 2 );
        let sub = bits.substr( 22, subLength );
        while( sub.length > 0 ){
            let result = readPacket( sub );
            subValues.push( result[ 0 ] );
            version += result[ 1 ];
            sub = sub.substr( result[ 2 ] );
        }
        position += 22 + subLength;
    } else{
        let packets = parseInt( bits.substr( 7, 11 ), 2 );
        position = 18;
        let sub = bits.substr( 18 );
        for( let i = 0; i < packets; i++ ){
            let result = readPacket( bits.substr( position ) );
            subValues.push( result[ 0 ] );
            version += result[ 1 ];
            position += result[ 2 ];
            sub = sub.substr( result[ 2 ] );
        }
    }

    // Switch-case for the type rules
    if( type === 0 ){
        number = subValues.reduce( ( a, v ) => a + v, 0 );
    } else if( type === 1 ){
        number = subValues.reduce( ( a, v ) => a * v, 1 );
    } else if( type === 2 ){
        number = Math.min( ...subValues );
    } else if( type === 3 ){
        number = Math.max( ...subValues );
    } else if( type === 5 ){
        number = subValues[ 0 ] > subValues[ 1 ] ? 1 : 0;
    } else if( type === 6 ){
        number = subValues[ 0 ] < subValues[ 1 ] ? 1 : 0;
    } else if( type === 7 ){
        number = subValues[ 0 ] === subValues[ 1 ] ? 1 : 0;
    }

    // return num; // --> Version number addwed in all packets = Part 1
    // [ num ] pos 0 -> reduce to get all sub values
    return [ number, version, position ]; // --> Added num to the array, will be the result of recursively calling readPacket() to all sub packets Part 2
}

loadLines( './input-16.txt' )
    .then( input => {
        readBitsTransmission( input );
    } ).catch( console.error );