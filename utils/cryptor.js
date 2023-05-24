require("dotenv").config();
// password from ENV variable
const password = process.env.CRYPT_PASSWORD;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');
const iv = Buffer.from(crypto.randomBytes(16));
const ivstring = iv.toString('hex').slice(0, 16);

exports.encrypt = async (value) => {
    let encryptedPassword = await bcrypt.hash(value, saltRounds);
    return encryptedPassword;
}
exports.isValidPassword = async (password, encryptedPassword) => {
    return await bcrypt.compare(password, encryptedPassword);
}
const sha1 = (input) => {
    return crypto.createHash('sha1').update(input).digest();
}

const password_derive_bytes = (password, salt, iterations, len) => {
    let key = Buffer.from(password + salt);
    for (let i = 0; i < iterations; i++) {
        key = sha1(key);
    }
    if (key.length < len) {
        let hx = password_derive_bytes(password, salt, iterations - 1, 20);
        for (let counter = 1; key.length < len; ++counter) {
            key = Buffer.concat([key, sha1(Buffer.concat([Buffer.from(counter.toString()), hx]))]);
        }
    }
    return Buffer.alloc(len, key);
}

exports.encode = async (string) => {
    const key = password_derive_bytes(password, '', 100, 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring);
    const part1 = cipher.update(string, 'utf8');
    const part2 = cipher.final();
    const encrypted = Buffer.concat([part1, part2]).toString('base64');
    return encrypted;
};

exports.decode = async (string) => {
    const key = password_derive_bytes(password, '', 100, 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, ivstring);
    let decrypted = decipher.update(string, 'base64', 'utf8');
    decrypted += decipher.final();
    return decrypted;
};


// // testing above functions
// let obj = {
//     name: "firstName&LastName",
//     num: "1234567890"
// }
// const call = async () => {
//     let encoded = await this.encode(JSON.stringify(obj));
//     console.log(encoded);
//     let decoded = await this.decode(encoded);
//     console.log(JSON.parse(decoded));
// };

// (async () => {
//     call();
// })().catch(err => {
//     console.error(err);
// });