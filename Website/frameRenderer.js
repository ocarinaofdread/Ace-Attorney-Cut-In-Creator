// @ts-ignore
window.RenderListener = {
    appendImage : function(blobUrl){
        var image = document.createElement('img');
        image.src = blobUrl;
        image.style.display = 'block';
        image.style.width = '1920px';
        image.style.height = '1080px';

        document.body.append(image);
    }
}