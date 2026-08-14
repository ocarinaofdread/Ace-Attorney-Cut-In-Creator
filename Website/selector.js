import { AAICStyle } from './style_aaic.js';
import { AJTDDStyle } from './style_ajtdd.js';

const AAIC = new AAICStyle;
const AJTDD = new AJTDDStyle;
const styles = [ AAIC, AJTDD ];
var currentStyle;

const styleDropdown = document.getElementById("style");

const onStyleChange = () => {
    // @ts-ignore
    var selectedValue = styleDropdown.value;
    unloadAll();
    switch(selectedValue){
        case "AAIC":
            currentStyle = AAIC;
            AAIC.load();
            break;
        case "AJTDD":
            currentStyle = AJTDD;
            AJTDD.load();
            break;
    }
}

styleDropdown.addEventListener("change", onStyleChange);

// @ts-ignore
window.StyleListener = {
    updateDropdowns : function(options){
        currentStyle.updateDropdown('#leftDropdown', options, true);
        currentStyle.updateDropdown('#rightDropdown', options, true);
    }
};

/*
*  NON-EVENT FUNCTIONS
*/
function unloadAll(){
    for (var i = 0; i < styles.length; i++){
        styles[i].unload();
    }
}
