import { Style } from './style.js'

export class AAICStyle extends Style
{
    keepFlashToggle;
    cutInDisappearsToggle;

    constructor(){
        super('AAIC');

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
       
        // Checkboxes
        this.addUnityFunctionByCheckboxValue(this.spoilerToggle, 'change', 'AAIC', 'ToggleSpoilers');
        this.addUnityFunctionByCheckboxCode(this.keepFlashToggle, 'change', 'AAIC', 'CallBooleanEvent', 0);
        this.addUnityFunctionByCheckboxCode(this.cutInDisappearsToggle, 'change', 'AAIC', 'CallBooleanEvent', 1);

        // Buttons
        this.addUnityFunction(this.previewButton, 'click', 'AAIC', 'Preview', 1);
        this.addUnityFunction(this.renderButton, 'click', 'AAIC/Render', 'Render', 2);
        this.addUnityFunctionWithParameter(this.exitButton, 'click', 'AAIC', 'CallNormalEvent', 0, 1);
    }

}