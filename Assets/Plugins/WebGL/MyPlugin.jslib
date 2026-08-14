// @ts-ignore
mergeInto(LibraryManager.library, {

    UpdateDropdowns: function (optionsWrapper) {
        // @ts-ignore
        var jsonString = UTF8ToString(optionsWrapper);

        var optionsObject = JSON.parse(jsonString);

        // @ts-ignore
        window.StyleListener.updateDropdowns(optionsObject.options);
    }, 

    BeginRendering: function (informationWrapper){
        // @ts-ignore
        var jsonString = UTF8ToString(informationWrapper);

        var informationObject = JSON.parse(jsonString);

        // @ts-ignore
        console.log("Asking for RenderListener at " + window.RenderListener);

        // @ts-ignore
        window.RenderListener.beginRendering(informationObject.fps,
                                             informationObject.totalFrames,
                                             informationObject.width,
                                             informationObject.height,
                                             informationObject.webpName);
    },

    SendFrameToJS: function (arrayPtr, arrayLength){
        // @ts-ignore
        var rawBytes = new Uint8Array(wasmMemory.buffer, arrayPtr, arrayLength);

        console.log("JS received frame. Sending to RenderListener...");

        // @ts-ignore
        window.RenderListener.addFrame(rawBytes);
    },

    BeginEncoding : function(){
        // @ts-ignore
        window.RenderListener.beginEncoding();
    },

    ResetLayoutToEditor : function(){
        // @ts-ignore
        window.StyleListener.changeLayout('editor');
    }

});