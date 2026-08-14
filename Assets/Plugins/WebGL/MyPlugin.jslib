// @ts-ignore
mergeInto(LibraryManager.library, {

    UpdateDropdowns: function (optionsWrapper) {
        // @ts-ignore
        var jsonString = UTF8ToString(optionsWrapper);

        var optionsObject = JSON.parse(jsonString);

        // @ts-ignore
        if (window.StyleListener) {
            // @ts-ignore 
            window.StyleListener.updateDropdowns(optionsObject.options);
        } else {
            console.error("External script not loaded yet!");
        }
    }, 

    SendImageToJS: function (arrayPtr, arrayLength){
        // @ts-ignore
        var rawBytes = new Uint8Array(wasmMemory.buffer, arrayPtr, arrayLength);

        var blob = new Blob([rawBytes], { type: 'image/png'});

        var blobUrl = URL.createObjectURL(blob);

        // @ts-ignore
        window.RenderListener.appendImage(blobUrl);
    }

});