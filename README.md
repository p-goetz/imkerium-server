# imkerium server application

RESTful web services for the imkerium.de website and mobile application to provide beekeeper's information and manage their hives. 

## Technical Setup

- mongodb as data store
- node.js as runtime environment
	- express to provide server functionality
	- mongoose to access mongodb
	- postmark to send mail

## Folder structure

- app/
	app.js: configure and set up application
	models/ 
		- beekeeper.js: model for the beekeeper information used by the website
		- site.js: model for the site and hive information used by the mobile app
- package.json: node module setup and dependencies

## Run 

	node app/app.js
