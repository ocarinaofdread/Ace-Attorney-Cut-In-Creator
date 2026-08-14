import { Style } from './style.js'

export class AJTDDStyle extends Style
{
    constructor(){
        super('AJTDD');
        this.editorInfo[0] = document.createElement('p');
    }
}