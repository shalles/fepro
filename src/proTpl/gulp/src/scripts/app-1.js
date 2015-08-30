var LocalStorage = require('lib/localStorage');

var ls = new LocalStorage();

ls.setItem('name', 'shalles');

function simpleTemplate(str, data) {

    if (!str || !data) return '';

    var type = Object.prototype.toString.call(data),
        strRes = '',
        regex = /\{\{\s*(\w+)\s*\}\}/g;

    switch (type) {
        case '[object Array]':
            for (var i = 0, len = data.length; i < len; i++) {
                strRes += simpleTemplate(str, data[i]);
            }
            break;
        case '[object Object]':
            strRes = str.replace(regex, function ($0, $1) {
                return data[$1];
            });
            break;
        case '[object String]':
            strRes = str.replace(regex, data);
            break;
        default:
            strRes = '';
    }

    return strRes;
};

console.log(2);

console.log(simpleTemplate(require('template/code.tpl'),{id: 1234, path: 'http://shalles.github.io', code: 'var code = 89757;'}));