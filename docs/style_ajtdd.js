import { Style } from './style.js'

export class AJTDDStyle extends Style
{
    crossExamLabelToggle;

    constructor(){
        super('AJTDD', ['1080p', '720p'], ['60fps', '30fps']);

        // Cross Examination Pop-Up Toggle
        this.crossExamLabelToggle = this.createToggle('ce', 'Cross Examination Pop-Up', true);
        this.editorInfo.push(this.crossExamLabelToggle);
        this.createBreak();
    }

    load(){
        super.load();
        // Dropdowns
        this.addUnityFunctionByDropdownValue(this.leftDropdown, 'change', 'AJTDD', 'ChangeLeftCutIn');
        this.addUnityFunctionByDropdownValue(this.rightDropdown, 'change', 'AJTDD', 'ChangeRightCutIn');

        // Radios
        this.addUnityFunctionByRadioValue(this.sizeRadio, 'change', 'AJTDD/Render', 'ChangeSize');
        this.addUnityFunctionByRadioValue(this.fpsRadio, 'change', 'AJTDD/Render', 'ChangeFPS');
       
        // Checkboxes
        this.addUnityFunctionByCheckboxValue(this.spoilerToggle, 'change', 'AJTDD', 'ToggleSpoilers');
        this.addUnityFunctionByCheckboxCode(this.crossExamLabelToggle, 'change', 'AJTDD', 'CallBooleanEvent', 0);

        // Buttons
        this.addUnityFunction(this.previewButton, 'click', 'AJTDD', 'Preview', 1);
        this.addUnityFunction(this.renderButton, 'click', 'AJTDD/Render', 'GetRenderInformation', 2);
        this.addUnityFunctionWithParameter(this.exitButton, 'click', 'AJTDD', 'CallNormalEvent', 0, 1);
        this.addDownloadFunction(this.templateDownloadButton, 'click', './templates/AJTDDCustomReference.psd', 'AJTDDCustomReference.psd');

        // Uploaders
        this.addUnityFunctionByFileInput(this.leftImageLoader, 'change', 'AJTDD', 'SendImageToLeftCutIn');
        this.addUploadClearFunction(this.leftImageLoader, 'click');
        this.addUnityFunctionByFileInput(this.rightImageLoader, 'change', 'AJTDD', 'SendImageToRightCutIn');
        this.addUploadClearFunction(this.rightImageLoader, 'click');
    }
}