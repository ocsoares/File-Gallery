const form = document.getElementById('form'),
    fileInput = document.getElementById('file-input'),
    progressArea = document.getElementById('progress-area'),
    uploadedArea = document.getElementById('uploaded-area');
var ifRunning = false;

// form click Event
form!.addEventListener("click", () => {
    if (ifRunning) {
        alert('Please wait another file is uploading..');
        return;
    }

    fileInput!.click();
});


fileInput!.onchange = (e: any) => {
    let file = e.target.files[0]; //getting file [0] this means if user has selected multiple files then get first one only
    if (file) {
        let fileName = file.name; //getting file name
        if (fileName.length >= 12) { //if file name length is greater than 12 then split it and add ...
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadFile(fileName); //calling uploadFile with passing file name as an argument
    }
};

// file upload function
function uploadFile(name: any) {
    let xhr = new XMLHttpRequest(); //creating new xhr object (AJAX)
    xhr.open("POST", "/"); //sending post request to php uploader
    xhr.upload.addEventListener("progress", ({ loaded, total }) => { //file uploading progress event

        let fileLoaded = Math.floor((loaded / total) * 100);  //calculate percentage of loaded file size
        let fileTotal = Math.floor(total / 1000); //gettting total file size in KB from bytes
        let fileSize;
        // if file size is less than 1024 then add only KB else convert this KB into MB
        fileSize = fileTotal < 1024 ? fileTotal + " KB" : (loaded / (1024 * 1024)).toFixed(2) + " MB";

        let progressHTML = `<li class="row">
                                <i class='bx bx-file file__profgress-icon'></i>
                                <div class="content">
                                    <div class="details">
                                        <span class="name">${name} • Uploading</span>
                                        <span class="percent">${fileLoaded}%</span>
                                    </div>
                                <div class="progress-bar">
                                    <div class="progress" style="width: ${fileLoaded}%"></div>
                              </div>
                            </div>
                          </li>`;
        // uploadedArea.innerHTML = ""; //uncomment this line if you don't want to show upload history
        uploadedArea!.classList.add("onprogress");
        progressArea!.innerHTML = progressHTML;
        if (loaded == total) {
            progressArea!.innerHTML = "";
            let uploadedHTML = `<li class="row">
                                    <div class="content upload">
                                        <i class='bx bx-file file__profgress-icon'></i>
                                    <div class="details">
                                        <span class="name">${name} • Uploaded</span>
                                        <span class="size">${fileSize}</span>
                                    </div>
                                    </div>
                                    <i class='bx bx-check file__check-icon'></i>
                                </li>`;
            uploadedArea!.classList.remove("onprogress");
            // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
            uploadedArea!.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history

            ifRunning = false;
        }
    });
    let data = new FormData(form as any); //FormData is an object to easily send form data
    xhr.send(data); //send form data
    ifRunning = true;
}
