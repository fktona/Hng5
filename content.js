

console.log("Hi, I have been injected whoopie!!!")

var recorder = null;
let now;

function onAccessApproved(stream) {
    recorder = new MediaRecorder(stream);
  
    recorder.start();

    recorder.onstop = function() {
        stream.getTracks().forEach(function(track) {
            if (track.readyState === "live") {
                track.stop()
            }
        });
    }

    recorder.ondataavailable = async function(event) { // Make the function async
        let recordedBlob = event.data;
        let url = URL.createObjectURL(recordedBlob);
         const formData = new FormData();
           formData.append('video', recordedBlob);
        

        // Convert the formData object to a Blob object
        const formDataBlob = new Blob([formData], { type: 'multipart/form-data' });
        now = formDataBlob

        // Send the formDataBlob to the server using the fetch() API
        const response = await fetch('https://google-chrome-extension.onrender.com/api/upload', {
            method: 'POST',
            body:formDataBlob,
        });
               
        if (response.status === 200) {
            console.log("done"); // Use console.log for success
        } else {
            console.error(`Failed to upload video. Status code: ${response.status}`);
        }
    }

}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "request_recording") {
        console.log("requesting recording");

        sendResponse(`processed: ${message.action}`);

        navigator.mediaDevices.getDisplayMedia({
            audio: true,
            video: {
                width: 9999999999,
                height: 9999999999
            }
        }).then((stream) => {
            onAccessApproved(stream);
        });
    }

    if (message.action === "stopvideo") {
     //   console.log(now);
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if (!recorder) return console.log("no recorder");

        recorder.stop();
    }
});