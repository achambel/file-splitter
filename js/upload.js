var form = document.getElementById('form');
var chooseFile = document.getElementById('chooseFile');
var toBytes = document.getElementById('toBytes');
var convertToBytes = document.getElementById('convertToBytes');
var appendText = document.getElementById('appendText');
var splitBtn = document.getElementById('splitBtn');
var downloads = document.getElementById('downloads');
var resetBtn = document.getElementById('resetBtn');
var file;
var indexFile = 1;

form.addEventListener('submit', function(e) {
    e.preventDefault();
});

toBytes.addEventListener('change', updateSplitBtn);

convertToBytes.addEventListener('change', updateSplitBtn);

chooseFile.addEventListener('change', function () {
    file = this.files[0];

    updateFileInfo();
    updateSplitBtn();

});

splitBtn.addEventListener('click', splitFile);

form.addEventListener('reset', function() {
    file = null;
    updateFileInfo();
    updateSplitBtn();
    resetDownloads();
})


function resetDownloads() {
    downloads.innerHTML = '';
    resetBtn.style.display = 'none';
}

function splitFile() {
    if(!file) return;

    var reader = new FileReader();
    reader.readAsText(file);
    var toSave = '';

    reader.onloadstart = function() {
        splitBtn.value = 'Por favor, aguarde, dividindo arquivo...';
        splitBtn.disabled = true;
    }

    reader.onload = function (event) {
        var fileBuffer = event.target.result.split("\n");

        fileBuffer.forEach(function(line, index){
            if((toSave+"\n"+appendText.value).length <= limitOfBytes()) {
                toSave += line+"\n";
            }
            else {
                saveFile(toSave);
                toSave = line+"\n";
            }

            if((fileBuffer.length - 1) === index) {
                saveFile(toSave);
                indexFile = 1;
            }
        });

        splitBtn.disabled = false;
        splitBtn.value = 'Dividir';

    }

    console.log("Tam arquivo:" + file.size);
    console.log("Tam por arquivo:" + limitOfBytes());
    console.log("Total arquivos: " + file.size / limitOfBytes());
}

function saveFile(data) {
    var data = data? data+appendText.value : data;
    var div = document.createElement('div');
    var fileExport = document.createElement('a');
    fileExport.href = window.URL.createObjectURL(new Blob([data], {type: file.type}));
    fileExport.download = `${indexFile}-${file.name}`;
    fileExport.textContent = `${indexFile}-${file.name}`;
    div.appendChild(fileExport);
    downloads.appendChild(div);
    resetBtn.style.display = 'block';
    indexFile++;
}

function updateFileInfo() {
    var fileInfo = document.getElementById('fileInfo');

    if(file) {
        var sizeInKB = `${(file.size.bytesToKiloByte()).toFixed(3)} KB.`;
        var sizeInMB = `${(file.size.bytesToMegaByte()).toFixed(3)} MB.`;
        var sizeInGB = `${(file.size.bytesToGigaByte()).toFixed(3)} GB.`;
        fileInfo.textContent = `File: ${file.name} - (${sizeInKB}) - (${sizeInMB}) - (${sizeInGB})`;
    }
    else {
        fileInfo.textContent = '';
    }
}

function updateSplitBtn() {
    splitBtn.style.display = file? 'block' : 'none';
}

function limitOfBytes() {
    var fn = window['Number']['prototype'][convertToBytes.value];
    if (typeof fn === 'function') return fn.call(parseInt(toBytes.value));
}
