function GoferOfTheDay(elementid) {
	
    var API_RESOURCE_URL = "https://gopherize.me/api/artwork/",
        API_SAVE_URL = "https://gopherize.me/save?images=",
        API_BUCKET_URL = "https://storage.googleapis.com/gopherizeme.appspot.com/",
        API_REGEX = /<img class='big-gopher' src='(.*)'>/g,
        SCALE = 0.5,
        SEP = "|",
        ready = false,
        imgurl = "",
        fullurl = API_SAVE_URL,
        // % chances of: bodyless, eyeless, shirtless, hairless, facial-hairless, glassless, hatless, extra-less
        emptyChance = [1, 1, 20, 50, 50, 50, 50, 90],
        imgnum = 0,
        imgloaded = 0,
        imgs = []

	// ensure that new has been used
	if (!(this instanceof GoferOfTheDay)) {
		return new GoferOfTheDay(initObj);
	}

    // Retrieve full resource list from api
    $.ajax({
        url:API_RESOURCE_URL,
        xhrFields: {
            withCredentials: false
        },
        crossDomain:true,
        success:function(data){
            // Generate API URL with randomness       
            for (var i in data.categories) {
                var cat = data.categories[i]
                var imgarray = cat.images
                var chance = emptyChance[i]
                if (!chance){
                    chance = 70
                }
                var skip = Math.ceil(Math.random() * 101) < chance
                if (!skip) {
                    var itemindex = Math.floor(Math.random() * imgarray.length)
                    fullurl = fullurl+SEP+imgarray[itemindex].id
                    var img = new Image();
                    img.src=imgarray[itemindex].href
                    imgnum++
                    img.onload = function(){imgloaded++}
                    imgs.push(img)
                } 
            }
            if(imgnum == 0) {
                alert("CONGRATS! YOU'VE GOT AN INVISIBLE GOFER!!!")
            }
            console.log(fullurl)
            var link=document.getElementById(elementid+"_url")
            if(link){
                link.href = fullurl
            }
            var level=document.getElementById(elementid+"_level")
            if(level){
                level.innerHTML = '"'+imgnum+'"'
            }
            setTimeout(WaitImageLoadAndDraw, 40);
        },
        error:function(err){
            console.warn(err)
        }
    })

    function WaitImageLoadAndDraw(){
        console.log("Waiting... images: %s, loaded: %s", imgnum, imgloaded)
        if(imgloaded == imgnum) {
            DrawImage()
        } else {
            setTimeout(WaitImageLoadAndDraw, 40);
        }
    }

    function DrawImage(){
        var maxwidth = 0
        var maxheight = 0
        var c=document.getElementById(elementid);
        var ctx=c.getContext("2d");
        for (var i in imgs){
            img = imgs[i]
            if (img.width > maxwidth) {maxwidth = img.width}
            if (img.height > maxheight) {maxheight = img.height}
        }
        ctx.canvas.width = maxwidth*SCALE
        ctx.canvas.height = maxheight*SCALE
        ctx.scale(SCALE,SCALE)
        for (var i in imgs){
            img = imgs[i]
            ctx.drawImage(img, 0, 0, img.width, img.height);
        }
        //add animation class to canvas
        c.classList.add("floatup")
        var levelline=document.getElementById(elementid+"_levelline");
        if(levelline){
            levelline.classList.add("floatup2")
        }
    }
	return this;	
}
