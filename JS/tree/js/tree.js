function $ (id) {
    return typeof id == 'string' && document.getElementById(id);
}
// 添加类
// @param (HTMLDOMElement) - ele - 需要添加类的元素
// @param (String) - name - 添加的类名
function addClass(ele, name) {
    if (ele == null || typeof name != 'string' || ele.className.match(name)) {
        return;
    }
    var name = name.trim();
    ele.className += ' ' + name;
}
// 检测类
// @param (HTMLDOMElement) - ele - 需要添加类的元素
// @param (String) - name - 检测的类名
function hasClass(ele, name) {
    if (ele != null && typeof name == 'string') return ele.className.match(name);
}
// 删除类
// @param (HTMLDOMElement) - ele - 需要删除类的元素
// @param (String) - name - 删除的类名
function removeClass(ele, name) {
    var str = name.trim();
    var reg = new RegExp(' ?\\b' + str + '\\b', 'g')
    if (ele == null || typeof name != 'string' || !ele.className.match(str)) {
        return ;
    } else {    
        ele.className = ele.className.replace(reg, '');
    }
}

// 多叉树
// 基本结构：
// {
//    value: 0,  
//    children: [],
//    parent: {},
// }

function Node (value) {
    this.value = value;
    this.children = [];
    this.parent = null;
}

function Tree (value) {
    var node = new Node(value);
    this._root = node;
    this.isSearching = false;
}

// 添加子节点
// @param -value- 节点值
// @param (Node) -parent- 父节点
// @return (Node) -newNode- 新增的节点
Tree.prototype.add = function (value, parent) {
    if (!parent instanceof Node) return;

    var newNode = new Node(value);
    newNode.parent = parent;
    parent.children[parent.children.length] = newNode;

    return newNode;
} 

// 删除子节点
// @param (Node) -node- 节点值
// @return (Node) -delNode- 删除的节点
Tree.prototype.del = function (node) {
    if (!node instanceof Node || node.parent == null) return ;

    var children = node.parent.children;

    var index = children.indexOf(node);
    var delNode = children.splice(index, 1)[0];

    return delNode;
}

// 深度优先搜索
// @param (Function) - callback - 回调函数
Tree.prototype.traverseDFS = function(tree, callback) {
    // 递归版本
    (function recurse (curNode) {
        if (curNode == null) return ;

        curNode.children.forEach(function (item) {
            recurse(item);
        })
        callback && callback(curNode);
    })(tree);

    // var curNode = this._root;
    // var stack = [];
    // var index = 0;

    // stack.push(this._root);
    // stack.push(index);
    // while (stack.length != 0) {
    //     if (curNode.children.length != 0 && index < curNode.children.length) {
    //         curNode = curNode.children[index];
    //         index = 0;
    //         stack.push(curNode);
    //         stack.push(index);
    //     } else {
    //         stack.pop();
    //         callback(stack.pop().value); 
    //         stack[stack.length-1] += 1;  
    //         curNode = stack[stack.length - 2];
    //         index = stack[stack.length - 1];
    //     }
    // }
}
// 广度优先搜索
// @param (Function) - callback - 回调函数
Tree.prototype.traverseBFS = function (tree ,callback) {
    // 迭代版本
    var queue = [];
    
    var currentTree = tree;

    while (currentTree) {
        var children = currentTree.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            queue.push(children[i]);
        }
        callback && callback(currentTree);
        currentTree = queue.shift();
    }
}
// 具象化搜索过程
// @param (Function) - fn - 搜索方法 
Tree.prototype.showSearch = function (fn) {
    if (this.isSearching) return;

    this.isSearching = true;

    var $this = this;
    var lastNode = null;

    // 扫描队列track
    this.track = [];

    // 根据遍历顺序生成的扫描序列track
    this[fn](this._root, function (node) {
        $this.track.push(node.div);
    });
    // 显示扫描序列
    var timer = setInterval(function () {
        removeClass(lastNode, 'active');
        if ($this.track.length <= 0) {
            clearInterval(timer);
            $this.isSearching = false;
            return ;
        }
        var node = $this.track.shift();
        addClass(node, 'active');
        lastNode = node;
    }, 500);
}

