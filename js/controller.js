const HOST = "https://api-carnet.guarico.gob.ve/"

window.onload = () => {
  loadBackImage()
  var width = 652
  var height = 1004

  var stage = new Konva.Stage({
    container: "k-container",
    width: width,
    height: height,
  })

  var imgLayer = new Konva.Layer({
    id: "main-layer",
  })

  var imageObj = new Image()

  imageObj.onload = function () {
    var img = new Konva.Image({
      x: 0,
      y: 0,
      image: imageObj,
      width: 652,
      height: 1004,
      id: "bg",
    })

    imgLayer.add(img)
    stage.add(imgLayer)
  }

  imageObj.src = "./img/bg2.png"

  var layer = new Konva.Layer({ id: "main-layer" })

  var textDni = newText({
    id: "dni",
    ypos: 800,
    xpos: 200,
    layer: layer,
    size: 25,
    color: "white",
  })
  var textName = newText({
    id: "name",
    ypos: 750,
    xpos: 200,
    layer: layer,
    size: 25,
    color: "white",
    align: 'left'
  })
  var textCharge = newText({
    id: "charge",
    ypos: 850,
    xpos: 200,
    layer: layer,
    size: 25,
    color: "white"
  })
  var textDependence = newText({
    id: "dependence",
    ypos: 900,
    xpos: 200,
    layer: layer,
    size: 25,
    color: "white"
  })

  /**
   * MOUSE OVER TEXT EVENTS
   *  */

  textName.txt.on("mouseover", function (e) {
    textName.transform.show()
    textDni.transform.hide()
    textCharge.transform.hide()
    textDependence.transform.hide()
    layer.draw()
  })
  textDni.txt.on("mouseover", function (e) {
    textDni.transform.show()
    textName.transform.hide()
    textCharge.transform.hide()
    textDependence.transform.hide()
    layer.draw()
  })
  textCharge.txt.on("mouseover", function (e) {
    textCharge.transform.show()
    textName.transform.hide()
    textDni.transform.hide()
    textDependence.transform.hide()
    layer.draw()
  })
  textDependence.txt.on("mouseover", function (e) {
    textDependence.transform.show()
    textName.transform.hide()
    textDni.transform.hide()
    textCharge.transform.hide()
    layer.draw()
  })

  stage.add(layer)

  document.getElementById("getData").addEventListener("click", function (e) {
    var result = loadData()
    dni2.value=document.getElementById("dni").value;
    result
      .then((res) => res.json())
      .then((res) => setText(res, stage, layer))
      .catch((error) => setText(null, stage, layer))
  })

  stage.on("click", function (e) {
    stage.get("#tr-name").hide()
    stage.get("#tr-dni").hide()
    stage.get("#tr-charge").hide()
    stage.get("#tr-dependence").hide()
    stage.get("#tr-photo").hide()
    stage.get("#photo-layer").moveToBottom()
    stage.get("#photo").opacity(1)
    stage.get("#photo-layer").draw()
    layer.draw()
  })

  document.getElementById("name").addEventListener("change", function (e) {
    stage.get("#name").text(this.value)
    stage.get("#tr-name").forceUpdate()
    layer.moveToTop()
    layer.draw()
  })

  document
    .getElementById("dependence")
    .addEventListener("change", function (e) {
      stage.get("#dependence").text(this.value)
      stage.get("#tr-dependence").forceUpdate()
      layer.moveToTop()
      layer.draw()
    })

  document.getElementById("dni").addEventListener("change", function (e) {
    stage.get("#dni").text(`C.I: ${this.value}`)
    stage.get("#tr-dni").forceUpdate()
    layer.moveToTop()
    layer.draw()
    setQrCode(this.value)
  })

  document.getElementById("charge").addEventListener("change", function (e) {
    stage.get("#charge").text(this.value)
    stage.get("#tr-charge").forceUpdate()
    layer.moveToTop()
    layer.draw()
  })

  document.getElementById("download").addEventListener("click", function (e) {
     stage.get("#tr-name").hide()
          stage.get("#tr-dependence").hide()
          stage.get("#tr-charge").hide()
          stage.get("#tr-dni").hide()
          stage.get("#tr-photo").hide()
          layer.draw()
          var dataURLF = stage.getStage().toDataURL()
          var dataURLB = document.getElementById("back").toDataURL("image/png")
          var name = document.querySelector("#dni").value
          generatePDF(dataURLF, dataURLB, name)

    fetch("registrar.php", {
      method: "POST",
      body: new FormData(frm),
    }).then((response) => response.text())
    .then((response) => {
      console.log(response);
    })
  })

  document.addEventListener("keydown", function (e) {
    if (e.which == 76 && e.ctrlKey) {
      e.preventDefault()
      if (stage.get("#photo-layer").getZIndex()[0].index < 1) {
        stage.get("#photo-layer").moveToTop()
        stage.get("#photo").opacity(0.5)
      } else {
        stage.get("#photo-layer").moveToBottom()
        stage.get("#photo").opacity(1)
      }
      stage.get("#tr-photo").show()
      stage.get("#photo-layer").draw()
      layer.draw()
    }

    if (e.which == 68 && e.ctrlKey) {
      e.preventDefault()
      downloadURI(
        stage.getStage().toDataURL(),
        "c-" + document.querySelector("#dni").value + ".png"
      )
    }
  })

  document.getElementById("img-to-top").addEventListener("click", function (e) {
    stage.get("#photo-layer").moveToTop()
    stage.get("#tr-photo").show()
    stage.get("#photo").opacity(0.5)
    stage.get("#photo-layer").draw()
    layer.draw()
  })

  document.getElementById("camera-capture").addEventListener("click", function (e) {
    captureFromCamera()
  })
}

