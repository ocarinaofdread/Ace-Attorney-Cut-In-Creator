import { Style } from './style.js'

export class AAICStyle extends Style
{
    keepFlashToggle;
    cutInDisappearsToggle;

    constructor(){
        super('AAIC', ['1080p', '720p'], ['60fps', '30fps']);

        // Keep Flash Toggle
        this.keepFlashToggle = this.createToggle('flash', 'Keep Flash', true);
        this.editorInfo.push(this.keepFlashToggle);
        this.createBreak();

        // Cut-In Disappears Toggle
        this.cutInDisappearsToggle = this.createToggle('disappear', 'Cut-In Disappears', true);
        this.editorInfo.push(this.cutInDisappearsToggle);
        this.createBreak();
    }

    load(){
        super.load();
        // Dropdowns
        this.addUnityFunctionByDropdownValue(this.leftDropdown, 'change', 'AAIC', 'ChangeLeftCutIn');
        this.addUnityFunctionByDropdownValue(this.rightDropdown, 'change', 'AAIC', 'ChangeRightCutIn');

        // Radios
        this.addUnityFunctionByRadioValue(this.sizeRadio, 'change', 'AAIC/Render', 'ChangeSize');
        this.addUnityFunctionByRadioValue(this.fpsRadio, 'change', 'AAIC/Render', 'ChangeFPS');
       
        // Checkboxes
        this.addUnityFunctionByCheckboxValue(this.spoilerToggle, 'change', 'AAIC', 'ToggleSpoilers');
        this.addUnityFunctionByCheckboxCode(this.keepFlashToggle, 'change', 'AAIC', 'CallBooleanEvent', 0);
        this.addUnityFunctionByCheckboxCode(this.cutInDisappearsToggle, 'change', 'AAIC', 'CallBooleanEvent', 1);

        // Buttons
        this.addUnityFunction(this.previewButton, 'click', 'AAIC', 'Preview', 1);
        this.addUnityFunction(this.renderButton, 'click', 'AAIC/Render', 'GetRenderInformation', 2);
        this.addUnityFunctionWithParameter(this.exitButton, 'click', 'AAIC', 'CallNormalEvent', 0, 1);
        this.addDownloadFunction(this.templateDownloadButton, 'click', './templates/AAICCustomReference.psd', 'AAICCustomReference.psd');

        // Uploaders
        this.addUnityFunctionByFileInput(this.leftImageLoader, 'change', 'AAIC', 'SendImageToLeftCutIn');
        this.addUploadClearFunction(this.leftImageLoader, 'click');
        this.addUnityFunctionByFileInput(this.rightImageLoader, 'change', 'AAIC', 'SendImageToRightCutIn');
        this.addUploadClearFunction(this.rightImageLoader, 'click');
    }

}