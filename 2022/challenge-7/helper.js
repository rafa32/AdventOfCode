import loadInput from '../../utils/loader.js';

const commandLines = loadInput().split( '\r\n' );

const LIST_CMD = 'ls';
const DIR_SYMBOL = 'dir';
const PROMPT = '$';

const ROOT_DIRECTORY = '/';
const PARENT_DIRECTORY = '..';

const dirSizes = { ROOT_DIRECTORY : 0 };
const dirPaths = [ ROOT_DIRECTORY ];

const requiredSpace = 40000000;

function constructFileSystem(){
    for( let i = 1; i < commandLines.length; i++ ){
        const [ , cmd, dir ] = commandLines[ i ].split( ' ' );
        // Switch-case the different command types
        if( cmd === LIST_CMD ){
            for( i++; i < commandLines.length; i++ ){
                const innerFiles = commandLines[ i ].split( ' ' );
                if( innerFiles[ 0 ] === PROMPT ){
                    i--;
                    break;
                }
                if( innerFiles[ 0 ] !== DIR_SYMBOL ){
                    for( const dirPath of dirPaths ){
                        dirSizes[ dirPath ] = ( dirSizes[ dirPath ] ?? 0 ) + +innerFiles[ 0 ];
                    }
                }
            }
        } else{
            if( dir === PARENT_DIRECTORY ){
                dirPaths.pop();
            } else{
                dirPaths.push( `${ dirPaths.at( -1 ) }${ dir }/` );
            }
        }
    }
}

constructFileSystem();

// Part #1
console.log(
    Object.values( dirSizes )
        .filter( ( dirSize ) => dirSize <= 100000 )
        .reduce( ( acc, dirSize ) => acc + dirSize )
);

// Part #2
const dirCandidates = Object.values( dirSizes ).filter( ( dirSize ) => dirSize >= dirSizes[ ROOT_DIRECTORY ] - requiredSpace );
console.log( Math.min( ...dirCandidates ) );