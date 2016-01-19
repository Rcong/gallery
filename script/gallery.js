//返回被选择的元素或元素集合
function g(selector){
	return document[selector.substr(0,1)==='.'?'getElementsByClassName':'getElementById'](selector.substr(1));
} 

function addPhotos(){
	var photoTpl = g('#photo-container').innerHTML,
		btnTpl = g('#nav').innerHTML,
		photos = [],
		navBtns = [];
	for (var i = 0; i < data.length; i++) {
		var photoHtml = photoTpl.replace(/{{index}}/,i)
						.replace(/{{img}}/,data[i].img)
						.replace(/{{caption}}/,data[i].caption)
						.replace(/{{desc}}/,data[i].desc);
		photos.push(photoHtml);

		var btnHtml = btnTpl.replace(/{{index}}/g,i);
		navBtns.push(btnHtml);			
	}
	g('#photo-container').innerHTML = photos.join('');
	g('#nav').innerHTML = navBtns.join('');
}

//排序海报,传入一个索引,获得对应的海报并设置海报居中。
//index:索引
function sortPhotos(index){
	var _photos = g('.photo'),
		photos = [],//_photos只是一个类数组,没有数组的一些方法,需要一个数组来转换.
		_navs = g('.i'),
		navs = [],
		centerPhoto,
		currentBtn;
	for (var i = 0,max = _photos.length; i < max; i++) {
		_photos[i].className = _photos[i].className.replace(/\sphoto-center/,'')
								.replace(/\sphoto-front/,'')
								.replace(/\sphoto-back/,'');

		//在这里需要清除所有photo之前的left、top和transform,否则centerPhoto不会居中且正面朝上。
		_photos[i].style['left']='';
		_photos[i].style['top']='';
		_photos[i].style['transform']='rotate(360deg) scale(1.3)';
		_photos[i].style['-webkit-transform']='rotate(360deg) scale(1.3)';


		photos.push(_photos[i]);
		_navs[i].className = _navs[i].className.replace(/\si-current/,'')
							.replace(/\si-back\s/,'');
		navs.push(_navs[i]);
	}
	centerPhoto = photos.splice(index,1)[0];
	centerPhoto.className += ' photo-center photo-front';
	currentBtn = navs.splice(index,1)[0];
	currentBtn.className += ' i-current'

	var leftPhotos = photos.splice(0,Math.round(photos.length/2)),
		rightPhotos = photos,
		range = calculateRange();
	for (var i = 0; i < leftPhotos.length; i++) {
		var leftPhoto = leftPhotos[i];
		leftPhoto.style.left = random(range.left.x[0],range.left.x[1])+'px';
		leftPhoto.style.top = random(range.left.y[0],range.left.y[1])+'px';
		leftPhoto.style['transform']='rotate('+random(-150,150)+'deg) scale(1)';
		leftPhoto.style['-webkit-transform'] = 'rotate('+random(-150,150)+'deg) scale(1)';
	}
	for (var i = 0; i < rightPhotos.length; i++) {
		var rightPhoto = rightPhotos[i];
		rightPhoto.style.left = random(range.right.x[0],range.right.x[1])+'px';
		rightPhoto.style.top = random(range.right.y[0],range.right.y[1])+'px';
		rightPhoto.style['transform'] = 'rotate('+random(-150,150)+'deg) scale(1)';
		rightPhoto.style['-webkit-transform'] = 'rotate('+random(-150,150)+'deg) scale(1)';
	}	
}

//生成指定范围之间的随机数
//min:最小数
//max:最大数
function random(min,max){
	var min = Math.min(min,max),
		max = Math.max(min,max);
	return Math.round(Math.random()*(max-min)+min);
}

//范围计算
function calculateRange(){
	var range = {left:{x:[],y:[]},right:{x:[],y:[]}},
		wrapHeight = g('#wrap').clientHeight,
		wrapWidth = g('#wrap').clientWidth,
		photoHeight = g('.photo')[0].clientHeight,
		photoWidth = g('.photo')[0].clientWidth;
	range.left.x = [0-photoWidth,wrapWidth/2-photoWidth/2];
	range.left.y = [0-photoHeight,wrapHeight];
	range.right.x = [wrapWidth/2+photoWidth/2,wrapWidth+photoWidth];
	range.right.y = range.left.y;
	return range;	
}

window.onload = function(){
	addPhotos();
	sortPhotos(random(0,data.length));
}

function turn(ele){
	var cls = ele.className,
		index = ele.id.split('-')[1];

	if (!/photo-center/.test(cls)) {
		return sortPhotos(index);
	}

	if (/photo-front/.test(cls)) {
		cls = cls.replace(/photo-front/,'photo-back');
		g('#nav-'+index).className += ' i-back';
	}else if(/photo-back/.test(cls)){
		cls = cls.replace(/photo-back/,'photo-front');
		g('#nav-'+index).className = g('#nav-'+index).className.replace(/\si-back/,'');
	}
	return ele.className = cls;
}