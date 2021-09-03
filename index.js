const https = require('request');
const exiftool = require("exiftool-vendored").exiftool
var fs = require('fs');
const request = require('request');
const auth = require('./auth.js');

var today = new Date(); // download photos for this date and backwards
//var today = new Date('2020-12-07');
today.setHours(0,0,0);

var minimumDate = new Date('2020-07-01');

async function getEntries(fetchDate) {
	await sleep(1000); // to prevent sending too many simultaneous requests to Amigest API
	
	var url = `https://serviceapp.amisgest.ca/8_2/breeze/Breeze/observation?beginDateTime=${fetchDate.toISOString().slice(0, 10)}&endDateTime=${fetchDate.toISOString().slice(0, 10)}T23:59:59`
	
	request.get(url, {
		'auth': {
			'bearer': auth.authBearer
	  	  },
		'headers': {
			'personID': auth.personID
		}
		},
		function (error, response, body) {
			const info = JSON.parse(body);
			var photosToDownload = 0;
			var photosDownloaded = 0;
			
			console.log("Downloading "+info.length+" entries for "+fetchDate.toISOString().slice(0, 10))
			
			for (observation of info) {
				const imageID = observation['image_id']				

				if (imageID > 0) {
					photosToDownload++;
					const caption = observation['text']
					const dateString = fetchDate.toISOString().slice(0, 10);
					const imageName = "photos/"+dateString+'-'+observation['$id']+'.jpg'
					
					downloadPhoto(imageID, imageName, function() {
						const tags = {
							AllDates: fetchDate.toISOString(),
							'Caption-Abstract': caption
						};
						
						exiftool.write(imageName, tags);
						photosDownloaded++;
					})
				}
			}
			
			const dayBefore = new Date(fetchDate.valueOf()-86400*1000)
			
			if (dayBefore > minimumDate) {
				getEntries(dayBefore);
			}
		}
	);
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function downloadPhoto(imageID, imageName, callback) {
	//console.log("downloading image "+imageID)
	const imageURL = `https://serviceapp.amisgest.ca/8_2/api/Photo/getImage?id=${imageID}&access_token=${auth.authBearer}&id2=${auth.personID}`
	
	var download = function(uri, filename, callback){
	  request.head(uri, function(err, res, body) {
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	  });
	};
		
	download(imageURL, imageName, callback);
}

getEntries(today);













// var exportedPhotos = []
// 
// var dates = document.getElementsByClassName("bar-button bar-button-md bar-button-outline bar-button-outline-md bar-button-round bar-button-round-md bar-button-block bar-button-block-md bar-button-outline-md-dark")
// var date = dates[dates.length-1].innerText.replace(/\r?\n|\r/, "")
// var photoContainers = document.getElementsByClassName("container")
// var regex = /id=([0-9]+)/;
// 
// for (var i=0; i<photoContainers.length-1; i++) {
// 	photo = photoContainers[i].getElementsByClassName("photo")
// 	if (photo.length > 0) {
// 		var newPhoto = []
// 		newPhoto.push(date)
// 		newPhoto.push("\""+photoContainers[i].getElementsByClassName("preview-text-observation")[0].value+"\"")
// 		newPhoto.push(photo[0].style["backgroundImage"].match(regex)[1])
// 		newPhotoString = newPhoto.join(",")
// 		exportedPhotos.push(newPhoto)
// 	}
// }
// 
// 
// var csv = exportedPhotos.join("\n")