const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var data = {
    id: 10,
    name: 'manoj'
}

var token = jwt.sign(data, 'manojvaibhav');
console.log(token);

var decoded = jwt.verify(token, 'manojvaibhav');
console.log(decoded);