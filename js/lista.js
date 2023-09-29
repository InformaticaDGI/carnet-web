Listar()




function Listar(id) {
  // body...

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var id = getParameterByName('dni2');
  
  fetch("listar.php", {
    method: "POST",
    body: id,
  })
    .then((response) => response.text())
    .then((response) => {
      resultado.innerHTML = response
    })
}

document.getElementById("retornar").addEventListener("click", function (e) {
     window.location.href = "index.html";
  })

document.getElementById("imprimir").addEventListener("click", function (e) {

     var pdf = new jsPDF('l', 'pt', 'letter');
              
                pdf.setFont("helvetica");
pdf.setFontType("bold");
pdf.setFontSize(9);
            source = $('#customers')[0];
            specialElementHandlers = {
  
                '#bypassme': function(element, renderer) {
                    
                    return true
                }
            };
            margins = {
                top: 80,
                bottom: 60,
                left: 60,
                width: 700,
                 autoSize:true,
                 
    printHeaders: true
            };

            pdf.fromHTML(
                    source, // HTML string or DOM elem ref.
                    margins.left, // x coord
                    margins.top, {// y coord
                        'width': margins.width, // max width of content on PDF
                        'elementHandlers': specialElementHandlers
                    },

                    
            function(dispose) {

                pdf.save('Test.pdf');
            }
            , margins);
        
        
  })

