/**
 *
 * Created by jl on 3/17/15.
 */
var archive = {};
archive.withDate = function(collection){
    var len = collection.length;
    var archives = [];
    var item = null;
    var dates = [];
    var i;

    for(i = 0; i < len; i++){
        dates.push(new Date(collection[i].date));
    }
    for(i = 0; i < len; i++){
        item = collection[i];
        if(archives.length === 0 || (dates[i].getFullYear() !== dates[i - 1].getFullYear() || dates[i - 1].getMonth() !== dates[i].getMonth() || dates[i].getDate() !== dates[i - 1].getDate())){
            archives.push({
                group: dates[i].getFullYear() + '-' + (dates[i].getMonth() + 1) + '-' + dates[i].getDate(),
                items: [item]
            });
        }else{
            archives[archives.length - 1].items.push(item);
        }
    }
    return archives;
};

archive.withField = function (collection,field) {
    var archives = {};
    var group = null;
    if(collection && collection.length > 0) {
        collection.forEach(function(item){
            group = archives[item[field]];
            if(!group){
                group = archives[item[field]] = [];
            }
            group.push(item);
        });
    }

    return archives;
};

module.exports = archive;
