var fullscreenImageWraper=document.getElementById("fullscreenImageWraper"),fullscreenImage=document.getElementById("fullscreenImage");function enlargeImage(e){document.body.style.overflow="hidden",fullscreenImage.src=e.src,fullscreenImageWraper.style.zIndex="1501",fullscreenImageWraper.style.opacity="0.9",fullscreenImageWraper.style.cursor="pointer",fullscreenImage.style.zIndex="1502",fullscreenImage.style.opacity="1",fullscreenImage.style.cursor="pointer",fullscreenImage.addEventListener("click",function(){document.body.style.overflow="",fullscreenImage.style.zIndex="0",fullscreenImage.style.opacity="0",fullscreenImage.style.cursor="auto",fullscreenImageWraper.style.zIndex="0",fullscreenImageWraper.style.opacity="0",fullscreenImageWraper.style.cursor="auto"}),fullscreenImageWraper.addEventListener("click",function(){document.body.style.overflow="",fullscreenImage.style.zIndex="0",fullscreenImage.style.opacity="0",fullscreenImage.style.cursor="auto",fullscreenImageWraper.style.zIndex="0",fullscreenImageWraper.style.opacity="0",fullscreenImageWraper.style.cursor="auto"})}for(var imageNodes=document.getElementsByTagName("img"),i=0;i<imageNodes.length;i++)"look"!=imageNodes[i].id&&imageNodes[i].addEventListener("click",function(){enlargeImage(this)});