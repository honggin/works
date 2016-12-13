Function.prototype.bind = Function.prototype.bind || function (context) {
    var _self = this;

    return function () {
        _self.apply(context, arguments);
    };
}

var lhj = {
    getStyle: function (obj, attr) {
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, false)[attr];
        }
    },
    addClass: function (element, className) {
        var reg = new RegExp("\\b"+className+"\\b"),
            oldClass = element.className;

        if (!oldClass) {
            element.className = className;
            return ;
        } else if (!oldClass.match(reg)) {
            element.className = oldClass + " " + className;
        }
    },
    removeClass: function (element, className) {
        var reg = new RegExp("\\b ?"+className+"\\b"),
            oldClass = element.className;

        if (oldClass.match(reg)) {
            element.className = oldClass.replace(reg, "");
        }
    },
    // 跨浏览器事件处理函数
    EventUtil: {
        addHandler: function (element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on"+type, function () {
                    handler.apply(element, arguments);
                }); // 解决attachEvent的this问题
            } else {
                element["on"+type] = handler;
            }
        },
        removeHandler: function (element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on"+type, handler);
            } else {
                element["on"+type] = null;
            }
        }, 
        getEvent: function (event) {
            return event? event : window.event;
        },
        getTarget: function (event) {
            return event.target || event.srcElement;
        },
        preventDefault: function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
        },
        stopPropagation: function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            } else {
                event.cancelBubble = true;
            }
        }
    }
};
