var headerText = document.getElementById('headerText');
var helpTitle = document.getElementById('helpTitle');
var form = document.getElementById('form');
var chooseFile = document.getElementById('chooseFile');
var lbToBytes = document.getElementById('lbToBytes');
var lbEach = document.getElementById('lbEach');
var lbZip = document.getElementById('lbZip');
var lbAppendText = document.getElementById('lbAppendText');
var toBytes = document.getElementById('toBytes');
var convertToBytes = document.getElementById('convertToBytes');
var zipElement = document.getElementById('zip');
var appendText = document.getElementById('appendText');
var splitBtn = document.getElementById('splitBtn');
var timerElement = document.getElementById('timer');
var downloads = document.getElementById('downloads');
var resetBtn = document.getElementById('resetBtn');
var resetBtnText = document.getElementById('resetBtnText');
var file;
var indexFile = 1;
var $t = chrome.i18n;

var startByte;
var endByte;

headerText.textContent = $t.getMessage('headerText');
helpTitle.title = $t.getMessage('helpTitle');
lbToBytes.textContent = $t.getMessage('lbToBytes');
lbEach.textContent = $t.getMessage('lbEach');
lbZip.textContent = $t.getMessage('lbZip');
lbAppendText.textContent = $t.getMessage('lbAppendText');
resetBtnText.textContent = $t.getMessage('resetBtnText');
splitBtnText.textContent = $t.getMessage('splitBtnText');

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
    setMessage('');
})


function resetDownloads() {
    downloads.innerHTML = '';
    downloads.style.visibility = 'hidden';
    resetBtn.style.visibility = 'hidden';
    timerElement.style.visibility = 'hidden';
    chooseFile.disabled = false;
}

function splitFile() {
    if(!file || toBytes.value <= 0) return;

    chooseFile.disabled = true;
    timer = setInterval(showTimer, 1000);

    var reader = new FileReader();
    var lastSlice = 0;
    linesToSave = '';
    startByte = 0;
    endByte = (2).megaByteToBytes();
    initialTime = new Date();
    zip = new JSZip();

    reader.onloadstart = function() {
        splitBtn.disabled = true;
        setMessage($t.getMessage('readerStart'), 'ui info icon message', 'spinner loading icon');
    }

    reader.onerror = function(err) {
        setMessage(err, 'ui negative icon message', 'frown icon');
    }

    reader.onloadend = function(e) {
        if(e.target.readyState == FileReader.DONE) {
            var lastIndex = e.target.result.lastIndexOf("\n");
            var data = e.target.result.substr(0, lastIndex);
            readyToSave(data);

            lastSlice += data.length + 1;
            startByte = lastSlice;
            endByte = lastSlice +  (2).megaByteToBytes(); // read with chunk up to 2MB
            readBytes(this);
        }
    }

    readBytes(reader);

}

function readyToSave(str) {
    var limit = limitOfBytes();
    var fileBuffer = str.split("\n");

    fileBuffer.forEach(function(line) {
        var currentLengthLine = linesToSave.length + (line+"\n").length + appendText.value.length;

        if(currentLengthLine <= limit){
            linesToSave += line+"\n";
        }
        else{
            saveFile(linesToSave);
            linesToSave = line+"\n";
        }

    });

    if((endByte >= file.size) && (linesToSave.length > 0)) {
        saveFile(linesToSave);
        indexFile = 1;
    }


}

function readBytes(fr){
    var slice = file.slice(startByte, endByte);

    if(slice.size === 0) {
        if(zipElement.checked) saveZip();
        return;
    }

    fr.readAsBinaryString(slice);
}

function setMessage(text, className, iconClassName) {
    var messages = document.getElementById('messages');
    var contentMessage = document.getElementById('contentMessage');
    var i = document.getElementById('iconMessage');

    i.className = iconClassName;
    contentMessage.textContent = text;
    messages.className = className;
}

function saveFile(data) {
    var data = data? data+appendText.value : data;

    if(zipElement.checked) {
        zip.file(`${indexFile}-${file.name}`, new Blob([data]));
    }
    else{
        createDownloadLink({data: data, zip: false});
    }

    indexFile++;
}


function saveZip() {
    zip.generateAsync({type:"blob", compression:"DEFLATE"}).then(function(blob){ createDownloadLink({data: blob, zip: true}) });
}

function createDownloadLink(link) {
    var blob = link.zip? link.data : new Blob([link.data]);
    var fileDownload = link.zip? `${file.name}.zip` : `${indexFile}-${file.name}`;
    var div = document.createElement('div');
    var fileExport = document.createElement('a');
    var icon = document.createElement('i');
    icon.className = link.zip? 'file archive outline large icon' : 'file text outline large icon';
    div.appendChild(icon);
    fileExport.href = window.URL.createObjectURL(blob);
    fileExport.download = fileDownload;
    fileExport.textContent = fileDownload;
    div.className = 'item';
    div.appendChild(fileExport);
    downloads.appendChild(div);
    downloads.style.visibility = 'visible';
    splitBtn.disabled = false;
    resetBtn.style.visibility = 'visible';
    chooseFile.disabled = false;
    setMessage($t.getMessage('readerSuccess'), 'ui positive icon message', 'smile icon');
    clearInterval(timer);
}

function updateFileInfo() {
    var fileInfo = document.getElementById('fileInfo');

    if(file) {
        var sizeInKB = `<label class="ui tag label">${(file.size.bytesToKiloByte()).toLocaleString()} KB</label>`;
        var sizeInMB = `<label class="ui teal tag label">${(file.size.bytesToMegaByte()).toLocaleString()} MB</label>`;
        var sizeInGB = `<label class="ui brown tag label">${(file.size.bytesToGigaByte()).toLocaleString()} GB</label>`;
        fileInfo.innerHTML = `<label>${$t.getMessage('fileInfo')}</label> ${file.name} ${sizeInKB} ${sizeInMB} ${sizeInGB}`;
    }
    else {
        fileInfo.textContent = '';
    }
}

function updateSplitBtn() {
    if(file && toBytes.value > 0) {
        splitBtn.style.visibility = 'visible';
    }
    else {
        splitBtn.style.visibility = 'hidden';
    }
}

function limitOfBytes() {
    var fn = window['Number']['prototype'][convertToBytes.value];
    if (typeof fn === 'function') return fn.call(parseInt(toBytes.value));
}

function timeElapsed(initialTime, finalTime) {
    var ms = finalTime - initialTime;
    var secs = ms / 1000;

    var minutes = secs / 60 ; secs = secs % 60;
    var hours   = minutes / 60 ; minutes = minutes % 60;

    return {
        hours: Math.floor(hours),
        minutes: Math.floor(minutes),
        secs: Math.floor(secs),
        ms: Math.floor(ms),
        initialTime: initialTime,
        finalTime: finalTime
    }

}

function showTimer() {
    var time = timeElapsed(initialTime, new Date());
    timerElement.style.visibility = 'visible';
    document.getElementById('times').textContent = `${time.hours}:${time.minutes}:${time.secs}`;
}
