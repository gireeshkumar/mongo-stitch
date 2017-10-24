"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var StitchDBService = (function () {
    // private initialDataPromise:any;
    function StitchDBService() {
        var thisobj = this;
        this.client = new stitch.StitchClient('stitchblog-fbtji');
        this.db = this.client.service('mongodb', 'mongodb-atlas').db('microblog');
        //   this.client.login( function(){ thisobj.loadBlogs(); });
        console.log(this.db);
        this.client.login().then(function () {
            // identify the kind of blogs this user interested/subscribed/allocated
            // TODO filter
            //thisobj.loadInitialData({})
            return 
            // identify the kind of blogs this user interested/subscribed/allocated
            // TODO filter
            //thisobj.loadInitialData({})
            console.log("Used logged in");
        });
        // alert(this.client.authedId());
        this.blogfilter = {};
        // this.blogfilter.owner_id = this.authUserId();
    }
    StitchDBService.prototype.authUserId = function () {
        return this.client.authedId();
    };
    StitchDBService.prototype.loadUserBlogs = function (filter) {
        var _this = this;
        console.log("LoadUserBlogs - filter");
        console.log(filter);
        var newfilter = filter;
        //   if(Object.keys(filter).length === 0){
        //       newfilter.owner_id = this.authUserId(); 
        //   }else{
        //       newfilter = {$or:[{owner_id: this.authUserId()}, filter]};
        //   }
        console.log("Get blogs");
        console.log(newfilter);
        return new Promise(function (resolve, reject) {
            _this.db.collection('blogs').find(newfilter).then(function (docs) {
                resolve(docs);
            });
        });
    };
    //   loadInitialData(filter){
    //       console.log("LoadInitialData");
    //       if(this.initialDataPromise === null || this.initialDataPromise === undefined){
    //           this.initialDataPromise = this.loadUserBlogs(filter);
    //       }
    //       return this.initialDataPromise;
    //  }
    StitchDBService.prototype.loadBlogs = function () {
        this.db.collection('blogs').find({}).then(function (docs) {
            docs.map(function (c) { return console.log(c); });
        });
        this.db.collection('tags').find({}).then(function (docs) {
            docs.map(function (c) { return console.log(c); });
        });
        this.db.collection('streams').find({}).then(function (docs) {
            docs.map(function (c) { return console.log(c); });
        });
    };
    StitchDBService.prototype.saveBlog = function (blogtext, streams, tags) {
        var _this = this;
        var thisobj = this;
        return new Promise(function (resolve, reject) {
            _this.db.collection("blogs").insert({
                owner_id: _this.client.authedId(),
                content: blogtext, type: 'blogs',
                created_at: new Date().getTime(),
                streams: streams,
                tags: tags
            }).then(function () { return resolve(); });
        });
    };
    StitchDBService.prototype.saveOrUpdateStreams = function (streamsArray) {
        var thisobj = this;
        var owner_id = this.client.authedId();
        streamsArray.forEach(function (value) {
            value = value.split("~")[1];
            thisobj.db.collection('streams').updateOne({ name: value }, {
                $setOnInsert: { owner_id: owner_id, name: value, type: 'streams', created_at: new Date().getTime() },
                $inc: { score: 1 },
                $set: { modified_at: new Date().getTime() }
            }, { upsert: true }).then(console.log("insert/update"));
        });
    };
    StitchDBService.prototype.saveOrUpdateTags = function (tagsArray) {
        var thisobj = this;
        var owner_id = this.client.authedId();
        tagsArray.forEach(function (value) {
            value = value.split("#")[1];
            thisobj.db.collection('tags').updateOne({ name: value }, {
                $setOnInsert: { owner_id: owner_id, name: value, type: 'tags', created_at: new Date().getTime() },
                $inc: { score: 1 },
                $set: { modified_at: new Date().getTime() }
            }, { upsert: true }).then(console.log("insert/update"));
        });
    };
    //{ item: 1, status: 1 }
    StitchDBService.prototype.getTags = function () {
        return this.getCollection('tags');
    };
    StitchDBService.prototype.getStreams = function () {
        return this.getCollection('streams');
    };
    StitchDBService.prototype.getCollection = function (name) {
        var _this = this;
        console.log("Load Collection:" + name);
        return new Promise(function (resolve, reject) {
            //   resolve(  this.db.collection(name).find({},{projection:{name:1,_id:0}}).map( function(u) {return u.name} )   );
            _this.db.collection(name).find({}, { projection: { name: 1, _id: 0 } }).then(function (docs) {
                resolve(docs.map(function (u) { return u.name; }));
            });
            // this.db.collection(name).find({},{projection:{name:1,_id:0}}).then(docs => {
            //     console.log(name+" loaded");
            //     console.log(docs);
            //      resolve(docs);
            //   });
        });
    };
    StitchDBService.prototype.deleteAll = function () {
        var thisobj = this;
        this.client.login(function () {
            thisobj.db.collection('tags').deleteMany({ checked: true }).then(console.log('delete tags'));
            thisobj.db.collection('streams').deleteMany({ checked: true }).then(console.log('delete streams'));
            thisobj.db.collection('blogs').deleteMany({ checked: true }).then(console.log('delete blogs'));
        });
    };
    // stitchClient.register('<user-email>', '<user-password>');
    StitchDBService.prototype.register = function (email, password) {
        return this.client.register(email, password);
    };
    StitchDBService.prototype.emailConfirm = function (provider, tokenid, token) {
        // stitchClient.auth.provider('userpass').emailConfirm('<tokenid>', '<token>');
        this.client.auth.provider(provider).emailConfirm(tokenid, token).then(function (rslt) {
            console.log("Email Confirm - Success");
            console.log(rslt);
        }, function (err) {
            console.log("Error in user confirm");
            console.log(err);
        });
    };
    StitchDBService.prototype.login = function (email, password) {
        return this.client.login(email, password);
    };
    StitchDBService = __decorate([
        core_1.Injectable()
    ], StitchDBService);
    return StitchDBService;
}());
exports.StitchDBService = StitchDBService;
