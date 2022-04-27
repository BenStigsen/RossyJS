class Rossy {
  constructor(w = window.innerWidth, h = window.innerHeight) {
    this.canvas = document.getElementById('canvas');
    this.ctx = canvas.getContext('2d');
    this.mouse = {}; // Stores the mouse event
    this.mousePrev = {}; // Previous mouse event (for click event)
    this.keyboard = {};
    this.keyboardPrev = {}; // Previous keyboard event (for click event)
    this.audio = {};
    this.image = {};
    
    this.start = (new Date()).getTime();
    this.previous = this.start;
  
    window.addEventListener('resize', this.resizeEvent, false);
    
    var mouseEvents = ['click', 'mouseup', 'mousedown', 'wheel', 'mousemove', 'mouseleave', 'mouseenter'];
    for (var i = 0; i < mouseEvents.length; i++) {
      window.addEventListener(mouseEvents[i], (event) => this.mouseEvent(event), false);
    }
    
    var keyboardEvents = ['keydown', 'keypress', 'keyup'];
    for (var i = 0; i < keyboardEvents.length; i++) {
      window.addEventListener(keyboardEvents[i], (event) => this.keyboardEvent(event), false);
    }
    
    this.resizeEvent(w, h);
  }
  
  reset() {
    this.mousePrev = this.mouse;
    this.mouse = { clientX: this.mouse.clientX, clientY: this.mouse.clientY }; // Always store the mouse position
    this.keyboardPrev = this.keyboard;
    this.keyboard = {};
  }
  
  resizeEvent(w = window.innerWidth, h = window.innerHeight) {
    this.canvas.width = w;
    this.canvas.style.width = w;
    this.canvas.height = h;
    this.canvas.style.height = h;
    this.ctx.save();
  }
  
  mouseEvent(event)    { this.mousePrev    = this.mouse;    this.mouse    = event; }
  keyboardEvent(event) { this.keyboardPrev = this.keyboard; this.keyboard = event; }
  
  clear() { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); }
  
  colorFill(c = "#000000")   { this.ctx.fillStyle   = c; }
  colorStroke(c = "#000000") { this.ctx.strokeStyle = c; }
  widthStroke(w = 2)         { this.ctx.lineWidth   = w; }

  width()  { return this.canvas.width;  }
  height() { return this.canvas.height; }

  clip(x = 0, y = 0, w = this.canvas.width, h = this.canvas.height) {
    if (x === 0 && y === 0 && w === this.canvas.width && h === this.canvas.height) {
      this.ctx.restore();
      this.ctx.save();
    } else {
      this.ctx.rect(x, y, w, h);
      this.ctx.clip();
    }
  }
  
  /// Drawing
  drawLine(x1, y1, x2, y2) { 
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1)
    this.ctx.lineTo(x2, y2)
    this.ctx.closePath();
    this.ctx.stroke(); 
  }
  
  drawTriangle(x1, y1, x2, y2, x3, y3)       { this.drawPoly([x1, y1, x2, y2, x3, y3]);       }
  drawTriangleFilled(x1, y1, x2, y2, x3, y3) { this.drawPoly([x1, y1, x2, y2, x3, y3], true); }
  
  drawRectangle(x, y, w, h)       { this.ctx.strokeRect(x, y, w, h); }
  drawRectangleFilled(x, y, w, h) { this.ctx.fillRect(x, y, w, h);   }

  drawPolygon()       { this.drawPoly(arguments); }
  drawPolygonFilled() { this.drawPoly(arguments, true); }
  drawPoly(points, filled = false) {
    if (points.length > 2 && points.length % 2 === 0) {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0], points[1]);
      for (var i = 2; i < points.length; i += 2) {
        this.ctx.lineTo(points[i], points[i+1]);
      }
      this.ctx.closePath();
      
      if (filled) { this.ctx.fill(); } else { this.ctx.stroke(); }
    }
  }
  
  drawImage(id, x = 0, y = 0, w = -1, h = -1) {
    var width = w === -1 ? this.image[id].width : w;
    var height = h === -1 ? this.image[id].height : h;
    this.ctx.drawImage(this.image[id], x = x, y = y, width = width, height = height);
  }
  
  /// Mouse
  getMousePosition()  { return { x: this.mouse.clientX, y: this.mouse.clientY }; }
  isMousePressed(id)  { return (this.mouse.type === "mousedown" && this.mouse.button === id); }
  isMouseReleased(id) { return (this.mouse.type === "mouseup"   && this.mouse.button === id); }
  isMouseClicked(id)  { return (this.mouse.type === "mousedown" && this.mousePrev.type !== "mousedown" && this.mouse.button === id); }
  
  /// Keyboard
  getKeyName()        { return (this.keyboard.key); }
  getKeyCode()        { return (this.keyboard.charCode); }
  isKeyPressed(name)  { return (this.keyboard.type === "keypress" && this.keyboard.key === name); }
  isKeyReleased(name) { return (this.keyboard.type === "keyup"    && this.keyboard.key === name); }
  isKeyClicked(name)  { return (this.keyboard.type === "keyup"    && this.keyboard.key === name); } 
  // Solution below apparently doesn't work?
  //isKeyClicked(name)  { return (this.keyboard.type === "keydown"  && this.keyboardPrev.type !== "keydown" && this.keyboard.key == name); }

  /// Audio
  audioPlay(id)           { this.audio[id].play(); }
  audioPause(id)          { this.audio[id].pause(); }
  audioStop(id)           { this.audio[id].pause(); this.audio[id].currentTime = 0; }
  audioVolume(id, volume) { this.audio[id].volume = volume; }
  audioLoad(path, id = null, volume = 1, looping = false) {
    if (id === null) { id = path; }
    var track = new Audio(path);
    track.volume = volume;
    track.looping = looping;
    track.load();
    this.audio[id] = track;
  }
  
  /// Image
  imageLoad(path, id = null, w, h) {
    if (id === null) { id = path; }
    var image = new Image(w, h);
    image.src = path;
    this.image[id] = image;
  }
  
  /// Time
  timeDelta() { 
    var now = (new Date()).getTime();
    var t = now - this.previous;
    this.previous = now;
    return t;
  }
  
  timeElapsed() {
    this.previous = (new Date()).getTime();
    return this.previous - this.start; 
  }
  
  fps() { return 1000 / this.timeDelta(); }
}

