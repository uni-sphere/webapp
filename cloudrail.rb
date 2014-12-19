var CRC = CloudRailClient,
	CRI = CRC.CloudRailInterface,
	cloudrail_client_id = "g7AcJdcjP0u_JDZafiSmoQ",
	dropbox_client_id 	= "9ky4h3c3uavdbue",
	google_client_id 	= "782701429535-fi3ffr8d21itnldcpitlrgjlhn2p2itu",
	skydrive_client_id 	= "skydrive client id",
	user_identity,
	rootFile;

/**
 * Initialization of all CloudRail-Services
 **/

//CloudRail Initialization
CRC.setClientID(cloudrail_client_id);

/*
 * Dropbox
 */

//Dropbox initialization
var sDropboxServiceTag = 'Dropbox';

// Dropbox Service initialization
CRI.initService(sDropboxServiceTag);

// Create a new ClientIdentity instance white own
// Dropbox Developer Account data.
var oDropboxClientIdentity = new CRC.ClientIdentity(sDropboxServiceTag, {'client_id': dropbox_client_id});

/*
 * GoogleDrive
 */

//GoogleDrive initialization
var sGoogleDriveServiceTag = 'GoogleDrive';

// GoogleDrive Service initialization
CRI.initService(sGoogleDriveServiceTag);

// Create a new ClientIdentity instance white own
// GoogleDrive Developer Account data.
var oGoogleDriveClientIdentity = new CRC.ClientIdentity(sGoogleDriveServiceTag, {'client_id': google_client_id});


/*
 * Skydrive
 */

//Skydrive initialization
var sSkydriveServiceTag = 'Skydrive';

// Skydrive Service initialization

// Create a new ClientIdentity instance white own
// Skydrive Developer Account data.


/**
 * Start a user authentication request
 **/

function openUserAuthRequest(sServiceTag, oClientIdentity) {
 window.addEventListener("click", function() {

	user_identity = new CRC.UserIdentity(sServiceTag, {});
	CRI.read(user_identity, oClientIdentity, function(resp) {
		console.log("hello");
	  if(resp.getStatus() == 200) {
	    user_identity = resp.getResults()[0];
			openRootFile(sServiceTag, user_identity);
		}	else {
			window.alert("problem with authentif");
		}
	});
})
}

function openRootFile(sServiceTag, user_identity) {
console.log("root");
  rootFile = new CRC.File(sServiceTag, {});

	rootFile.read(user_identity, function(resp) {

		if(resp.getStatus() == 200) {
			rootFile = resp.getResults()[0];
      readChildren();
		} else {
			alert("Reading root directory failed!");
		}
	});
}

function readChildren() {
console.log("children");
	var i = 0,
  count = rootFile.aniChilds.length,
  done = 0;

  for(; i < count; i++) {

		rootFile.aniChilds[i].read(user_identity, function(resp) {
			++done;
			rootFile.aniChilds[i] = resp.getResults()[0];

			if(done == count) {
				showRootDirectory();
			}
		});
	};
}

function showRootDirectory() {
	var i = 0,
  	list = document.createElement("ul"),
    uploadButton,
    filePicker,
    count = rootFile.aniChilds.length;

  content.appendChild(list);

  for(; i < count; i++) {
		list.appendChild(createListElement(rootFile.aniChilds[i]));
	}

	/* Add Upload Button */
  filePicker = document.createElement("input");
  filePicker.setAttribute("type", "file");
  filePicker.setAttribute("id", "files");
  content.appendChild(filePicker);

  uploadButton = document.createElement("button");
  uploadButton.setAttribute("value", "Upload");
  uploadButton.setAttribute("type", "button");
  uploadButton.setAttribute("name", "upload");
  uploadButton.appendChild(document.createTextNode("Upload"));
  content.appendChild(uploadButton);

  uploadButton.addEventListener("click", function() {

		var upFile = document.getElementById("files").files,
			file;

    if(upFile.length == 0) {
			return;
    }

    upFile = upFile[0];
    file = new CRC.File(sServiceTag, {});
    file.sFilename = upFile.name;
    file.sMimeType = upFile.type;
    file.lStreamSize = upFile.size;
		file.bStreamData = upFile;

    file.create(user_identity, function(resp) {

			if(resp.getStatus() == 200) {
				document.getElementById("files").value = "";

			} else {
				alert("Upload failed!");
			}
		});
	});
}

function createListElement(child) {

	var li = document.createElement("li");

  if(!child.isDir) {
		var a = document.createElement("a");
    a.setAttribute("href", "#");

		a.addEventListener("click", (function (child) {

			return function() {
				downloadFile(child);
				return false;
			};

		})(child));

    a.appendChild(document.createTextNode(child.sFilename));
    li.appendChild(a);
	} else {
		li.appendChild(document.createTextNode(child.sFilename));
	}
	return li;
}

function downloadFile(file) {

	file.selectStreamData();

	file.read(user_identity, function(resp) {

		if(resp.getStatus() == 200) {
			file = resp.getResults()[0];
			window.open(URL.createObjectURL(file.bStreamData));
		} else {
			alert("Downloading file failed!");
		}
	});
}

window.addEventListener("load", function() {

   // Open a oAuth User request for Dropbox
   openUserAuthRequest(sGoogleDriveServiceTag, oGoogleDriveClientIdentity);

});