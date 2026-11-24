import { AAICStyle } from './style_aaic.js';
import { AJTDDStyle } from './style_ajtdd.js';
import { DSStyle } from './style_ds.js';

const AAIC = new AAICStyle;
const AJTDD = new AJTDDStyle;
const DS = new DSStyle;
const styles = [ AAIC, AJTDD, DS ];
var currentStyle ;

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
        case "DS":
            currentStyle = DS;
            DS.load();
            break;
    }
}

styleDropdown.addEventListener("change", onStyleChange);

// @ts-ignore
window.StyleListener = {
    updateDropdowns : function(options){
        currentStyle.updateDropdown('#leftDropdown', options, true);
        currentStyle.updateDropdown('#rightDropdown', options, true);
    },

    changeLayout : function(type){
        currentStyle.changeLayout(type);
    },

    rendererUpdate : function(updateText){
        currentStyle.logCode.innerHTML = updateText;
    },

    getCurrentStyleId : function(){
        return currentStyle.styleId;
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
