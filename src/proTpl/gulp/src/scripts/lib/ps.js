var $ = require('jquery');

var PlaceSuggestion = (function() {
    function ft() {};
    dft = {
            ele: '.m-place-suggest',
            name: 'suggest',
            mpanel: '.m-suggest-panel',
            minput: '.m-suggest-input',
            mmaxcount: 10,
            mitemheight: 24,
            url: 'qq/api/placesuggestion',
            data: 'No.9527',
            ps: {
                city: '北京市',
                maptype: 'tx',
                key: 'aDdf21sd45KLFJ09Fjk9f8uf224FD'
            },
            cb: {
                itemSelect: ft,
                input: ft
            }
        }
        //函数节流
    function throttle(fn, operatDelay) {
        var timer;
        return function() {
            var self = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function() {
                fn.apply(self, args);
            }, operatDelay);
        }
    }

    function PS(opt, $ele) {

        opt = this.opt = $.extend(true, dft, opt);

        if (!$ele) {
            $ele = $(opt.ele);
        }

        this.$ele = $ele;
        this.$panel = $ele.find(opt.mpanel);
        this.$ipt = $ele.find(opt.minput);
        this.init();
    }
    PS.prototype = {
        init: function() {
            this.initUI();
            this.initEvent();
        },
        initUI: function() {
            $ele = this.$ele;
            $panel = this.$panel;
            $ipt = this.$ipt;
        },
        initEvent: function() {
            var self = this,
                opt = this.opt;

            var $ele = this.$ele,
                $ipt = this.$ipt,
                $panel = this.$panel;

            var placeThrottle = throttle(function(place) {
                self.getPlace(place, function(data) {
                    self.updateSelectItem(data);
                    $panel.show();
                });
            }, 200);

            self.idx = 0
                // item 选择项
            $panel.on('mousedown', '.item', function(e) {
                var $tgt = $(this);

                self.selectItem($tgt.data('idx'));
                $panel.hide();
            });

            $ipt
                .on('focus', function() {
                    $panel.show();
                })
                .on('blur', function() {
                    //$panel.html("").hide();
                })
                .on('input', function(e) {
                    var $self = $(this),
                        place, data = opt.data;

                    if (data === 'No.9527' || (data && !data.length)) {
                        place = self.setQuery({
                            query: $self.val()
                        }).getQuery();
                        placeThrottle(place);
                    } else {

                    }
                })
                .on('keyup', function(e) {

                    switch (e.keyCode) {
                        case 13:
                            $panel.hide();
                            self.selectItem(self.idx);
                            break;
                        case 38:
                            self.selectItem(--self.idx);
                            break;
                        case 40:
                            self.selectItem(++self.idx);
                            break;
                    }
                });
        },
        setQuery: function(data) {
            this.opt.ps = $.extend(this.opt.ps, data);
            return this;
        },
        getQuery: function() {
            return this.opt.ps;
        },
        setCity: function(str) {
            this.setQuery({
                city: str
            });
        },
        selectItem: function(cur) {
            this.idx = cur = (cur = cur % this.curLen) < 0 ? this.curLen + cur : cur;

            var self = this,
                opt = this.opt,
                data = self.res[cur],
                $items = self.$panel.children('.item'),
                $item = $items.eq(cur);

            $items.removeClass('active');
            $item.addClass('active');

            // data bind
            self.$ipt.data('ps', {
                'lat': data.lat,
                'lng': data.lng,
                'name': data.addr + data.name
            });

            self.$ipt.val($item.text());

            opt.cb.itemSelect(data);
        },
        fuzzySearch: function(data, str) {
            var list = [];

            data.forEach(function(val) {
                var idx = val.name.indexOf($.trim(str));

                //支持第二搜索 如拼音后发在第二项启用如下代码即可
                //idx = (idx === -1) ? (val[1].indexOf(str)): idx;

                (idx > -1) && list.push({
                    name: val,
                    index: idx
                });
            })
            list = list.sort(function(x, y) {
                return x[0] > y[0];
            })

            return list;
        },
        updateSelectItem: function(data) {
            var i, items = [],
                opt = this.opt;

            this.curLen = data.length;

            for (i = 0; i < opt.mmaxcount && i < this.curLen; i++) {

                items.push('<div class="item' + (i === 0 ? ' active' : '') +
                    '" data-id="' + data[i].id + '" data-idx="' + i + '">' +
                    data[i].name + '<span>' + (data[i].addr || '') + '</span></div>');
            }
            this.idx = 0;

            this.$panel.html(items.join(''));
        },
        getPlace: function(querydata, cb) {
            var self = this,
                opt = this.opt;

            $.ajax({
                url: opt.url,
                data: querydata,
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    if (data['status'] === 0) {
                        self.res = data['data'];
                        cb && cb(self.res);
                    }
                },
                error: function(data) {
                    alert("系统繁忙，请稍后再试");
                }
            });
        }
    }
    return PS;
})()

module.exports = PlaceSuggestion;