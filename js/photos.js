var fullscreenImageWraper = document.getElementById("fullscreenImageWraper")
var fullscreenImage = document.getElementById("fullscreenImage")

function enlargeImage(imgElement){
    // imgElement.classList.toggle("large");
    document.body.style.overflow = "hidden";
    fullscreenImage.src = imgElement.src;

    fullscreenImageWraper.style.zIndex = "1501";
    fullscreenImageWraper.style.opacity = "0.9";
    fullscreenImageWraper.style.cursor = "pointer"

    fullscreenImage.style.zIndex = "1502";
    fullscreenImage.style.opacity = "1";
    fullscreenImage.style.cursor = "pointer"

    fullscreenImage.addEventListener("click", function() {
        document.body.style.overflow = "";

        fullscreenImage.style.zIndex = "0";
        fullscreenImage.style.opacity = "0";
        fullscreenImage.style.cursor = "auto"

        fullscreenImageWraper.style.zIndex = "0";
        fullscreenImageWraper.style.opacity = "0";
        fullscreenImageWraper.style.cursor = "auto"
    })

    fullscreenImageWraper.addEventListener("click", function() {
        document.body.style.overflow = "";

        fullscreenImage.style.zIndex = "0";
        fullscreenImage.style.opacity = "0";
        fullscreenImage.style.cursor = "auto"

        fullscreenImageWraper.style.zIndex = "0";
        fullscreenImageWraper.style.opacity = "0";
        fullscreenImageWraper.style.cursor = "auto"
    })
}

var imageNodes = document.getElementsByTagName('img');
for (var i=0; i<imageNodes.length; i++)
{
    imageNodes[i].addEventListener('click', function() {
        enlargeImage(this);
    });
}