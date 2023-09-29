document.addEventListener("DOMContentLoaded", ()=>{
    // GET THE SELECTORS OF THE BUTTONS
    const startVideoButton = document.querySelector("button#start_video")
    const stopVideoButton = document.querySelector("button#stop_video")
const recordingClass = document.querySelector(".recording");

  // Function to show the recording class
  function showRecordingClass() {
    recordingClass.style.display = "flex";
  }

  // Function to hide the recording class
  function hideRecordingClass() {
    recordingClass.style.display = "none";
  }
    // adding event listeners

    startVideoButton.addEventListener("click", ()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "request_recording"},  function(response){
                if(!chrome.runtime.lastError){
                  showRecordingClass()
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 14')
                }
            })
        } )
    })


    stopVideoButton.addEventListener("click", ()=>{
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id, {action: "stopvideo"},  function(response){
                if(!chrome.runtime.lastError){
                  recordingClass.style.display = "none";
                    console.log(response)
                } else{
                    console.log(chrome.runtime.lastError, 'error line 27')
                }
            })
        } )
    })
})