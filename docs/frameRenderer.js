import { FFmpeg } from './modules/@ffmpeg/ffmpeg/dist/esm/index.js';
import { toBlobURL } from './modules/@ffmpeg/util/dist/esm/index.js';

const waitToReturn = 3000;

var framesArray;
var currentDuration;
var currentTotalFrames;
var currentWidth;
var currentHeight;
var currentWebpName;

var frameIndex;
var logInformation;

// @ts-ignore
const ffmpeg = new FFmpeg();
var ffmpegLoaded = false;

async function loadFFmpeg(){
    if (ffmpegLoaded){
        return;
    }

   await ffmpeg.load({
        coreURL: await toBlobURL(
            `./ffmpeg/ffmpeg-core.js`,
            'text/javascript'
        ),
        wasmURL: await toBlobURL(
            `./ffmpeg/ffmpeg-core.wasm`,
            'application/wasm'
        )
    });

    console.log("FFmpeg loaded!");

    ffmpegLoaded = true;
}

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

    beginRendering: async function(fps, totalFrames, width, height, webpName){
        logInformation = [];
        logInformation[0] = "Loading FFMPEG...";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());
        
        await loadFFmpeg();

        framesArray = [];
        currentTotalFrames = totalFrames;
        currentDuration = 1000/fps; // duration in ms
        currentWidth = width;
        currentHeight = height;
        currentWebpName = webpName;
        frameIndex = 0;

        logInformation[1] = "Rendering frames... (0/" + currentTotalFrames + ")";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        // @ts-ignore
        window.gameInstance.SendMessage("AAIC/Render", "Render");
    },

    addFrame : async function(bytes){
        const frame = new Uint8Array(bytes);

        console.log(
            "Frame",
            frameIndex + 1,
            "length:",
            frame.length,
            "first bytes:",
            frame.slice(0, 20)
        );

        let min = 255;
        let max = 0;

        for (let i = 0; i < frame.length; i++) {
            if (frame[i] < min) min = frame[i];
            if (frame[i] > max) max = frame[i];
        }

        console.log( "Frame", frameIndex + 1, "min:", min, "max:", max);

        frameIndex++;
        framesArray.push(frame);

        logInformation[1] = "Rendering frames... (" + frameIndex + 
                  "/" + currentTotalFrames + ")";
        console.log("FrameRenderer Received Frame " + frameIndex +
                    ". Calling GetNextFrame()");
        
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        // @ts-ignore
        window.gameInstance.SendMessage('AAIC/Render', 'GetNextFrame');
    },

    beginEncoding: async function(){
        logInformation[2] = "Rendering .webp...";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        console.log("Begin webp encode");

        const frameSize = currentWidth * currentHeight * 4;
        const rawVideo = new Uint8Array(frameSize * framesArray.length);

        for (let i = 0; i < framesArray.length; i++) {
            rawVideo.set(
                framesArray[i],
                i * frameSize
            );
        }

        await ffmpeg.writeFile(
            'frames.rgba',
            rawVideo
        );

        await ffmpeg.exec([
            '-f', 'rawvideo',
            '-pix_fmt', 'rgba',
            '-s', `${currentWidth}x${currentHeight}`,
            '-r', `${1000 / currentDuration}`,
            '-i', 'frames.rgba',
            '-vf', 'vflip',

            '-c:v', 'libwebp',
            '-lossless', '0',
            '-q:v', '80',

            '-loop', '1',
            'output.webp'
        ]);

        logInformation[3] = "Downloading .webp...";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        console.log("Begin webp download");

        const data = await ffmpeg.readFile('output.webp');
        // @ts-ignore
        const blob = new Blob([data.buffer], { type: "image/webp" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = currentWebpName;
        a.click();

        URL.revokeObjectURL(url);

        logInformation[4] = "Downloaded .webp!";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        setTimeout(async function reset() {
            framesArray = [];
            logInformation = [];

            try {
                await ffmpeg.deleteFile('frames.rgba');
            } catch {}

            try {
                await ffmpeg.deleteFile('output.webp');
            } catch {}

            // @ts-ignore
            window.StyleListener.changeLayout('editor');
        }, waitToReturn);
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