// Get driving direction using Google Directions API.

var page = require('webpage').create(),
    origin, dest, steps;

if (phantom.args.length < 2) {
    console.log('Usage: direction.js origin destination');
    console.log('Example: direction.js "San Diego" "Palo Alto"');
    phantom.exit(1);
} else {
    origin = phantom.args[0];
    dest = phantom.args[1];
    page.open(encodeURI('http://maps.googleapis.com/maps/api/directions/xml?origin=' + origin +
                '&destination=' + dest + '&units=imperial&mode=driving&sensor=false'), function (status) {
        if (status !== 'success') {
            console.log('Unable to access network');
        } else {
            steps = page.content.match(/<html_instructions>(.*)<\/html_instructions>/ig);
            if (steps == null) {
                console.log('No data available for ' + origin + ' to ' + dest);
            } else {
                steps.forEach(function (ins) {
                    ins = ins.replace(/\&lt;/ig, '<').replace(/\&gt;/ig, '>');
                    ins = ins.replace(/\<div/ig, '\n<div');
                    ins = ins.replace(/<.*?>/g, '');
                    console.log(ins);
                });
                console.log('');
                console.log(page.content.match(/<copyrights>.*<\/copyrights>/ig).join('').replace(/<.*?>/g, ''));
            }
        }
        phantom.exit();
    });
}
