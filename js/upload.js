const chooseFile = document.getElementById('chooseFile');
const form = document.getElementById('form');

// chooseFile.addEventListener('click', function(e) {
//   chrome.fileSystem.chooseEntry({type: 'openWritableFile'}, function(fileEntry) {
//     fileEntry.file(function(file) {
//       var reader = new FileReader();
//       reader.onloadend = function(e) {
//         console.log(e.target.result);
//         var bb = new BlobBuilder();
//         bb.append(e.target.result);
//         var blob = bb.getBlob(); 
//         location.href = window.webkitURL.createObjectURL(blob);
//       };
//       reader.readAsText(file);
// 	  });

//   });

// });

chooseFile.addEventListener('change', function () {
    file = this.files[0];
    // fileSize.textContent = `${(file.size.bytesToKiloByte()).toFixed(3)} kB.`;

    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function (event) {
        let fileBuffer = event.target.result;
        let fileExport = document.createElement('a');
        fileExport.href = window.URL.createObjectURL(new Blob([fileBuffer], {type: file.type}));
        fileExport.download = `arquivo-${file.name}`;
        fileExport.textContent = `arquivo-${file.name}`;
        form.appendChild(fileExport);
    }

    
});

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