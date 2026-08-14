import { AAICStyle } from './style_aaic.js';
import { AJTDDStyle } from './style_ajtdd.js';

const AAIC = new AAICStyle;
const AJTDD = new AJTDDStyle;
const styles = [ AAIC, AJTDD ];

const dropdown = document.getElementById("style");

dropdown.addEventListener("change", onChange);

function onChange(){
    // @ts-ignore
    var selectedValue = dropdown.value;
    unloadAll();
    switch(selectedValue){
        case "AAIC":
            AAIC.load();
            break;
        case "AJTDD":
            AJTDD.load();
            break;
    }
}

/*
*  NON-EVENT FUNCTIONS
*/
function unloadAll(){
    for (var i = 0; i < styles.length; i++){
        styles[i].unload();
    }
}
