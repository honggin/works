/**
 * Tag plugin
 * @constructor
 */
function Tag(option) {
    this.hash = {};
    this.arr = [];
    this.tagInput = option.tagInput;
    this.tagWrap = option.wrap;
}


Tag.prototype = {
    constructor: Tag,

    MAX_TAGS: 10,

    SPLIT_REG: /[\s,，、]+/,

    /**
     * add a tag
     */
    add: function () {
        var tagArr = this.tagInput.value.trim().split(this.SPLIT_REG);
        var hash = this.hash;
        this.tagInput.value = '';

        tagArr = tagArr.filter(function (str) {
            return str.length > 0 && hash[str] == undefined && (hash[str] = true);
        })

        if (tagArr.length <= 0) {
            return ;
        }

        this.arr = this.arr.concat(tagArr);

        if (this.arr.length > this.MAX_TAGS) {
            var len = this.arr.length - this.MAX_TAGS;
            for (var i = 0; i < len; i++) {
                this.del(i);
            }
        }

        this.render();
    },
    /**
     * delete a tag
     *
     * @param {number} index - tag index
     */
    del: function (index) {
        if (this.arr.length <= 0) {
            return ;
        }

        delete this.hash[this.arr[index]];
        this.arr.splice(index,1);
        this.render();
    },
    /**
     * render tags
     */
    render: function () {
        var wrap = this.tagWrap;
        var arr = this.arr;

        wrap.innerHTML = '';

        wrap.innerHTML = arr.map(function (item, index) {
            return '<span class="tag" index="'+index+'">' + item + '</span>';
        }).join('');
    }
}