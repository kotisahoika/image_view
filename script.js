let images = []
let current = 0
let spread = false

const left = document.getElementById("leftPage")
const right = document.getElementById("rightPage")
const info = document.getElementById("pageInfo")

function naturalSort(a,b){
return a.name.localeCompare(b.name,undefined,{numeric:true})
}

function show(){

if(images.length===0) return

if(spread){

left.src = images[current]

if(current+1 < images.length){
right.src = images[current+1]
}else{
right.src = ""
}

}else{

left.src = images[current]
right.src = ""

}

info.textContent = (current+1) + " / " + images.length

saveBookmark()

}

function next(){

current += spread ? 2 : 1

if(current >= images.length)
current = images.length-1

show()

}

function prev(){

current -= spread ? 2 : 1

if(current < 0)
current = 0

show()

}

function toggleSpread(){

spread = !spread

show()

}

function saveBookmark(){

localStorage.setItem("bookmark",current)

}

function loadBookmark(){

let b = localStorage.getItem("bookmark")

if(b){
current = parseInt(b)
}

}

document.getElementById("fileInput").addEventListener("change", e=>{

let files = Array.from(e.target.files)

files.sort(naturalSort)

images = files.map(f=>URL.createObjectURL(f))

loadBookmark()

show()

})

document.getElementById("zipInput").addEventListener("change", async e=>{

let zip = await JSZip.loadAsync(e.target.files[0])

let files = []

zip.forEach((path,file)=>{

if(path.match(/\.(jpg|jpeg|png|webp)$/i))
files.push(file)

})

files.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}))

images = []

for(let f of files){

let blob = await f.async("blob")

images.push(URL.createObjectURL(blob))

}

current = 0

show()

})

let startX=0

document.addEventListener("touchstart",e=>{

startX=e.touches[0].clientX

})

document.addEventListener("touchend",e=>{

let diff=e.changedTouches[0].clientX-startX

if(diff<-50) next()
if(diff>50) prev()

})

document.addEventListener("keydown",e=>{

if(e.key==="ArrowRight") next()
if(e.key==="ArrowLeft") prev()

})