function KeyValuePair(key, value) {
    this.key = key;
    this.value = value;
}

KeyValuePair.prototype.toString = function() {
    return "(" + this.key.toString() + "=" + this.value.toString() + ")";
}

// 
// // Original code by Andy E of Stack Overflow
// http://stackoverflow.com/a/7676115/959934
// Modified by me to allow multiple values to be associated with a single key
function getURLParams(source, useOrderedList) {
    var urlParams = {};
    var orderedList = [];
    var e,
    a = /\+/g,  // Regex for replacing addition symbol with a space
    r = /([^&=;]+)=?([^&;]*)/g,
    d = function (s) {
        //Returns the original string if it can't be URI component decoded
        var spaced = s.replace(a, " ");
        try {
            return decodeURIComponent(spaced);
        }
        catch(e) {
            return spaced;
        }
    },
    q = source;
    if (q.charAt(0) == '#') {
        q = q.substring(1);
    }

    while (e = r.exec(q)) {
        var key = d(e[1]);
        var value = d(e[2]);
        if (useOrderedList) {
            var listItem = new KeyValuePair(key, value);
            orderedList.push(listItem);
        }
        else {
            if (!urlParams[key]) {
                urlParams[key] = [value];
            }
            else {
                // If key already found in the query string, the value is tacked on
                urlParams[key].push(value);
            }
        }
    }
    if (useOrderedList) {
        return orderedList;
    }
    else {
        return urlParams;
    }
};

var addHashParam = function(key, value) {
    var currentHash = window.location.hash;
    if (!currentHash.length) {
        return key + "=" + value;
    }
    else return currentHash + "&" + key + "=" + value;
}

var hashTableToFlatList = function(table) {
    var flatList = [];
    var hash;
    for (hash in table) {
        var list = table[hash];
        if (list && $.isArray(list)) {
            list = hashTableToFlatList(list);
        }
        if ($.isArray(list)) {
            flatList = flatList.concat(list);
        }
        else flatList.push(list);
    }
    return flatList;
};

var loadFunction = function() {
    var urlParams = getURLParams(window.location.hash, true);
    var inputCount = urlParams.length;
    if (inputCount) {
        playlist.updateSettings({
            updateURLOnAdd: false
        });
        var inputResources = [];
        for (var param in urlParams) {
            var keyValuePair = urlParams[param];
            inputResources.push(keyValuePair);
        }
        playlist.addResourceAndWaitUntilLoaded(inputResources).always(function() {
            playlist.updateSettings({
                updateURLOnAdd: true
            });
        });
    }
    else {
        $.unblockUI();
    }
};

$(document).ready(function() {
    $.blockUI();
    soundManager.onready(loadFunction);
});