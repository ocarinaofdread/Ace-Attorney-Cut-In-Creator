import { Style } from './style.js'

export class DSStyle extends Style
{
    keepFlashToggle;
    crossExamLabelToggle;

    constructor(){
        super('DS', ['768p', '192p'], ['60fps', '30fps']);

        // Keep Flash Toggle
        this.keepFlashToggle = this.createToggle('flash', 'Keep Flash', true);
        this.editorInfo.push(this.keepFlashToggle);
        this.createBreak();

        // Cross Examination Pop-Up Toggle
        this.crossExamLabelToggle = this.createToggle('ce', 'Cross Examination Pop-Up', true);
        this.editorInfo.push(this.crossExamLabelToggle);
        this.createBreak();
    }

    load(){
        super.load();
        // Dropdowns
        this.addUnityFunctionByDropdownValue(this.leftDropdown, 'change', 'DS', 'ChangeLeftCutIn');
        this.addUnityFunctionByDropdownValue(this.rightDropdown, 'change', 'DS', 'ChangeRightCutIn');

        // Radios
        this.addFormatFunctionByRadioValue(this.formatRadio, 'change');
        this.addUnityFunctionByRadioValue(this.sizeRadio, 'change', 'DS/Render', 'ChangeSize');
        this.addUnityFunctionByRadioValue(this.fpsRadio, 'change', 'DS/Render', 'ChangeFPS');
       
        // Checkboxes
        this.addUnityFunctionByCheckboxValue(this.spoilerToggle, 'change', 'DS', 'ToggleSpoilers');
        this.addUnityFunctionByCheckboxCode(this.keepFlashToggle, 'change', 'DS', 'CallBooleanEvent', 0);
        this.addUnityFunctionByCheckboxCode(this.crossExamLabelToggle, 'change', 'DS', 'CallBooleanEvent', 1);

        // Buttons
        this.addUnityFunction(this.previewButton, 'click', 'DS', 'Preview', 1);
        this.addUnityFunction(this.renderButton, 'click', 'DS/Render', 'GetRenderInformation', 2);
        this.addUnityFunctionWithParameter(this.exitButton, 'click', 'DS', 'CallNormalEvent', 0, 1);
        this.addDownloadFunction(this.templateDownloadButton, 'click', './templates/DSCustomReference.psd', 'DSCustomReference.psd');

        // Uploaders
        this.addUnityFunctionByFileInput(this.leftImageLoader, 'change', 'DS', 'SendImageToLeftCutIn');
        this.addUploadClearFunction(this.leftImageLoader, 'click');
        this.addUnityFunctionByFileInput(this.rightImageLoader, 'change', 'DS', 'SendImageToRightCutIn');
        this.addUploadClearFunction(this.rightImageLoader, 'click');
    }

}