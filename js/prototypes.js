Number.prototype.bytesToKiloByte = function() {
    return this / Math.pow(10, 3);
}

Number.prototype.bytesToMegaByte = function() {
    return this / Math.pow(10, 6);
}

Number.prototype.bytesToGigaByte = function() {
    return this / Math.pow(10, 9);
}

Number.prototype.kiloByteToBytes = function () {
    return this * Math.pow(10, 3)
}

Number.prototype.megaByteToBytes = function() {
    return this * Math.pow(10, 6);
}

Number.prototype.gigaByteToBytes = function() {
    return this * Math.pow(10, 9);
}
