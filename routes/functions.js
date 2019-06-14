
var request = require('request');

var qs = require('querystring');
var final_send = function (text,url ,  options , callback) {
    var post_data = {
        "text" : text
    }
//    var json = JSON.stringify(post_data);
	var json = qs.stringify(post_data);
    var my_option = options;
    my_option.headers['Content-Length'] = json.length;
	my_option.url = url;
    //my_option.method = "get";
	console.log(my_option);
//    var req = http.request(my_option, (res) => {if (res) console.log("Get something "); callback(res);});
    
//    req.on('error', function(err) {
//        console.log("Error when send msg, err = " + err);
  //      callback();
    //})
//    req.write(json);
  //  req.end();
	my_option.body = json;
	request(my_option, (err,mid_res,body) => {
		if(err) {
			callback();
		} else {
			callback({body : body});
		}
	});
}

module.exports = {final_send};
