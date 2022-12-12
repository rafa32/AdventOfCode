import loadInput from '../../utils/loader.js';

const cpuInstructions = loadInput().split( '\r\n' );
const cycleRegisters = [];

const noopInstruction = 'noop';
let register = 1, sumSignalStrength = 0;

const CRT = [];
const CRTWidth = 40, CRTheight = 6;
const litPixel = ' █ ', darkPixel = '   ';
const CRTtoString = [];

function calculateSignalStrength(){
    for( const cpuInstruction of cpuInstructions ){
        // Each instruction can be separate to either 'addx' or 'noop' types of instructions.
        //  - If reading a 'noop'-type of instruction, write off the register value and proceed
        //  - If reading an 'addx X'-type of instruction, write off the register value for the current and next cycle.
        //      At the end of the next cycle, add the value back to the current register
        const [ instruction, value ] = cpuInstruction.split( ' ' );
        if( instruction === noopInstruction ){
            cycleRegisters.push( register );
        } else{
            cycleRegisters.push( register );
            cycleRegisters.push( register );
            register += +value;
        }
    }
    // For each 40th cycle, starting on the 20th cycle, sum to the signal strength the result of multiplying the cycle register and the cycle index
    for( let i = 20; i <= 220; i += 40 ){
        sumSignalStrength += cycleRegisters[ i - 1 ] * i;
    }
}

function processCRTOutput(){
    // CRT panel consists of a 40px/6px grid
    const crtPanelSize = CRTWidth * CRTheight;
    // Represents the sprite offset position, since register X represents the middle of the horizontal position of the sprite
    const sprite = [ -1, 0, 1 ];
    // Process the CRT panel as a sequence. Later, when printing out, the CRT output will be divided in the correct row/column of the gri
    for( let i = 0; i < crtPanelSize; i++ ){
        const cycleRegister = cycleRegisters[ i ];
        // If the sprite falls within the range of the current register, lit a pixel, or turn off otherwise.
        //  i % CRTWidth -> gives index between 0-40
        if( sprite.some( spritePixel => ( cycleRegister + spritePixel ) === i % CRTWidth ) ){
            CRT.push( litPixel );
        } else{
            CRT.push( darkPixel );
        }
    }
    // Process the CRT output according to the panel dimensions (40px/6px grid)
    for( let i = 0; i < CRTheight; i++ ){
        CRTtoString.push(
            // Each row of the grid is a slice of the sequence, starting on (CRTWidth * i) until (CRTWidth * i + CRTWidth)
            CRT.slice( CRTWidth * i, CRTWidth * i + CRTWidth ).join( '' )
        );
    }
}

// Part #1
calculateSignalStrength();
console.log( sumSignalStrength );
// Part #2
processCRTOutput();
console.log( CRTtoString.join( '\r\n' ) );