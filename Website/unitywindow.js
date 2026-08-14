const canvas = document.querySelector("canvas");
const sizeOptions = document.getElementsByName("size");

for (var i = 0; i < sizeOptions.length; i++){
    sizeOptions[i].addEventListener('change', onChange);
}

function onChange(){
    // @ts-ignore
    var selectedHeight = this.value;
    // @ts-ignore
    var selectedWidth = (selectedHeight / 9) * 16;
    
    canvas.style.height = selectedHeight + "px";
    canvas.style.width = selectedWidth + "px";
}
