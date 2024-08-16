const easymidi = require('easymidi');
const { testing } = require('./test');
const { convertHexToXyBri } = require('./bridge-utils/colorConvert');

// const input = new easymidi.Input('Arturia KeyStep 37');

// input.on('noteon', (msg) => {
//     console.log(msg);
//     if (msg.note == 60) {
//         const color = convertHexToXyBri('00e1e4');
//         testing(color);
//     } else if (msg.note == 62) {
//         const color = convertHexToXyBri('0000ff');
//         testing(color);
//     }
// });
