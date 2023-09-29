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
          now = formData

        // Send the recordedBlob data to your server
        try {
            const response = await fetch('https://crud-server-d24p.onrender.com/api/video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ formData}),
            });
               
            if (response.status === 200) {
                console.log("done"); // Use console.log for success
            } else {
                console.error(`Failed to upload video. Status code: ${response.status}`);
            }
        } catch (error) {
            console.error("Error while uploading video:", error);
        }

        // Rest of your code for handling local playback and cleanup
        let a = document.createElement("a");
        a.style.display = "flex";
        a.href = url;
        a.download = "screen-recording.webm";
       console.log(url)
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);
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
        console.log(now);
        console.log("stopping video");
        sendResponse(`processed: ${message.action}`);
        if (!recorder) return console.log("no recorder");

        recorder.stop();
    }
});