// 渲染DOM并且生成数据树对应的DOM树
Tree.prototype.render = function () {
    this.DOMRoot = new Node();
    this.wrap = $('tree-wrap');
    this.wrap.innerHTML = '';
    // @param (Object) - node - 待渲染的数据节点
    // @param (Object) - DOMNode  - 数据节点转换成的DOM节点
    // @param (HTMLDOMelement) - parentNode - 目前DOM节点的父节点
    // (function recurse (node, DOMNode, parentNode) {
    //     if (node == null) return ;

    //     var div = document.createElement('div');
    //     div.className = 'node';
    //     div.innerHTML = node.value; 

    //     // 插入到DOM渲染树
    //     parentNode.appendChild(div);
    //     DOMNode.value = div;
    //     // 建立DOM节点和数据节点的映射
    //     div.node = node;

    //     node.children.forEach(function (item, index) {
    //         DOMNode.children[index] = new Node();
    //         DOMNode.children[index].parent = div;
    //     })
    //     node.children.forEach(function (item, index) {
    //         recurse(item, DOMNode.children[index], div);
    //     })
    // }(this._root, this.DOMRoot, this.wrap));

    // @param (Object) - node - 待渲染的数据节点
    // @param (Object) - DOMNode  - 数据节点转换成的DOM节点
    // @param (HTMLDOMelement) - parentNode - 目前DOM节点的父节点
    (function recurse (node, parentNode) {
        if (node == null) return ;

        var div = document.createElement('div');
        div.className = 'node';
        div.innerHTML = node.value; 

        // 插入到DOM渲染树
        parentNode.appendChild(div);
        // 建立DOM节点和数据节点的互相映射
        div.node = node;
        node.div = div;

        node.children.forEach(function (item, index) {
            recurse(item, div);
        })
    }(this._root, this.wrap));
}
var tree = new Tree('1');

var n2 = tree.add('2', tree._root);
var n3 = tree.add('3', tree._root);
var n4 = tree.add('4', tree._root);
var n5 = tree.add('5', tree._root);


var n2_1 = tree.add('2-1', n2);
var n2_2 = tree.add('2-2', n2);
var n2_3 = tree.add('2-3', n2);
var n2_4 = tree.add('2-4', n2);

var n3_1 = tree.add('3-1', n3);
var n3_2 = tree.add('3-2', n3);
var n3_3 = tree.add('3-3', n3);
var n3_4 = tree.add('3-4', n3);

var n4_1 = tree.add('4-1', n4);
var n4_2 = tree.add('4-2', n4);

tree.render();

var delList = [];

$('search').onclick = function (event) {
    var event = event || window.event;
    var target = event.target || event.srcElement;

    if (target.nodeName.toLowerCase() == 'button') {
        switch(target.dataset.ctrl) {
            case 'BFS':
                tree.showSearch('traverseBFS');
                break;
            case 'DFS':
                tree.showSearch('traverseDFS');
                break;
        }
    } 
}

$('manual').onclick = function (event) {
    var event = event || window.event;
    var target = event.target || event.srcElement;

    if (target.nodeName.toLowerCase() == 'button') {
        switch(target.dataset.type) {
            case 'del':
                delList = tree.wrap.querySelectorAll('.selected');
                Array.prototype.slice.call(delList).forEach(function (item) {
                    tree.del(item.node);
                })
                delList = [];
                tree.render();
                break;
            case 'add':
                var value =  $('node-value').value.trim();
                $('node-value').value = '';
                addList = tree.wrap.querySelectorAll('.selected');
                Array.prototype.slice.call(addList).forEach(function (item) {
                    tree.add(value, item.node);
                })
                addList = [];
                tree.render();
                break;
        }
    } 
}

$('tree-wrap').onclick = function () {
    var event = event || window.event;
    var target = event.target || event.srcElement;
    var index = -1;

    if (hasClass(target, 'node')) {
        var parent = target;

        while (!hasClass(parent.parentNode, 'select') && hasClass(parent, 'node')) {
            parent = parent.parentNode;
        }

        // 存在被选择的父元素
        if (parent != tree.wrap) {
            return ;
        } 

        if (target.className.match('selected')) {
            removeClass(target, 'selected');
        } else {
            var children = target.querySelectorAll('.node');
            children && children.forEach(function (item) {
                removeClass(item, 'selected');
            })
            addClass(target, 'selected');
        }
    }
    event.StopPropagation ? event.StopPropagation() : event.cancelBubble = true; 
}