function newText(
  params = {
    id,
    ypos,
    xpos: 300,
    layer,
    text: "",
    size: 35,
    color: "black",
    align: 'center'
  }
) {
  var text = new Konva.Text({
    x: params.xpos,
    y: params.ypos,
    text: params.text,
    fontSize: params.size,
    fontFamily: "Montserrat",
    fill: params.color,
    align: params.align,
    draggable: true,
    id: params.id,
  })

  var tr = new Konva.Transformer({
    visible: false,
    rotateEnabled: false,
    padding: 5,
    id: "tr-" + params.id,
  })

  tr.attachTo(text)
  params.layer.add(text)
  params.layer.add(tr)
  return { txt: text, transform: tr }
}

function setText(response, stage, layer) {
  //response.deno_cod_secretaria

  var dir = document.getElementById("isSecre").checked
    ? response.deno_cod_secretaria
    : response.deno_cod_direccion
  var cargo = response.demonimacion_puesto
  if (response.hasOwnProperty("cedula_identidad")) {
    document.querySelector("#dni").value = response.cedula_identidad
    document.querySelector("#charge").value = cargo
    document.querySelector("#name").value = response.nombre
    document.querySelector("#dependence").value = dir
  }
  setPhoto(
    response.hasOwnProperty("cedula_identidad")
      ? response.cedula_identidad
      : document.querySelector("#dni").value,
    stage
  )

  stage.get("#name").text(response.nombre)
  stage.get("#tr-name").forceUpdate()
  layer.moveToTop()
  layer.draw()
  stage
    .get("#dependence")
    .text(
      document.getElementById("isSecre").checked
        ? response.deno_cod_secretaria
        : response.deno_cod_direccion
    )
  stage.get("#tr-dependence").forceUpdate()
  layer.moveToTop()
  layer.draw()
  stage.get("#dni").text(`C.I: ${response.cedula_identidad}`)
  stage.get("#tr-dni").forceUpdate()
  layer.moveToTop()
  layer.draw()
  stage.get("#charge").text(response.demonimacion_puesto)
  stage.get("#tr-charge").forceUpdate()
  layer.moveToTop()
  layer.draw()
}

function setPhoto(image, stage) {
  if (stage.get("#photo-layer").length > 0) {
    stage.get("#photo-layer").destroy()
  }

  var layer = new Konva.Layer({
    id: "photo-layer",
  })
  var imageObj = new Image()

  imageObj.onload = function () {
    var photo = new Konva.Image({
      id: "photo",
      x: 170,
      y: 360,
      image: imageObj,
      width: 300,
      height: 380,
      draggable: true,
      opacity: 0.5,
    })

    var tr = new Konva.Transformer({
      visible: true,
      rotateEnabled: true,
      padding: 5,
      id: "tr-photo",
    })

    tr.attachTo(photo)
    layer.add(photo)
    layer.add(tr)
    stage.add(layer)
  }

  fetch(`${HOST}photo/${image}`, {
    headers: {
      "Response-Type": "arraybuffer",
    },
  })
    .then((res) => res.arrayBuffer())
    .then((res) => {
      const _blob = new Blob([res], { type: "image/jpg" })
      imageObj.src = URL.createObjectURL(_blob)
    })

  //imageObj.crossOrigin = 'anonymous';
}

