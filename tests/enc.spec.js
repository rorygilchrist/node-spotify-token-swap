var encryption = require('../encryption');
var expect = require('chai').expect;

describe('Encryption', function() {
    var encryptedString;

    it ('Encrypts a string', function(next) {
        encryptedString = encryption.encrypt('hello world');
        expect(encryptedString).not.to.equal('hello world');
        expect(encryptedString).to.have.length.above(0);

        next();
    });

    it ('Decrypts an encrypted string', function(next) {
        var decryptedString = encryption.decrypt(encryptedString);
        expect(decryptedString).to.have.length.above(0);
        expect(decryptedString).to.equal('hello world');

        next();
    });
});
