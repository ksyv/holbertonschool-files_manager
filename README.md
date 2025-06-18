<div align="center"><img src="https://github.com/ksyv/holbertonschool-web_front_end/blob/main/baniere_holberton.png"></div>

# Resources

## Table of Contents :

  - [0. Redis utils](#subparagraph0)
  - [1. MongoDB utils](#subparagraph1)
  - [2. First API](#subparagraph2)
  - [3. Create a new user](#subparagraph3)
  - [4. Authenticate a user](#subparagraph4)
  - [5. First file](#subparagraph5)
  - [6. Get and list file](#subparagraph6)
  - [7. File publish/unpublish](#subparagraph7)
  - [8. File data](#subparagraph8)
  - [9. Image Thumbnails](#subparagraph9)

## Resources
### Read or watch:
* [Node JS getting started](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs)
* [Process API doc](https://node.readthedocs.io/en/latest/api/process/)
* [Express getting started](https://expressjs.com/en/starter/installing.html)
* [Mocha documentation](https://mochajs.org/)
* [Nodemon documentation](https://github.com/remy/nodemon#nodemon)
* [MongoDB](https://github.com/mongodb/node-mongodb-native)
* [Bull](https://github.com/OptimalBits/bull)
* [Image thumbnail](https://www.npmjs.com/package/image-thumbnail)
* [Mime-Types](https://www.npmjs.com/package/mime-types)
* [Redis](https://www.npmjs.com/package/redis/v/2.8.0)

## Learning Objectives
At the end of this project, you are expected to be able to explain to anyone, without the help of Google:
* how to create an API with Express
* how to authenticate a user
* how to store data in MongoDB
* how to store temporary data in Redis
* how to setup and use a background worker

## Requirements
### General
* Allowed editors:vi,vim,emacs,Visual Studio Code
* All your files will be interpreted/compiled on Ubuntu 20.04 LTS usingnode(version 20.x.x)
* All your files should end with a new line
* AREADME.mdfile, at the root of the folder of the project, is mandatory
* Your code should use thejsextension
* Your code will be verified against lint using ESLint

## Task
### 0. Redis utils <a name='subparagraph0'></a>

Inside the folder <code>utils</code>, create a file <code>redis.mjs</code> that contains the class <code>RedisClient</code>.

<code>RedisClient</code> should have:

* the constructor that creates a client to Redis:


  * any error of the redis client must be displayed in the console (you should use <code>on('error')</code> of the redis client)
* a function <code>isAlive</code> that returns <code>true</code> when the connection to Redis is a success otherwise, <code>false</code>
* an asynchronous function <code>get</code> that takes a string key as argument and returns the Redis value stored for this key
* an asynchronous function <code>set</code> that takes a string key, a value and a duration in second as arguments to store it in Redis (with an expiration set by the duration argument)
* an asynchronous function <code>del</code> that takes a string key as argument and remove the value in Redis for this key

After the class definition, create and export an instance of <code>RedisClient</code> called <code>redisClient</code>.

```
bob@dylan:~$ cat main.js
import redisClient from './utils/redis';

(async () => {
    console.log(redisClient.isAlive());
    console.log(await redisClient.get('myKey'));
    await redisClient.set('myKey', 12, 5);
    console.log(await redisClient.get('myKey'));

    setTimeout(async () => {
        console.log(await redisClient.get('myKey'));
    }, 1000*10)
})();

bob@dylan:~$ npm run dev main.js
true
null
12
null
bob@dylan:~$
```

---

### 1. MongoDB utils <a name='subparagraph1'></a>

Inside the folder <code>utils</code>, create a file <code>db.mjs</code> that contains the class <code>DBClient</code>.

<code>DBClient</code> should have:

* the constructor that creates a client to MongoDB:


  * host: from the environment variable <code>DB_HOST</code> or default: <code>localhost</code>
  * port: from the environment variable <code>DB_PORT</code> or default: <code>27017</code>
  * database: from the environment variable <code>DB_DATABASE</code> or default: <code>files_manager</code>
* a function <code>isAlive</code> that returns <code>true</code> when the connection to MongoDB is a success otherwise, <code>false</code>
* an asynchronous function <code>nbUsers</code> that returns the number of documents in the collection <code>users</code>
* an asynchronous function <code>nbFiles</code> that returns the number of documents in the collection <code>files</code>

After the class definition, create and export an instance of <code>DBClient</code> called <code>dbClient</code>.

```
bob@dylan:~$ cat main.js
import dbClient from './utils/db';

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject()
                }
                else if(!dbClient.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve()
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
    console.log(dbClient.isAlive());
    await waitConnection();
    console.log(dbClient.isAlive());
    console.log(await dbClient.nbUsers());
    console.log(await dbClient.nbFiles());
})();

bob@dylan:~$ npm run dev main.js
false
true
4
30
bob@dylan:~$
```

---

### 2. First API <a name='subparagraph2'></a>

Inside <code>server.js</code>, create the Express server:

* it should listen on the port set by the environment variable <code>PORT</code> or by default 5000
* it should load all routes from the file <code>routes/index.js</code>

Inside the folder <code>routes</code>, create a file <code>index.js</code> that contains all endpoints of our API:

* <code>GET /status</code> => <code>AppController.getStatus</code>
* <code>GET /stats</code> => <code>AppController.getStats</code>

Inside the folder <code>controllers</code>, create a file <code>AppController.js</code> that contains the definition of the 2 endpoints:

* <code>GET /status</code> should return if Redis is alive and if the DB is alive too by using the 2 utils created previously: <code>{ "redis": true, "db": true }</code> with a status code 200
* <code>GET /stats</code> should return the number of users and files in DB: <code>{ "users": 12, "files": 1231 }</code> with a status code 200


  * <code>users</code> collection must be used for counting all users
  * <code>files</code> collection must be used for counting all files

<strong>Terminal 1:</strong>

```
bob@dylan:~$ npm run start-server
Server running on port 5000
...
```

<strong>Terminal 2:</strong>

```
bob@dylan:~$ curl 0.0.0.0:5000/status ; echo ""
{"redis":true,"db":true}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/stats ; echo ""
{"users":4,"files":30}
bob@dylan:~$
```

---

### 3. Create a new user <a name='subparagraph3'></a>

Now that we have a simple API, it’s time to add users to our database.

In the file <code>routes/index.js</code>,  add a new endpoint:

* <code>POST /users</code> => <code>UsersController.postNew</code>

Inside <code>controllers</code>, add a file <code>UsersController.js</code> that contains the new endpoint:

<code>POST /users</code> should create a new user in DB:

* To create a user, you must specify an <code>email</code> and a <code>password</code>
* If the <code>email</code> is missing, return an error <code>Missing email</code> with a status code 400
* If the <code>password</code> is missing, return an error <code>Missing password</code> with a status code 400
* If the <code>email</code> already exists in DB, return an error <code>Already exist</code> with a status code 400
* The <code>password</code> must be stored after being hashed in <code>SHA1</code>
* The endpoint is returning the new user with only the <code>email</code> and the <code>id</code> (auto generated by MongoDB) with a status code 201
* The new user must be saved in the collection <code>users</code>:


  * <code>email</code>: same as the value received
  * <code>password</code>: <code>SHA1</code> value of the value received

```
bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "[email protected]", "password": "toto1234!" }' ; echo ""
{"id":"5f1e7d35c7ba06511e683b21","email":"[email protected]"}
bob@dylan:~$ 
bob@dylan:~$ echo 'db.users.find()' | mongo files_manager
{ "_id" : ObjectId("5f1e7d35c7ba06511e683b21"), "email" : "[email protected]", "password" : "89cad29e3ebc1035b29b1478a8e70854f25fa2b2" }
bob@dylan:~$ 
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "[email protected]", "password": "toto1234!" }' ; echo ""
{"error":"Already exist"}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/users -XPOST -H "Content-Type: application/json" -d '{ "email": "[email protected]" }' ; echo ""
{"error":"Missing password"}
bob@dylan:~$
```

---

### 4. Authenticate a user <a name='subparagraph4'></a>

In the file <code>routes/index.js</code>,  add 3 new endpoints:

* <code>GET /connect</code> => <code>AuthController.getConnect</code>
* <code>GET /disconnect</code> => <code>AuthController.getDisconnect</code>
* <code>GET /users/me</code> => <code>UserController.getMe</code>

Inside <code>controllers</code>, add a file <code>AuthController.js</code> that contains new endpoints:

<code>GET /connect</code> should sign-in the user by generating a new authentication token:

* By using the header <code>Authorization</code> and the technique of the Basic auth (Base64 of the <code>&lt;email&gt;:&lt;password&gt;</code>), find the user associate to this email and with this password (reminder: we are storing the SHA1 of the password)
* If no user has been found, return an error <code>Unauthorized</code> with a status code 401
* Otherwise:


  * Generate a random string (using <code>uuidv4</code>) as token
  * Create a key: <code>auth_&lt;token&gt;</code>
  * Use this key for storing in Redis (by using the <code>redisClient</code> create previously) the user ID for 24 hours
  * Return this token: <code>{ "token": "155342df-2399-41da-9e8c-458b6ac52a0c" }</code> with a status code 200

Now, we have a way to identify a user, create a token (= avoid to store the password on any front-end) and use this token for 24h to access to the API!

Every authenticated endpoints of our API will look at this token inside the header <code>X-Token</code>.

<code>GET /disconnect</code> should sign-out the user based on the token:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
  * Otherwise, delete the token in Redis and return nothing with a status code 204

Inside the file <code>controllers/UsersController.js</code> add a new endpoint:

<code>GET /users/me</code> should retrieve the user base on the token used:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
  * Otherwise, return the user object (<code>email</code> and <code>id</code> only)

```
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"031bffac-3edc-4e51-aaae-1c121317da8a"}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/users/me -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""
{"id":"5f1e7cda04a394508232559d","email":"[email protected]"}
bob@dylan:~$ 
bob@dylan:~$ curl 0.0.0.0:5000/disconnect -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""

bob@dylan:~$ curl 0.0.0.0:5000/users/me -H "X-Token: 031bffac-3edc-4e51-aaae-1c121317da8a" ; echo ""
{"error":"Unauthorized"}
bob@dylan:~$
```

---

### 5. First file <a name='subparagraph5'></a>

In the file <code>routes/index.js</code>,  add a new endpoint:

* <code>POST /files</code> => <code>FilesController.postUpload</code>

Inside <code>controllers</code>, add a file <code>FilesController.js</code> that contains the new endpoint:

<code>POST /files</code> should create a new file in DB and in disk:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
* To create a file, you must specify:


  * <code>name</code>: as filename
  * <code>type</code>: either <code>folder</code>, <code>file</code> or <code>image</code>
  * <code>parentId</code>: (optional) as ID of the parent (default: 0 -> the root)
  * <code>isPublic</code>: (optional) as boolean to define if the file is public or not (default: false)
  * <code>data</code>: (only for <code>type=file|image</code>) as Base64 of the file content
* If the <code>name</code> is missing, return an error <code>Missing name</code> with a status code 400
* If the <code>type</code> is missing or not part of the list of accepted type, return an error <code>Missing type</code> with a status code 400
* If the <code>data</code> is missing and <code>type != folder</code>, return an error <code>Missing data</code> with a status code 400
* If the <code>parentId</code> is set:


  * If no file is present in DB for this <code>parentId</code>, return an error <code>Parent not found</code> with a status code 400
  * If the file present in DB for this <code>parentId</code> is not of type <code>folder</code>, return an error <code>Parent is not a folder</code> with a status code 400
* The user ID should be added to the document saved in DB - as owner of a file
* If the type is <code>folder</code>, add the new file document in the DB and return the new file with a status code 201
* Otherwise:


  * All file will be stored locally in a folder (to create automatically if not present):


    * The relative path of this folder is given by the environment variable <code>FOLDER_PATH</code>
    * If this variable is not present or empty, use <code>/tmp/files_manager</code> as storing folder path
  * Create a local path in the storing folder with filename a UUID
  * Store the file in clear (reminder: <code>data</code> contains the Base64 of the file) in this local path
  * Add the new file document in the collection <code>files</code> with these attributes:


    * <code>userId</code>: ID of the owner document (owner from the authentication)
    * <code>name</code>: same as the value received
    * <code>type</code>: same as the value received
    * <code>isPublic</code>: same as the value received
    * <code>parentId</code>: same as the value received - if not present: 0
    * <code>localPath</code>: for a <code>type=file|image</code>, the absolute path to the file save in local
  * Return the new file with a status code 201

```
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" -H "Content-Type: application/json" -d '{ "name": "myText.txt", "type": "file", "data": "SGVsbG8gV2Vic3RhY2shCg==" }' ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
bob@dylan:~$
bob@dylan:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9
bob@dylan:~$
bob@dylan:~$ cat /tmp/files_manager/2a1f4fc3-687b-491a-a3d2-5808a02942c9 
Hello Webstack!
bob@dylan:~$
bob@dylan:~$ curl -XPOST 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" -H "Content-Type: application/json" -d '{ "name": "images", "type": "folder" }' ; echo ""
{"id":"5f1e881cc7ba06511e683b23","userId":"5f1e7cda04a394508232559d","name":"images","type":"folder","isPublic":false,"parentId":0}
bob@dylan:~$
bob@dylan:~$ cat image_upload.py
import base64
import requests
import sys

file_path = sys.argv[1]
file_name = file_path.split('/')[-1]

file_encoded = None
with open(file_path, "rb") as image_file:
    file_encoded = base64.b64encode(image_file.read()).decode('utf-8')

r_json = { 'name': file_name, 'type': 'image', 'isPublic': True, 'data': file_encoded, 'parentId': sys.argv[3] }
r_headers = { 'X-Token': sys.argv[2] }

r = requests.post("http://0.0.0.0:5000/files", json=r_json, headers=r_headers)
print(r.json())

bob@dylan:~$
bob@dylan:~$ python image_upload.py image.png f21fb953-16f9-46ed-8d9c-84c6450ec80f 5f1e881cc7ba06511e683b23
{'id': '5f1e8896c7ba06511e683b25', 'userId': '5f1e7cda04a394508232559d', 'name': 'image.png', 'type': 'image', 'isPublic': True, 'parentId': '5f1e881cc7ba06511e683b23'}
bob@dylan:~$
bob@dylan:~$ echo 'db.files.find()' | mongo files_manager
{ "_id" : ObjectId("5f1e881cc7ba06511e683b23"), "userId" : ObjectId("5f1e7cda04a394508232559d"), "name" : "images", "type" : "folder", "parentId" : "0" }
{ "_id" : ObjectId("5f1e879ec7ba06511e683b22"), "userId" : ObjectId("5f1e7cda04a394508232559d"), "name" : "myText.txt", "type" : "file", "parentId" : "0", "isPublic" : false, "localPath" : "/tmp/files_manager/2a1f4fc3-687b-491a-a3d2-5808a02942c9" }
{ "_id" : ObjectId("5f1e8896c7ba06511e683b25"), "userId" : ObjectId("5f1e7cda04a394508232559d"), "name" : "image.png", "type" : "image", "parentId" : ObjectId("5f1e881cc7ba06511e683b23"), "isPublic" : true, "localPath" : "/tmp/files_manager/51997b88-5c42-42c2-901e-e7f4e71bdc47" }
bob@dylan:~$
bob@dylan:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9   51997b88-5c42-42c2-901e-e7f4e71bdc47
bob@dylan:~$
```

---

### 6. Get and list file <a name='subparagraph6'></a>

In the file <code>routes/index.js</code>,  add 2 new endpoints:

* <code>GET /files/:id</code> => <code>FilesController.getShow</code>
* <code>GET /files</code> => <code>FilesController.getIndex</code>

In the file <code>controllers/FilesController.js</code>, add the 2 new endpoints:

<code>GET /files/:id</code> should retrieve the file document based on the ID:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
* If no file document is linked to the user and the ID passed as parameter, return an error <code>Not found</code> with a status code 404
* Otherwise, return the file document

<code>GET /files</code> should retrieve all users file documents for a specific <code>parentId</code> and with pagination:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
* Based on the query parameters <code>parentId</code> and <code>page</code>, return the list of file document


  * <code>parentId</code>:


    * No validation of <code>parentId</code> needed - if the <code>parentId</code> is not linked to any user folder, returns an empty list
    * By default, <code>parentId</code> is equal to 0 = the root
  * Pagination:


    * Each page should be 20 items max
    * <code>page</code> query parameter starts at 0 for the first page. If equals to 1, it means it’s the second page (form the 20th to the 40th), etc…
    * Pagination can be done directly by the <code>aggregate</code> of MongoDB

```
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
[{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0},{"id":"5f1e881cc7ba06511e683b23","userId":"5f1e7cda04a394508232559d","name":"images","type":"folder","isPublic":false,"parentId":0},{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}]
bob@dylan:~$
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files?parentId=5f1e881cc7ba06511e683b23 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
[{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}]
bob@dylan:~$
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$
```

---

### 7. File publish/unpublish <a name='subparagraph7'></a>

In the file <code>routes/index.js</code>,  add 2 new endpoints:

* <code>PUT /files/:id/publish</code> => <code>FilesController.putPublish</code>
* <code>PUT /files/:id/publish</code> => <code>FilesController.putUnpublish</code>

In the file <code>controllers/FilesController.js</code>, add the 2 new endpoints:

<code>PUT /files/:id/publish</code> should set <code>isPublic</code> to <code>true</code> on the file document based on the ID:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
* If no file document is linked to the user and the ID passed as parameter, return an error <code>Not found</code> with a status code 404
* Otherwise:


  * Update the value of <code>isPublic</code> to <code>true</code>
  * And return the file document with a status code 200

<code>PUT /files/:id/unpublish</code> should set <code>isPublic</code> to <code>false</code> on the file document based on the ID:

* Retrieve the user based on the token:


  * If not found, return an error <code>Unauthorized</code> with a status code 401
* If no file document is linked to the user and the ID passed as parameter, return an error <code>Not found</code> with a status code 404
* Otherwise:


  * Update the value of <code>isPublic</code> to <code>false</code>
  * And return the file document with a status code 200

```
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25 -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":false,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/publish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":true,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/unpublish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e8896c7ba06511e683b25","userId":"5f1e7cda04a394508232559d","name":"image.png","type":"image","isPublic":false,"parentId":"5f1e881cc7ba06511e683b23"}
bob@dylan:~$
```

---

### 8. File data <a name='subparagraph8'></a>

In the file <code>routes/index.js</code>,  add one new endpoint:

* <code>GET /files/:id/data</code> => <code>FilesController.getFile</code>

In the file <code>controllers/FilesController.js</code>, add the new endpoint:

<code>GET /files/:id/data</code> should return the content of the file document based on the ID:

* If no file document is linked to the ID passed as parameter, return an error <code>Not found</code> with a status code 404
* If the file document (folder or file) is not public (<code>isPublic: false</code>) and no user authenticate or not the owner of the file, return an error <code>Not found</code> with a status code 404
* If the type of the file document is <code>folder</code>, return an error <code>A folder doesn't have content</code> with a status code 400
* If the file is not locally present, return an error <code>Not found</code> with a status code 404
* Otherwise:


  * By using the module <code>mime-types</code>, get the <a href="/rltoken/NQKlVwFc_iSLB9_jkDfF7w" target="_blank" title="MIME-type">MIME-type</a> based on the <code>name</code> of the file
  * Return the content of the file with the correct MIME-type

```
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/unpublish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":false,"parentId":0}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
Hello Webstack!

bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data ; echo ""
{"error":"Not found"}
bob@dylan:~$ 
bob@dylan:~$ curl -XPUT 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/publish -H "X-Token: f21fb953-16f9-46ed-8d9c-84c6450ec80f" ; echo ""
{"id":"5f1e879ec7ba06511e683b22","userId":"5f1e7cda04a394508232559d","name":"myText.txt","type":"file","isPublic":true,"parentId":0}
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e879ec7ba06511e683b22/data ; echo ""
Hello Webstack!

bob@dylan:~$
```

---

### 9. Image Thumbnails <a name='subparagraph9'></a>

Update the endpoint <code>POST /files</code> endpoint to start a background processing for generating thumbnails for a file of type <code>image</code>:

* Create a <code>Bull</code> queue <code>fileQueue</code>
* When a new image is stored (in local and in DB), add a job to this queue with the <code>userId</code> and <code>fileId</code>

Create a file <code>worker.js</code>:

* By using the module <code>Bull</code>, create a queue <code>fileQueue</code>
* Process this queue:


  * If <code>fileId</code> is not present in the job, raise an error <code>Missing fileId</code>
  * If <code>userId</code> is not present in the job, raise an error <code>Missing userId</code>
  * If no document is found in DB based on the <code>fileId</code> and <code>userId</code>, raise an error <code>File not found</code>
  * By using the module <code>image-thumbnail</code>, generate 3 thumbnails with <code>width</code> = 500, 250 and 100 - store each result on the same location of the original file by appending <code>_&lt;width size&gt;</code>

Update the endpoint <code>GET /files/:id/data</code> to accept a query parameter <code>size</code>:

* <code>size</code> can be <code>500</code>, <code>250</code> or <code>100</code>
* Based on <code>size</code>, return the correct local file
* If the local file doesn’t exist, return an error <code>Not found</code> with a status code 404

<strong>Terminal 3:</strong> (start the worker)

```
bob@dylan:~$ npm run start-worker
...
```

<strong>Terminal 2:</strong>

```
bob@dylan:~$ curl 0.0.0.0:5000/connect -H "Authorization: Basic Ym9iQGR5bGFuLmNvbTp0b3RvMTIzNCE=" ; echo ""
{"token":"f21fb953-16f9-46ed-8d9c-84c6450ec80f"}
bob@dylan:~$ 
bob@dylan:~$ python image_upload.py image.png f21fb953-16f9-46ed-8d9c-84c6450ec80f 5f1e881cc7ba06511e683b23
{'id': '5f1e8896c7ba06511e683b25', 'userId': '5f1e7cda04a394508232559d', 'name': 'image.png', 'type': 'image', 'isPublic': True, 'parentId': '5f1e881cc7ba06511e683b23'}
bob@dylan:~$ ls /tmp/files_manager/
2a1f4fc3-687b-491a-a3d2-5808a02942c9   51997b88-5c42-42c2-901e-e7f4e71bdc47   6dc53397-8491-4b7c-8273-f748b1a031cb   6dc53397-8491-4b7c-8273-f748b1a031cb_100   6dc53397-8491-4b7c-8273-f748b1a031cb_250    6dc53397-8491-4b7c-8273-f748b1a031cb_500
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/data -so new_image.png ; file new_image.png
new_image.png: PNG image data, 471 x 512, 8-bit/color RGBA, non-interlaced
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/data?size=100 -so new_image.png ; file new_image.png
new_image.png: PNG image data, 100 x 109, 8-bit/color RGBA, non-interlaced
bob@dylan:~$ 
bob@dylan:~$ curl -XGET 0.0.0.0:5000/files/5f1e8896c7ba06511e683b25/data?size=250 -so new_image.png ; file new_image.png
new_image.png: PNG image data, 250 x 272, 8-bit/color RGBA, non-interlaced
bob@dylan:~$
```

---


## Authors
Ksyv - [GitHub Profile](https://github.com/ksyv)