function loadData() {
  var dni = document.querySelector("#dni").value
  return fetch(`${HOST}client/${dni}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

function downloadURI(uri, name) {
  var link = document.createElement("a")
  link.download = name
  link.href = uri
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  delete link
}

function setQrCode(dni) {
  var qrdiv = document.getElementById("qrcode")
  var qr64 = new Image()

  var qrcode = new QRCode(qrdiv, {
    width: 168,
    height: 168,
    correctLevel: QRCode.CorrectLevel.L,
  })

  qrcode.makeCode(`https://qr.guarico.gob.ve/${dni}`)

  setTimeout(function () {
    qr64.src = qrdiv.lastElementChild.src
  }, 10)

  var canvas = document.getElementById("back")
  ctx = canvas.getContext("2d")

  qr64.onload = function (e) {
    ctx.drawImage(qr64, 88, 174)
  }
}

function loadBackImage() {
  var canvas = document.getElementById("back"),
    ctx = canvas.getContext("2d")
  canvas.width = 638
  canvas.height = 1004

  background = new Image()
  var loadImage = window.location.search.replace("?key=", "")
  background.src = `./img/${loadImage.length > 0 ? loadImage : "bg3"}.png`

  background.onload = function () {
    ctx.drawImage(background, 0, 0)
  }
}

function generatePDF(front, back, name = "nocedula") {
  var doc = new jsPDF("p", "mm", [85.6, 54])

  doc.addImage(front, "PNG", 0, 0, 54, 85.6)
  doc.addPage()
  doc.addImage(back, "PNG", 0, 0, 54, 85.6)
  doc.save(`${name}.pdf`)
}


function useAuth() {
  
  let token = localStorage.getItem("token");

  if (!token) {
    token = new URLSearchParams(window.location.search).get("token") || ''

    if (token) {
      localStorage.setItem("token", token)
      window.location.href = '/';
    }
  }

  //delete 

  const logout = async () => {

    localStorage.removeItem("token")
    window.location.reload();
  }

  return {
    token,
    isAuth: !!token,
    logout
  }

}

document.getElementById("logout").addEventListener("click", function (e){
  const {logout} = useAuth();
  logout();
});


function useSinginNeeded() {
  const { isAuth } = useAuth();
  if (!isAuth) {
    return window.location.href = 'https://signin.guarico.gob.ve?callback=https://carnet.guarico.gob.ve';
  }

  return
}

/**
 * Camera capture function
 * Opens device camera in inline preview box
 */
function captureFromCamera() {
  const cameraContainer = document.getElementById('camera-container');
  const cameraPreview = document.getElementById('camera-preview');
  const captureBtn = document.getElementById('capture-photo');
  const stopBtn = document.getElementById('stop-camera');
  
  // Show camera container
  cameraContainer.style.display = 'block';
  
  // Request camera access
  navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user' // Front camera
    } 
  })
  .then(stream => {
    cameraPreview.srcObject = stream;
    cameraPreview.play();
    
    // Apply horizontal flip to camera preview to avoid mirror effect
    cameraPreview.style.transform = 'scaleX(-1)';
    
    // Capture photo function
    const capturePhoto = () => {
      console.log('Starting photo capture...');
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const bgColorSelect = document.getElementById('bg-color');
      const selectedBgColor = bgColorSelect ? bgColorSelect.value : 'transparent';
      
      console.log('Selected background color:', selectedBgColor);
      
      // Set canvas dimensions to match video
      canvas.width = cameraPreview.videoWidth;
      canvas.height = cameraPreview.videoHeight;
      
      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      
      // Draw video frame to canvas first (flip back to normal orientation)
      context.save();
      context.scale(-1, 1);
      context.drawImage(cameraPreview, -canvas.width, 0, canvas.width, canvas.height);
      context.restore();
      
      // If background color is selected, apply background replacement
      if (selectedBgColor !== 'transparent') {
        console.log('Applying background replacement...');
        applyBackgroundReplacement(canvas, context, selectedBgColor);
      }
      
      // Convert canvas to blob
      canvas.toBlob(blob => {
        console.log('Canvas converted to blob, size:', blob.size);
        
        // Create object URL from blob
        const imageUrl = URL.createObjectURL(blob);
        
        // Load the captured image into the photo system
        loadCapturedImage(imageUrl);
        
        // Stop camera and hide container
        stopCamera();
      }, 'image/jpeg', 0.8);
    };
    
    // Stop camera function
    const stopCamera = () => {
      // Stop camera stream
      stream.getTracks().forEach(track => track.stop());
      
      // Hide camera container
      cameraContainer.style.display = 'none';
      
      // Clear video source
      cameraPreview.srcObject = null;
    };
    
    // Event listeners
    captureBtn.onclick = capturePhoto;
    stopBtn.onclick = stopCamera;
    
    // Also allow capturing with Enter key when camera is active
    const handleKeyPress = (e) => {
      if (cameraContainer.style.display === 'block') {
        if (e.key === 'Enter') {
          capturePhoto();
        } else if (e.key === 'Escape') {
          stopCamera();
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    
    // Store cleanup function for later use
    window.cameraCleanup = () => {
      document.removeEventListener('keydown', handleKeyPress);
      stopCamera();
    };
  })
  .catch(error => {
    console.error('Error accessing camera:', error);
    alert('No se pudo acceder a la cámara. Por favor, asegúrate de que tienes permisos de cámara habilitados.');
    
    // Hide camera container on error
    cameraContainer.style.display = 'none';
  });
}

/**
 * Apply background replacement to captured image
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {CanvasRenderingContext2D} context - Canvas context
 * @param {string} bgColor - Background color to apply
 */
function applyBackgroundReplacement(canvas, context, bgColor) {
  try {
    // Get image data
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Convert background color to RGB
    const bgRgb = hexToRgb(bgColor);
    
    // Simple background replacement algorithm
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      
      // Skip transparent pixels
      if (a === 0) continue;
      
      // Simple background detection
      const isBackground = isLikelyBackground(r, g, b);
      
      if (isBackground) {
        data[i] = bgRgb.r;     // Red
        data[i + 1] = bgRgb.g; // Green
        data[i + 2] = bgRgb.b; // Blue
        // Keep original alpha
      }
    }
    
    // Put modified image data back
    context.putImageData(imageData, 0, 0);
  } catch (error) {
    console.error('Error applying background replacement:', error);
    // If background replacement fails, just continue with original image
  }
}

/**
 * Convert hex color to RGB
 * @param {string} hex - Hex color string
 * @returns {Object} RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 255, g: 255, b: 255 };
}

/**
 * Simple background detection algorithm
 * @param {number} r - Red value
 * @param {number} g - Green value
 * @param {number} b - Blue value
 * @returns {boolean} True if likely background
 */
function isLikelyBackground(r, g, b) {
  // This is a simple heuristic - adjust thresholds as needed
  // Look for light colors that are typical of backgrounds
  
  // Check for very light colors (close to white)
  if (r > 220 && g > 220 && b > 220) return true;
  
  // Check for neutral grays
  const avg = (r + g + b) / 3;
  const maxDiff = Math.max(Math.abs(r - avg), Math.abs(g - avg), Math.abs(b - avg));
  if (avg > 200 && maxDiff < 40) return true;
  
  // Check for light blue/green tints (common in webcam backgrounds)
  if (r < 160 && g > 200 && b > 200) return true;
  
  // Check for light yellow/beige tones
  if (r > 200 && g > 200 && b < 180) return true;
  
  return false;
}

/**
 * Load captured image into the photo system
 * @param {string} imageUrl - URL of the captured image
 */
function loadCapturedImage(imageUrl) {
  console.log('Loading captured image:', imageUrl);
  
  // Get the current stage
  const stage = Konva.stages[0]; // Assuming there's only one stage
  
  if (!stage) {
    console.error('No stage found');
    return;
  }
  
  console.log('Stage found, proceeding with image load...');
  
  // Remove existing photo layer if it exists
  if (stage.get("#photo-layer").length > 0) {
    stage.get("#photo-layer").destroy();
  }
  
  // Create new photo layer
  const layer = new Konva.Layer({
    id: "photo-layer",
  });
  
  const imageObj = new Image();
  
  imageObj.onload = function () {
    const photo = new Konva.Image({
      id: "photo",
      x: 170,
      y: 360,
      image: imageObj,
      width: 300,
      height: 380,
      draggable: true,
      opacity: 0.5,
    });
    
    const tr = new Konva.Transformer({
      visible: true,
      rotateEnabled: true,
      padding: 5,
      id: "tr-photo",
    });
    
    tr.attachTo(photo);
    layer.add(photo);
    layer.add(tr);
    stage.add(layer);
    
    // Move photo layer to top and show transformer
    stage.get("#photo-layer").moveToTop();
    stage.get("#tr-photo").show();
    stage.get("#photo").opacity(0.5);
    stage.get("#photo-layer").draw();
    stage.get("#main-layer").draw();
  };
  
  imageObj.src = imageUrl;
}

// useSinginNeeded();