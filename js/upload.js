var headerText = document.getElementById('headerText');
var helpTitle = document.getElementById('helpTitle');
var form = document.getElementById('form');
var chooseFile = document.getElementById('chooseFile');
var lbToBytes = document.getElementById('lbToBytes');
var lbEach = document.getElementById('lbEach');
var lbAppendText = document.getElementById('lbAppendText');
var toBytes = document.getElementById('toBytes');
var convertToBytes = document.getElementById('convertToBytes');
var appendText = document.getElementById('appendText');
var splitBtn = document.getElementById('splitBtn');
var downloads = document.getElementById('downloads');
var resetBtn = document.getElementById('resetBtn');
var resetBtnText = document.getElementById('resetBtnText');
var file;
var indexFile = 1;
var $t = chrome.i18n;

headerText.textContent = $t.getMessage('headerText');
helpTitle.title = $t.getMessage('helpTitle');
lbToBytes.textContent = $t.getMessage('lbToBytes');
lbEach.textContent = $t.getMessage('lbEach');
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
}

function splitFile() {
    if(!file) return;

    var reader = new FileReader();
    reader.readAsText(file);
    var toSave = '';

    reader.onloadstart = function() {
        splitBtn.disabled = true;
        setMessage($t.getMessage('readerStart'), 'ui info icon message', 'spinner loading icon');
    }

    reader.onerror = function(err) {
        setMessage(err, 'ui negative icon message', 'frown icon');
    }

    reader.onload = function (event) {
        var fileBuffer = event.target.result.split("\n");

        fileBuffer.forEach(function(line, index){
            if((toSave+appendText.value).length <= limitOfBytes()) {
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
        setMessage($t.getMessage('readerSuccess'), 'ui positive icon message', 'smile icon');

    }

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
    var div = document.createElement('div');
    var fileExport = document.createElement('a');
    var icon = document.createElement('i');
    icon.className = 'file text outline icon';
    div.appendChild(icon);
    fileExport.href = window.URL.createObjectURL(new Blob([data.trimRight()], {type: file.type}));
    fileExport.download = `${indexFile}-${file.name}`;
    fileExport.textContent = `${indexFile}-${file.name}`;
    div.className = 'item';
    div.appendChild(fileExport);
    downloads.appendChild(div);
    downloads.style.visibility = 'visible';
    resetBtn.style.visibility = 'visible';
    indexFile++;
}

function updateFileInfo() {
    var fileInfo = document.getElementById('fileInfo');

    if(file) {
        var sizeInKB = `<label class="ui tag label">${(file.size.bytesToKiloByte()).toFixed(3)} KB</label>`;
        var sizeInMB = `<label class="ui teal tag label">${(file.size.bytesToMegaByte()).toFixed(3)} MB</label>`;
        var sizeInGB = `<label class="ui brown tag label">${(file.size.bytesToGigaByte()).toFixed(3)} GB</label>`;
        fileInfo.innerHTML = `<label>${$t.getMessage('fileInfo')}</label> ${file.name} ${sizeInKB} ${sizeInMB} ${sizeInGB}`;
    }
    else {
        fileInfo.textContent = '';
    }
}

function updateSplitBtn() {
    splitBtn.style.visibility = file? 'visible' : 'hidden';
}

function limitOfBytes() {
    var fn = window['Number']['prototype'][convertToBytes.value];
    if (typeof fn === 'function') return fn.call(parseInt(toBytes.value));
}
