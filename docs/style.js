export class Style {
    styleId = "";
    container = document.createElement('settings');
    editorInfo = [];
    previewInfo = [];
    renderInfo = [];

    // editor
    sizeRadio;
    fpsRadio;
    previewButton;
    renderButton;
    spoilerToggle;
    leftDropdown;
    rightDropdown;
    leftImageLoader;
    rightImageLoader;
    templateDownloadButton;

    // preview
    exitButton;

    // render
    logCode;

    constructor(id, sizes, fps){
        this.styleId = id;

        //#region [ EDITOR ]
            // Size Radio
            this.sizeRadio = this.createRadio('size', sizes);
            this.editorInfo.push(this.sizeRadio);

            // FPS Radio
            this.fpsRadio = this.createRadio('fps', fps);
            this.editorInfo.push(this.fpsRadio);

            // Preview Button
            this.previewButton = this.createButton('preview', 'Preview');
            this.editorInfo.push(this.previewButton);

            // Render Button
            this.renderButton = this.createButton('render', 'Render');
            this.editorInfo.push(this.renderButton);
            this.createBreak(); this.createBreak();

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

            // Left Image Loader
            this.leftImageLoader = this.createUpload('leftUpload', 'Upload Cut-In', ".png");
            this.editorInfo.push(this.leftImageLoader);

            // Right Image Loader
            this.rightImageLoader = this.createUpload('rightUpload', 'Upload Cut-In', ".png");
            this.editorInfo.push(this.rightImageLoader);
            this.createBreak();

            // Template Download Button
            this.templateDownloadButton = this.createButton('tempDL', 'Cut-In Template (.psd)');
            this.editorInfo.push(this.templateDownloadButton);
            this.createBreak();
        //#endregion

        //#region [ PREVIEW ]
            // Exit Button
            this.exitButton = this.createButton('exit', 'Exit');
            this.previewInfo.push(this.exitButton);
        //#endregion

        //#region [ RENDER ]
            // Log Code
            this.logCode = document.createElement('code');
            this.logCode.id = 'log';
            this.renderInfo.push(this.logCode);
        //#endregion
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

        createUpload(id, text, filetype){
            var uploader = document.createElement('input');
            uploader.id = id;
            uploader.type = 'file';
            uploader.textContent = text;
            uploader.accept = filetype;
            uploader.multiple = false;

            return uploader;
        }

        createRadio(id, options){
            const radioDiv = document.createElement('div');
            radioDiv.id = id;

            for (var i = 0; i < options.length; i++){
                console.log("options[" + i + "] = " + options[i]);
                var radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = id;
                radio.id = options[i];
                radio.value = options[i];
                if (i==0) radio.checked = true;
                radioDiv.appendChild(radio);

                var label = document.createElement('label');
                label.htmlFor = options[i];
                label.textContent = options[i];
                radioDiv.appendChild(label);
            }

            return radioDiv;
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

    //#region Event Creators
    
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

    addDownloadFunction(element, eventType, href, filename){
        const onEvent = () => {
            console.log(href + " downloaded with element " + element.type 
                        + " with id " + element.id);

            const link = document.createElement('a');
            link.href = href;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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

        //#region Radio
    addUnityFunctionByRadioValue(element, eventType, gameObject, method){
        const radios = [];
        for (var i = 0; i < element.childNodes.length; i++){
            if (element.childNodes[i].type == 'radio'){
                radios.push(element.childNodes[i]);
            }
        }

        const onEvent = (event) => {
            var checked = event.target.checked;

            if (checked){
                console.log(method + " called with element " + event.target.type 
                        + " with id " + event.target.id + ". checked: " + checked);

                // @ts-ignore
                window.gameInstance.SendMessage(gameObject, method, event.target.value);
            }
        }

        radios.forEach(radio => {
            radio.addEventListener(eventType, onEvent);
        })
    }
        //#endregion

        //#region Upload
    addUnityFunctionByFileInput(element, eventType, gameObject, method){
        const onEvent = (event) => {
            console.log(method + " called with element " + element.type 
                        + " with id " + element.id);

            var files = event.target.files;
            console.log("files retrieved");

            var img = files[0];
            console.log("img retrieved?");

            if (img){
                const reader = new FileReader();
                console.log("FileReader instantiated");

                reader.onload = function(e){
                    const base64String = (e.target.result).slice(22);
                    console.log(base64String.slice(0, 20) + "...");

                    // @ts-ignore
                    window.gameInstance.SendMessage(gameObject, method, base64String);    
                }

                reader.readAsDataURL(img);
            }
            else {
                console.log("no image");
            }
        }

        element.addEventListener(eventType, onEvent);
    }

    addUploadClearFunction(element, eventType){
        element.addEventListener(eventType, () => {
            element.value = ''; 
        });
    }
        //#endregion
    //#endregion
}