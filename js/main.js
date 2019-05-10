
let canvas, canvasData;
let ctx, tools = [], tx, ty, tw, th, pY, pX;
let isDown = false, selectedTool = -1;

window.onload = function() {
    canvas = document.getElementById('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    tools.push(document.getElementById('brushTool'));
    tools.push(document.getElementById('lineTool'));
    tools.push(document.getElementById('rectTool'));
    tools.push(document.getElementById('ovalTool'));
    tools.push(document.getElementById('eraserTool'));
    canvas.addEventListener('mousemove', () => {
        if (isDown) {
            switch (selectedTool) {
                case 0: drawFree();
                        break;
                case 1: drawLine();
                        break;
                case 2: drawRect();
                        break;
                case 3: drawOval();
                        break;
                case 4: erase();
                        break;
            }
        }
    });
    canvas.addEventListener('mousedown', event => {
        isDown = true;
        ctx.moveTo(event.offsetX, event.offsetY);
        ctx.beginPath();
        tx = event.offsetX;
        ty = event.offsetY;
        tw = 0;
        th = 0;
    });
    canvas.addEventListener('mouseup', () => {
        isDown = false;
        canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    });
}

function drawFree() {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

function switchTool() {
    if (selectedTool != -1) {
        tools[selectedTool].style.backgroundColor = 'dimgray';    
    }
    document.body.style.cursor = 'crosshair';
    switch(event.currentTarget.id) {
        case 'brushTool':   
            selectedTool = 0;
            break;
        case 'lineTool': 
            selectedTool = 1;
            break;
        case 'rectTool': 
            selectedTool = 2;
            break;
        case 'ovalTool': 
            selectedTool = 3;
            break;
        case 'eraserTool': 
            selectedTool = 4;
            document.body.style.cursor = "url('img/erasercursor.png'), auto";
            break;
    }
    tools[selectedTool].style.backgroundColor = 'lightblue';
}

function drawRect() {
    clearCanvas();
    if (canvasData) {
        ctx.putImageData(canvasData, 0, 0);
    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.rect(tx, ty, tw, th);
    ctx.stroke();
    if (event.pageY > pY) {
        if (event.pageX > pX) {
            tw += 5;
            th += 5;
        }
        else {
            tw -= 5;
            th += 5;
        }
    }
    else {
        if (event.pageX > pX) {
            tw += 5;
            th -= 5;
        }
        else {
            tw -= 5;
            th -= 5;
        }
    }
    pY = event.pageY;
    pX = event.pageX;
}

function drawOval() {
    clearCanvas();
    if (canvasData) {
        ctx.putImageData(canvasData, 0, 0);
    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.ellipse(tx, ty, th, tw, Math.PI / 2, 0, 2 * Math.PI);
    ctx.stroke();
    if (event.pageY > pY) {
        th += 3;
    }
    else {
        if (th - 3 > 0) {
            th -= 3;
        }
    }
    if (event.pageX > pX) {
        tw += 3;
    }
    else {
        if (tw - 3 > 0) {
            tw -= 3;
        }
    }
    pY = event.pageY;
    pX = event.pageX;
}

function erase() {
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

function drawLine() {
    clearCanvas();
    if (canvasData) {
        ctx.putImageData(canvasData, 0, 0);
    }
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    ctx.moveTo(tx, ty);
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
}

function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function save() {
    resetSelected();
    let url = canvas.toDataURL('image/png');
    let link = document.createElement('a');
    link.download = 'canvas.png';
    link.href = url;
    link.click();   
}

function resetSelected() {
    if (selectedTool != -1) { 
        tools[selectedTool].style.backgroundColor = 'dimgray';    
        selectedTool = -1;
        document.body.style.cursor = 'default';
    }
}

function clearCanvasData() {
    clearCanvas();
    canvasData = undefined;
    resetSelected();
}

function uploadFile() {
    resetSelected();
    let fileSelector = document.getElementById('fileselector');
    fileSelector.click();
}

function addImageToCavnas() {
    let file = event.srcElement.files[0];
    let fileReader = new FileReader();
    fileReader.onload = function() {
        createCanvasImageData(fileReader.result);
    }
    if (file) {
        fileReader.readAsDataURL(file);
    }
}

function createCanvasImageData(url) {   
    let image = new Image(canvas.width, canvas.height);
    image.src = url;    
    image.onload = function () {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);   
    }
}