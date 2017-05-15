/**
 * Created by Administrator on 2017/5/14.
 */

function Capture(){
    this.settings={  container:null, upload:null , cancel:null  }
}
Capture.prototype.init=function(opt){
    var  This=this
    extend(this.settings,opt)
    if(this.settings.container===null    ||this.settings.upload===null){  console.error('初始化参数不能为空')  }
    this.show()
    this.settings.cancel.onclick=function(){  This.hide()  }
    this.readFile(this)
}
//读取文件信息
Capture.prototype.readFile=function (obj) {
    var file=this.settings.upload.files[0]
    if(window.FileReader){
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload=function (){
            obj.loadImage(this.result,obj)
        }
    }
}
//加载图片
Capture.prototype.loadImage=function (imgData,obj) {
    var isImg=document.getElementById('img')
    if(isImg){this.settings.container.removeChild(isImg)}
    var img=new Image()
    img.id='img'
    img.src=imgData
    img.onload=function () {
        obj.setImgSize(this,obj)
    }
}
//设置图片和容器
Capture.prototype.setImgSize=function(img,obj){
    var container=obj.settings.container,parent=container.parentNode,scale=1;
    if(img.naturalWidth>parent.offsetWidth && img.naturalHeight<img.naturalWidth) {
        scale= parent.offsetWidth/img.naturalWidth   //原始图宽度>box宽度 并且是横图
    }
    if(img.naturalHeight>parent.offsetHeight && img.naturalHeight>img.naturalWidth){
        scale= parent.offsetHeight/img.naturalHeight  //原始图高度>box高度 并且是竖图
    }
    if(img.naturalHeight>parent.offsetHeight && img.naturalWidth>parent.offsetWidth && img.naturalHeight===img.naturalWidth){
        scale=parent.offsetHeight/img.naturalHeight //原始图宽高都超并且是正方形
    }
    //设置图片长宽以及container的长宽
    container.style.width=img.style.width=   (img.naturalWidth*scale)+'px';
    container.style.height=img.style.height= (img.naturalHeight*scale)+'px';
    this.setZz(container);  //设置遮罩层
    this.createPicker(container,img);//设置截取图像元素
    container.appendChild(img)
}
//设置截取图像元素
Capture.prototype.createPicker=function(container,img){
    var isPicker=document.getElementById('picker'),moveX=0,moveY=0,This=this,argument
    if(isPicker){container.removeChild(isPicker)}
    var canvas=document.createElement('canvas'), picker=document.createElement('div'),pickerItem=[];
    for(var i=0;i<4;i++){  pickerItem[i]=document.createElement('div') }
    picker.id='picker';canvas.id='canvas';pickerItem[0].id='rightUp';pickerItem[1].id='rightDown';
    pickerItem[2].id='leftUp';pickerItem[3].id='leftDown';
    picker.style.cssText='position:absolute;top:20px;left:20px;width:100px;height:100px;z-index:2;border:1px solid white'
    pickerItem[0].style.cssText='position:absolute;width:20px;height:20px;top:-4px;right:-4px;border:4px solid white;border-left:none;border-bottom:none'
    pickerItem[1].style.cssText='position:absolute;width:20px;height:20px;bottom:-4px;right:-4px;border:4px solid white;border-left:none;border-top:none'
    pickerItem[2].style.cssText='position:absolute;width:20px;height:20px;top:-4px;left:-4px;border:4px solid white;border-right:none;border-bottom:none'
    pickerItem[3].style.cssText='position:absolute;width:20px;height:20px;bottom:-4px;left:-4px;border:4px solid white;border-right:none;border-top:none'
    canvas.width=100
    canvas.height=100
    container.appendChild(picker);
    picker.appendChild(canvas);
    for(var i=0;i<pickerItem.length;i++){  picker.appendChild(pickerItem[i]) }
    this.drawImage(picker,canvas,img);//画图
    picker.addEventListener('touchstart',function(e){
        isDown=true
        argument='picker'
        console.log(1)
        var touch=e.changedTouches[0]
        moveX=touch.clientX-picker.offsetLeft
        moveY=touch.clientY-picker.offsetTop
      })
    picker.addEventListener('touchmove',function(e){
        var touch=e.changedTouches[0]

        if(isDown===true && argument==='picker'){
            picker.style.left=touch.clientX-moveX+'px'
            picker.style.top=touch.clientY-moveY+'px'
            if(touch.clientX-moveX<0){ picker.style.left=0  }
            if(touch.clientX-moveX>container.offsetWidth-picker.offsetWidth){
                picker.style.left=container.offsetWidth-picker.offsetWidth+'px'
            }
            if(touch.clientY-moveY<0){  picker.style.top=0  }
            if(touch.clientY-moveY>container.offsetHeight-picker.offsetHeight){
                picker.style.top=container.offsetHeight-picker.offsetHeight+'px'
            }
            This.drawImage( picker,canvas,img )
        }
    })
    picker.addEventListener('touchend',function(e){ isDown=false })
    pickerItem[0].addEventListener('touchstart',function (e) {
        e.stopPropagation()
        isDown=true;argument='rightUp';
    })
    pickerItem[1].addEventListener('touchstart',function (e) {
        e.stopPropagation()
        isDown=true;argument='rightDown';
    })
    pickerItem[2].addEventListener('touchstart',function (e) {
        e.stopPropagation()
        isDown=true;argument='leftUp';
    })
    pickerItem[3].addEventListener('touchstart',function (e) {
        e.stopPropagation()
        isDown=true;argument='leftDown';
    })
    pickerItem[0].addEventListener('touchmove',function(e){
        console.log(getPosition(this))
        if(isDown && argument==='rightUp'){
            var touch=e.changedTouches[0]
            var addWidth=''
            var  pickerOldWidth=picker.offsetWidth-2
            addWidth=touch.clientX-getPosition(picker).left-pickerOldWidth
            console.log(addWidth)
            var newWidth=pickerOldWidth+addWidth
            var pscale=newWidth/pickerOldWidth
            picker.style.width=picker.style.height= (pickerOldWidth*pscale)+'px';
            picker.style.top=picker.offsetTop-addWidth+'px'
            canvas.width=picker.offsetWidth-2
            canvas.height=picker.offsetHeight-2
            This.drawImage( picker,canvas,img )

        }
    })
    pickerItem[1].addEventListener('touchmove',function(e){
        console.log(getPosition(this))
        if(isDown && argument==='rightDown'){
            var touch=e.changedTouches[0]
            var addWidth=''
            var  pickerOldWidth=picker.offsetWidth-2
            addWidth=touch.clientX-getPosition(picker).left-pickerOldWidth
            var newWidth=pickerOldWidth+addWidth
            var pscale=newWidth/pickerOldWidth
            picker.style.width=picker.style.height= (pickerOldWidth*pscale)+'px';
            canvas.width=picker.offsetWidth-2
            canvas.height=picker.offsetHeight-2
            This.drawImage( picker,canvas,img )
        }
    })
    pickerItem[2].addEventListener('touchmove',function(e){
        console.log(getPosition(this))
        if(isDown && argument==='leftUp'){
            var touch=e.changedTouches[0]
            var x=touch.clientX
            var mainX=getPosition(picker).left
            var addWidth=mainX-x
            var widthBefore=picker.offsetWidth-2
            picker.style.width=picker.style.height=widthBefore+addWidth+'px'
            picker.style.left=picker.offsetLeft-addWidth+'px'
            picker.style.top=picker.offsetTop-addWidth+'px'
            canvas.width=picker.offsetWidth-2
            canvas.height=picker.offsetHeight-2
            This.drawImage( picker,canvas,img )
        }
    })
    pickerItem[3].addEventListener('touchmove',function(e){
        console.log(getPosition(this))
        if(isDown && argument==='leftDown'){
            var touch=e.changedTouches[0]
            var x=touch.clientX
            var mainX=getPosition(picker).left
            var addWidth=mainX-x
            var widthBefore=picker.offsetWidth-2
            var newWidth=widthBefore+addWidth
            var nscale=newWidth/widthBefore
            picker.style.width=picker.style.height= (widthBefore*nscale)+'px';
            picker.style.left=picker.offsetLeft-addWidth+'px'

            canvas.width=picker.offsetWidth-2
            canvas.height=picker.offsetHeight-2
            This.drawImage( picker,canvas,img )
        }
    })
};
Capture.prototype.save=function () {
    var canvas=document.getElementById('canvas')
    var context=canvas.getContext('2d')
    return canvas.toDataURL()
}
//canvas画图
Capture.prototype.drawImage=function (picker,canvas,img) {
    var scale =img.naturalWidth/parseInt(img.style.width);
    var scaleX=picker.offsetWidth/parseInt(img.style.width);
    var scaleY=picker.offsetHeight/parseInt(img.style.height);
    var context=canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
    context.drawImage(img,picker.offsetLeft*scale,picker.offsetTop*scale,img.naturalWidth*scaleX,img.naturalHeight*scaleY,0,0,canvas.width,canvas.height)
}
//设置遮罩层
Capture.prototype.setZz=function (container) {
        var zzz=document.getElementById('zz')
        if(zzz){ container.removeChild(zzz)  }
        var zz=document.createElement('div')
        zz.id='zz'
        zz.style.cssText='position:absolute;top:0;left:0;background:rgba(0,0,0,0.5);width:'+container.style.width+';height:'+container.style.height+' '
        container.appendChild(zz)
    }
//显示图片截取单元
Capture.prototype.show=function(){
    this.settings.container.parentNode.parentNode.style.display='block'
}
//隐藏图片截取单元
Capture.prototype.hide=function(){
    this.settings.container.parentNode.parentNode.style.display='none'

}
function extend(obj1,obj2){
    for(var attr in obj2){
        obj1[attr]=obj2[attr]
    }
}
function getPosition(node){
    var left=node.offsetLeft;
    var top=node.offsetTop
    var parent=node.offsetParent;
    while(parent !==null){
        left+=parent.offsetLeft
        top+=parent.offsetTop
        parent=parent.offsetParent
    }
    return {left:left,top:top}
}