// ts-check
import { FFmpeg } from './modules/@ffmpeg/ffmpeg/dist/esm/index.js';
import './modules/gif.js/dist/gif.js';
import { toBlobURL } from './modules/@ffmpeg/util/dist/esm/index.js';

const waitToReturn = 3000;
const GIF = window.GIF;

var framesArray;
var currentDuration;
var currentTotalFrames;
var currentWidth;
var currentHeight;
var currentFileName;
var currentQuality;
var currentFormat = 'webp';

var frameIndex;
var logInformation;

var currentGif;

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

    changeFormat: function(format) {
        currentFormat = format;
    },

    beginRendering: async function(fps, totalFrames, width, height, quality, fileName){
        logInformation = [];
        logInformation[0] = "Loading " + (currentFormat == 'webp' ? 'FFMPEG' : 'GIF') + "...";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        currentTotalFrames = totalFrames;
        currentDuration = 1000/fps; // duration in ms
        currentWidth = width;
        currentHeight = height;
        frameIndex = 0;
        currentQuality = quality;

        if (currentFormat == 'webp') {
            framesArray = [];
            await loadFFmpeg();
        } else {
            currentGif = new GIF({
                workers: 1,
                repeat: -1,
                quality: Math.trunc(currentQuality / 10),
                workerScript: './modules/gif.js/dist/gif.worker.js',
                transparent: 0xFF00FF
            })
        }

        currentFileName = fileName + currentFormat;

        logInformation[1] = "Rendering frames... (0/" + Math.round(currentTotalFrames) + ")";
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        // @ts-ignore
        window.gameInstance.SendMessage(window.StyleListener.getCurrentStyleId() + '/Render', "Render");
    },

    addFrame : async function(bytes){
        const frame = new Uint8Array(bytes);

        // if (frameIndex >= 100){
        //     const canvas = document.createElement("canvas");
        //     canvas.width = currentWidth;
        //     canvas.height = currentHeight;

        //     const ctx = canvas.getContext("2d");
        //     const imageData = new ImageData(
        //         new Uint8ClampedArray(frame),
        //         currentWidth,
        //         currentHeight
        //     );

        //     ctx.putImageData(imageData, 0, 0);

        //     const blob = await new Promise(resolve =>
        //         canvas.toBlob(resolve, "image/png")
        //     );

        //     const blobUrl = URL.createObjectURL(blob);
        //     RenderListener.appendImage(blobUrl);
        // }

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
        if (currentFormat == 'webp') {
            framesArray.push(frame);
        } else {
            var frameModified = window.RenderListener.flipVertical(frame, currentWidth, currentHeight);
            frameModified = window.RenderListener.applyTransparencyKey(frameModified);
            
            currentGif.addFrame(new ImageData(frameModified, currentWidth, currentHeight), {
                delay: Math.round(currentDuration),
                copy: true
            });
        }
        // var image = document.createElement('img');
        // document.body.append(image);

        logInformation[1] = "Rendering frames... (" + frameIndex + 
                  "/" + Math.round(currentTotalFrames) + ")";
        console.log("FrameRenderer Received Frame " + frameIndex +
                    ". Calling GetNextFrame()");
        
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        // @ts-ignore
        window.gameInstance.SendMessage(window.StyleListener.getCurrentStyleId() + '/Render', 'GetNextFrame');
    },

    beginEncoding: async function(){
        logInformation[2] = `Rendering .${currentFormat}...`;
        // @ts-ignore
        window.StyleListener.rendererUpdate(getLogText());

        if (currentFormat == 'webp') {
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
                // framesArray[framesArray.length - 1]
            );

            await ffmpeg.exec([
                '-f', 'rawvideo',
                '-pix_fmt', 'rgba',
                '-s', `${currentWidth}x${currentHeight}`,
                '-r', `${1000 / currentDuration}`,
                '-i', 'frames.rgba',
                '-vf', 'vflip',

                '-c:v', 'libwebp_anim',
                // '-pix_fmt', 'yuva444p',
                '-lossless', '0',
                '-q:v', `${currentQuality}`,

                '-loop', '1',
                'output.webp'
            ]);

            logInformation[3] = `Downloading .${currentFormat}...`;
            // @ts-ignore
            window.StyleListener.rendererUpdate(getLogText());

            console.log(`Begin ${currentFormat} download`);

            const data = await ffmpeg.readFile('output.webp');
            // @ts-ignore
            const blob = new Blob([data.buffer], { type: `image/webp` });
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = currentFileName;
            a.click();

            URL.revokeObjectURL(url);

            logInformation[4] = `Downloaded .${currentFormat}!`;
            // @ts-ignore
            window.StyleListener.rendererUpdate(getLogText());

            setTimeout(async function reset() {
                logInformation = [];
                framesArray = [];

                try {
                    await ffmpeg.deleteFile('frames.rgba');
                } catch {}

                try {
                    await ffmpeg.deleteFile('output.webp');
                } catch {}

                // @ts-ignore
                window.StyleListener.changeLayout('editor');
            }, waitToReturn);
        } else {
            console.log("Begin gif encode");

            currentGif.on('finished', function(blob) {
                logInformation[3] = `Downloading .${currentFormat}...`;
                // @ts-ignore
                window.StyleListener.rendererUpdate(getLogText());
                console.log(`Begin ${currentFormat} download`);

                const url = URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = currentFileName;
                a.click();

                // document.body.removeChild(a);
                URL.revokeObjectURL(url);

                logInformation[4] = `Downloaded .${currentFormat}!`;
                // @ts-ignore
                window.StyleListener.rendererUpdate(getLogText());

                setTimeout(async function reset() {
                    logInformation = [];

                    // @ts-ignore
                    window.StyleListener.changeLayout('editor');
                }, waitToReturn);
            });

            currentGif.render();
        }
    },

    flipVertical: function(bytes, width, height) {
        const rowSize = width * 4;
        const flipped = new Uint8ClampedArray(bytes.length);

        for (let y = 0; y < height; y++) {
            const srcOffset = y * rowSize;
            const dstOffset = (height - 1 - y) * rowSize;
            flipped.set(bytes.subarray(srcOffset, srcOffset + rowSize), dstOffset);
        }

        return flipped;
    },

    applyTransparencyKey: function(bytes) {
        const out = new Uint8ClampedArray(bytes);
        for (let i = 0; i < out.length; i += 4) {
            if (out[i + 3] < 128) { // Transparent pixel
                out[i]     = 255; // R
                out[i + 1] = 0;   // G
                out[i + 2] = 255; // B
                out[i + 3] = 255; // A
            }
        }
        return out;
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