function Slider (obj, data) {this.init(obj, data);};

Slider.prototype = {
    init: function (obj, data) {
        this.create(obj, data);

        this.imgList = get("ul", obj)[0];
        this.sliderCtrl = get(".slider-ctrl", obj)[0];
        this.ctrlCons = get(".slider-ctrl-con", obj);
        this.imgWidth = parseInt(get("li", this.imgList)[0].offsetWidth, 10);           // 每个Li的宽度
        this.curIndex = 0;                                                              // 现在显示的图片的index
        this.maxIndex = get("li", this.imgList).length - 1;                             // Li的总个数                                
        this.timer = null;                                                              // 用于滚动的定时器

        this.handleImgList();
        this.handleSliderCtrl();

        for (var i = 0; i < this.ctrlCons.length; i++) {
            this.ctrlCons[i].index = i;
        }

        lhj.addClass(this.ctrlCons[0], "current");
        this.autoPlay();
    },

    create: function (obj, data) {
        var ul = document.createElement("ul"),
            sliderDis = document.createElement("div"),
            sliderCtrl = document.createElement("div"),
            length = data.length,
            i = 0;

        sliderDis.className = "slider-display";
        sliderDis.id = "slider-display";
        sliderCtrl.className = "slider-ctrl";
        ul.className = "slider-img-list";

        for (i = 0; i < length; i++) {
            ul.innerHTML += "<li><a href=\"#\">"+
                              "<img src=\""+ data[i]["imgsrc"] + "\">"+
                            "</a></li>";
        }
        sliderDis.appendChild(ul);

        sliderCtrl.innerHTML = "<a href=\"javascript:;\" class=\"prev\">prev</a>"
        for (i = 0; i < length; i++) {
            sliderCtrl.innerHTML += "<a href=\"javascript:;\" class=\"slider-ctrl-con\">"+(i+1)+"</a>"
        }
        sliderCtrl.innerHTML += "<a href=\"javascript:;\" class=\"next\">next</a>"


        obj.appendChild(sliderDis);
        obj.appendChild(sliderCtrl);
    },

    handleSliderCtrl: function () {
        var $this = this;

        this.sliderCtrl.onclick = function (event) {
            event = event || window.event;

            var target = event.target || event.srcElement,
                name = target.className;

            clearInterval($this.timer);
            if (name == "slider-ctrl-con") {
                $this.curIndex = target.index;
            } else if (name == "prev") {
                $this.curIndex = (!$this.curIndex) ? $this.maxIndex : $this.curIndex - 1;
            } else if (name == "next") {
                $this.curIndex = ($this.curIndex == $this.maxIndex) ? 0 : $this.curIndex + 1;
            }
            $this.scroll($this.curIndex);
            $this.autoPlay();
        }
    },

    handleImgList: function () {
        var $this = this,
            imgList = this.imgList;

        imgList.onmouseover = function () {
            clearInterval($this.timer);
        };

        imgList.onmouseout = function () {
            $this.autoPlay();    
        };
    },

    autoPlay: function () {
        var oThis = this;
        clearInterval(this.timer);
        this.timer = setInterval(function() {
            oThis.curIndex = (oThis.curIndex == oThis.maxIndex) ? 0 : oThis.curIndex+1;
            oThis.scroll(oThis.curIndex);
        }, 5000);
    },

    scroll: function (index) {
        var tarPos = -(this.imgWidth * index);;

        this.move(this.imgList, tarPos);
        for (var i = 0; i < this.ctrlCons.length; i++) {
            lhj.removeClass(this.ctrlCons[i], "current");
        }
        lhj.addClass(this.ctrlCons[index], "current");
    },

    move: function (obj, tarPos) {
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            var curPos = parseInt(lhj.getStyle(obj, "left"));
            var speed  = (tarPos - curPos) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);

            if (curPos !== tarPos) {
                obj.style.left = curPos + speed + "px";
            } else {
                clearInterval(obj.timer);
            }
        }, 30);
    }
};


