const { tools } = require('../src/lib/data');
console.log("Total tools:", tools.length);
console.log(tools.map(t => t.slug).sort());
