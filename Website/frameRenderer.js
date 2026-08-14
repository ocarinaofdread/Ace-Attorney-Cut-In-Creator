// @ts-ignore
import createWebP from './node_modules/webp-wasm/dist/esm/webp-wasm.js'

const waitToReturn = 3000;

var framesArray ;
var currentDuration;
var currentTotalFrames;
var currentWidth;
var currentHeight;
var currentWebpName;

var frameIndex;
var logInformation;

// @ts-ignore
const webpModule = await createWebP();

// @ts-ignore
window.RenderListener = {
    appendImage : function(blobUrl){
        var image = document.createElement('img');
        image.src = blobUrl;
        image.style.display = 'block';
        image.style.width = '1920px';
        image.style.height = '1080px';

        document.body.append(image);
    },

    beginRendering: function(fps, totalFrames, width, height, webpName){

        framesArray = [];
        logInformation = ["", "", ""];


        currentTotalFrames = totalFrames;
        currentDuration = 1000/fps; // duration in ms
        currentWidth = width;
        currentHeight = height;
        currentWebpName = webpName;

        frameIndex = 0;
        logInformation[0] = "Rendering frames... (0/" + currentTotalFrames + ")";
        
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());
    },

    addFrame : function(bytes){
        const config = {
            lossless: 0,
            quality: 80,
            method: 4
        }

        const newFrame = {
            data: bytes.slice(),
            duration: currentDuration,
            has_config: true,
            config: config
        }

        framesArray.push(newFrame);

        frameIndex++;
        logInformation[0] = "Rendering frames... (" + frameIndex + 
                  "/" + currentTotalFrames + ")";
        console.log("FrameRenderer Received Frame " + frameIndex +
                    ". Calling GetNextFrame()");
        
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        // @ts-ignore
        window.gameInstance.SendMessage('AAIC/Render', 'GetNextFrame');
    },

    beginEncoding: async function(){
        logInformation[1] = "Rendering .webp...";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        console.log("Begin webp encode");

        setTimeout(async function webpEncode() {
            // @ts-ignore
            const webpData = await webpModule.encodeAnimation(currentWidth, currentHeight, true, framesArray);

            logInformation[2] = "Downloading .webp...";
            // @ts-ignore
            window.StyleListener.rendererUpdate(getLogText());

            // console.log("Download .webp!");

            // @ts-ignore
            const blob = new Blob([webpData], { type: "image/webp" });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = currentWebpName;
            a.click();

            URL.revokeObjectURL(url);

            logInformation[3] = "Downloaded .webp!";
            // @ts-ignore
            window.StyleListener.rendererUpdate(getLogText());

            setTimeout(() => {
                framesArray = [];
                logInformation = [];
                // @ts-ignore
                window.StyleListener.changeLayout('editor');
            }, waitToReturn);
        }, 2000);
    }
};

// @ts-ignore
console.log("RenderListener Loaded! at " + window.RenderListener);

function getLogText(){
    var text = "";

    logInformation.forEach(info => {
        text += info;
        text += "<br>";
    })

    return text;
}