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
})


function useSinginNeeded() {
  const { isAuth } = useAuth();
  if (!isAuth) {
    return window.location.href = 'https://signin.guarico.gob.ve?callback=https://carnet.guarico.gob.ve';
  }

  return
}
useSinginNeeded();