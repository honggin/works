// 版本2：解耦
// 将数据操作与页面渲染进行分离

function addEvent (element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler);
    } else if (element.attachEvent) {
        element.attachEvent('on'+type, handler);
    } else {
        element['on'+type] = handler;
    }
}

function $ (id) {
    return typeof id == 'string' && document.getElementById(id);
}

var queue = {
    _arr: [],

    _paintContainer: null,

    _track: [],

    qpush: function (num) {
        this._arr.push(num);
        this.paint();
    },
    qpop: function () {
        this._arr.pop();
        this.paint();
    },
    qshift: function () {
        this._arr.shift();
        this.paint();
    },
    qunshift: function (num) {
        this._arr.unshift(num);
        this.paint();
    },
    qdel: function (index) {
        this._arr.splice(index, 1);
        this.paint();
    },
    random: function () {
        var len = 60;
        this._arr = [];

        for (var i = 0; i < len; i++) {
            this._arr.push(parseInt(Math.random()*190 + 10));
        }
        this.paint();
    },
    visualBubble: function () {
        var i = 0, j = 0;
        var running = false;
        var $this = this;

        var len = $this._arr.length;

        if (len == 0) return ;

        var list = this._paintContainer.querySelectorAll('.item');

        var timer = setInterval(function () {
            if (i == len) {
                list[list.length - 1].style.backgroundColor = 'red';
                clearInterval(timer);
            } else {
                bubbleStep();
            }
        }, 10);
        function bubbleStep() {
            for (var item = 0; item < len; item++) {
                list[item].style.backgroundColor = 'red';
            }
            list[i].style.backgroundColor = 'blue';
            list[j].style.backgroundColor = 'green';
            if ($this._arr[j] < $this._arr[i]) {
                var temp = $this._arr[j];
                $this._arr[j] = $this._arr[i];
                $this._arr[i] = temp;
                list[i].style.backgroundColor = 'green';
                list[j].style.backgroundColor = 'blue';
                list[i].style.height = $this._arr[i] + 'px';
                list[j].style.height = $this._arr[j] + 'px';
            }

            j++;
            if (j >= len) {
                i++;
                j = i;
            }
        }
    },
    qsort: function () {
        var arr = this._arr;
        var sortStack = [];

        sortStack.push(0);                  // 左边界
        sortStack.push(arr.length - 1);     // 右边界

        while (sortStack.length != 0) {
            var right = sortStack.pop();
            var left = sortStack.pop();
            var tl = left;
            var tr = right;

            if (left >= right) continue;
            this._track.push({
                'l': left,
                'r': right,
                'tl': tl,
                'tr': tr,
                'lh': arr[left],
                'rh': arr[right]
            });
            var key = arr[left];

            while(left < right) {
                for ( ;left < right; right--) {
                    if (arr[right] >= key) {
                        swap(arr, left++, right);
                        this._track.push({
                            'l': left,
                            'r': right,
                            'tl': tl,
                            'tr': tr,
                            'lh': arr[left],
                            'rh': arr[right]
                        });
                        break;
                    }
                    this._track.push({
                        'l': left,
                        'r': right,
                        'tl': tl,
                        'tr': tr,
                        'lh': arr[left],
                        'rh': arr[right]
                    });
                }
                for( ;left < right; left++) {
                    if (arr[left] <= key) {
                        swap(arr, left, right--);
                        this._track.push({
                            'l': left,
                            'r': right,
                            'tl': tl,
                            'tr': tr,
                            'lh': arr[left],
                            'rh': arr[right]
                        });
                        break; 
                    }
                    this._track.push({
                        'l': left,
                        'r': right,
                        'tl': tl,
                        'tr': tr,
                        'lh': arr[left],
                        'rh': arr[right]
                    }); 
                } 
            }
            var pivot = left;

            sortStack.push(tl);
            sortStack.push(pivot - 1);
            sortStack.push(pivot + 1);
            sortStack.push(tr);
        }
        function swap(arr, i, j) {
            var temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
        }
    },
    paint: function () {
        var len = this._arr.length;
        this._paintContainer.innerHTML = '';
        for (var i = 0; i < len; i++) {
            this._paintContainer.innerHTML += '<li class="item" style="height:'+this._arr[i]+'px;"></li>' 
        }
    },
    visualSort: function () {
        this._list = this._paintContainer.querySelectorAll('.item');
        if (this._list == null) return ;
        var $this = this;
        var timer = setInterval(function () {
            if ($this._track.length == 0) {
                clearInterval(timer);
                for (var i = 0; i < $this._list.length; i++) {
                    $this._list[i].style.backgroundColor = 'red';
                }
                return ;
            }
            var track = $this._track.shift();
            var left = track.l;
            var right = track.r;
            var tl = track.tl;
            var tr = track.tr;
            var lh = track.lh;
            var rh = track.rh;

            for (var i = 0; i < $this._list.length; i++) {
                $this._list[i].style.backgroundColor = 'red';
            }
            for (var i = tl; i <= tr; i++) {
                $this._list[i].style.backgroundColor = 'green';
            }
            $this._list[left].style.backgroundColor = 'blue';
            $this._list[left].style.height = lh + 'px';
            $this._list[right].style.backgroundColor = 'yellow';
            $this._list[right].style.height = rh + 'px';
        }, 10);
    }
}

function initControlBar () {
    var controlBar = $('control');

    controlBar.onclick = function (event) {
        var event = event || window.event;
        var target = event.target || event.srcElement;

        if (target.nodeName.toLowerCase() == 'button') {
            var num = $('num');
            var value = num.value.trim();
            var items = document.querySelectorAll('#show-item .item');
            switch (target.dataset.func) {
                case 'left-in':
                    if (!value.match(/^\d+$/)) return ;
                    queue.qunshift(value);
                    num.value = '';
                    break;
                case 'left-out':
                    queue.qshift();
                    alert(items[0].innerHTML);
                    break;
                case 'right-in':
                    if (!value.match(/^\d+$/)) return ;
                    queue.qpush(value);
                    num.value = '';
                    break;
                case 'right-out':
                    queue.qpop();
                    alert(items[items.length-1].innerHTML);
                    break;
                case 'bubble-sort':
                    queue.visualBubble();
                    break;
                case 'quick-sort':
                    queue.qsort();
                    queue.visualSort();
                    break;
                case 'random':
                    queue.random();
                    break;
            }
        } 
    }
}
// 初始化队列点击消失事件
function initQueue () {
    var show = $('show-item');
    queue._paintContainer = show;
    queue.paint();

    show.onclick = function () {
        var event = event || window.event;
        var target = event.target || event.srcElement;

        if (target.className == 'item') {
            this.removeChild(target);
        }
    }
}

function init() {
    initQueue();
    initControlBar();
}

init();