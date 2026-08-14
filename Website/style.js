export class Style {
    styleId = "";
    container = document.createElement('p');
    editorInfo = [];
    previewInfo = [];
    renderInfo = [];

    // editor
    previewButton;
    renderButton;
    spoilerToggle;
    leftDropdown;
    rightDropdown;

    // preview
    exitButton;

    // render
    logCode;

    constructor(id){
        this.styleId = id;

        // [ EDITOR ]
            // Preview Button
            this.previewButton = this.createButton('preview', 'Preview');
            this.editorInfo.push(this.previewButton);

            // Render Button
            this.renderButton = this.createButton('render', 'Render');
            this.editorInfo.push(this.renderButton);
            this.createBreak();

            // Spoiler Sprites Toggle
            this.spoilerToggle = this.createToggle('spoiler', 'Spoiler Sprites', false);
            this.editorInfo.push(this.spoilerToggle);
            this.createBreak();

            // Left Dropdown
            this.leftDropdown = this.createDropdown('leftDropdown');
            this.editorInfo.push(this.leftDropdown);

            // Right Dropdown
            this.rightDropdown = this.createDropdown('rightDropdown');
            this.editorInfo.push(this.rightDropdown);
            this.createBreak();

        // [ PREVIEW ]
            // Exit Button
            this.exitButton = this.createButton('exit', 'Exit');
            this.previewInfo.push(this.exitButton);

        // [ RENDER ]
            // Log Code
            this.logCode = document.createElement('code');
            this.logCode.id = 'log';
            this.renderInfo.push(this.logCode);
    }

    load(){ 
        this.editorInfo.forEach(element => {
            this.container.appendChild(element);
        });
        document.body.append(this.container);

        // @ts-ignore
        window.gameInstance.SendMessage('JS-Loader', 'SwitchStyle', this.styleId);
    }

    unload(){ 
        this.container.replaceChildren();
        this.container.remove();
    }

    changeLayout(type){
        this.container.replaceChildren();

        switch(type){
            case "editor":
                // @ts-ignore
                document.querySelector("#style").disabled = false;
                this.editorInfo.forEach(element => {
                    this.container.appendChild(element);
                });
                break;
            case "preview":
                // @ts-ignore
                document.querySelector("#style").disabled = true;
                this.previewInfo.forEach(element => {
                    this.container.appendChild(element);
                });
                break;
            case "render":
                // @ts-ignore
                document.querySelector("#style").disabled = true;
                this.renderInfo.forEach(element => {
                    this.container.appendChild(element);
                });
                break;
        }
    }

    //#region Element Creators
        createBreak(){
            this.editorInfo.push(document.createElement('br'));
        }

        createButton(id, text){
            var button = document.createElement('button');
            button.id = id;
            button.textContent = text;

            return button;
        }

        createDropdown(id){
            var dropdown = document.createElement('select');
            dropdown.id = id;
            dropdown.style.width = "250px";

            var options = [
                { value: '1', text: '1'},
                { value: '2', text: '2'},
                { value: '3', text: '3'}
            ]

            options.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.value;
                optionElement.text = option.text;
                
                dropdown.appendChild(optionElement);
            })

            return dropdown;
        }

        createToggle(id, text, checked){
            var label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = text;
            this.editorInfo.push(label);

            var toggle = document.createElement('input');
            toggle.type = 'checkbox';
            toggle.checked = checked;
            toggle.id = id;
            return toggle;
        }
    //#endregion

    //#region Element Updaters
        updateDropdown(id, options){
            var dropdown = document.querySelector(id);
            if (dropdown){
                dropdown.innerHTML = "";

                for (var i = 0; i < options.length; i++){
                    const optionElement = document.createElement('option');
                    optionElement.value = options[i];
                    optionElement.text = options[i];

                    dropdown.appendChild(optionElement);
                }
            }
            else{
                console.log("Dropdown with id " + id + " hasn't loaded yet.");
            }
        }

    //#endregion

    //#region Unity Event Creators
    
        //#region Button
    addUnityFunction(element, eventType, gameObject, method, extraFunction){
        const onEvent = () => {
            console.log(method + " called with element " + element.type 
                        + " with id " + element.id);

            // @ts-ignore
            window.gameInstance.SendMessage(gameObject, method);

            switch(extraFunction){
                // Preview Button
                case 1:
                    // @ts-ignore
                    this.changeLayout('preview');
                    break;

                // Render Button
                case 2:
                    // @ts-ignore
                    this.changeLayout('render');
                    break;
            }
        }

        element.addEventListener(eventType, onEvent);
    }

    addUnityFunctionWithParameter(element, eventType, gameObject, method, parameter, extraFunction){
        const onEvent = () => {
            console.log(method + " called with element " + element.type 
                        + " with id " + element.id);

            // @ts-ignore
            window.gameInstance.SendMessage(gameObject, method, parameter);

            switch(extraFunction){
                // Exit Button
                case 1:
                    // @ts-ignore
                    this.changeLayout('editor');
                    break;
            }
        }

        element.addEventListener(eventType, onEvent);
    }
    //#endregion

        //#region Toggle
    addUnityFunctionByCheckboxValue(element, eventType, gameObject, method){
        const onEvent = () => {
            var val = element.checked ? 1 : 0;

            console.log(method + " called with element " + element.type 
                        + " with id " + element.id + ". value: " + element.checked);

            // @ts-ignore
            window.gameInstance.SendMessage(gameObject, method, val);
        }

        element.addEventListener(eventType, onEvent);
    }

    addUnityFunctionByCheckboxCode(element, eventType, gameObject, method, eventIndex){
        const onEvent = () => {
            var val = element.checked ? 1 : 0;
            var code = eventIndex + ":" + val;

            console.log("event " + eventIndex + " called with element " + element.type 
                        + " with id " + element.id + ". value: " + element.checked);

            // @ts-ignore
            window.gameInstance.SendMessage(gameObject, method, code);
        }

        element.addEventListener(eventType, onEvent);
    }
    //#endregion
    
        //#region Dropdown
    addUnityFunctionByDropdownValue(element, eventType, gameObject, method){
        const onEvent = () => {
            var val = element.value;

            console.log(method + " called with element " + element.type 
                        + " with id " + element.id + ". value: " + val);

            // @ts-ignore
            window.gameInstance.SendMessage(gameObject, method, val);
        }

        element.addEventListener(eventType, onEvent);
    }
        //#endregion
    //#endregion
}