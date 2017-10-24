"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var Subject_1 = require('rxjs/Subject');
var BlogService = (function () {
    function BlogService(stitchDB) {
        this.stitchDB = stitchDB;
        this.blogAddedSource = new Subject_1.Subject();
        // Observable string streams
        this.blogAdded$ = this.blogAddedSource.asObservable();
    }
    BlogService.prototype.setState = function (state, value) {
        this.state = state;
        this.stateValue = value;
        if (this.state === "all") {
            this.blogFilter = {};
        }
        else if (this.state === "users") {
            this.blogFilter = { owner_id: this.stateValue };
        }
        else {
            this.blogFilter = {};
            this.blogFilter[this.state] = this.stateValue; // { $regex : new RegExp(this.stateValue, "i") };
        }
    };
    BlogService.prototype.authUserId = function () {
        return this.stitchDB.authUserId();
    };
    BlogService.prototype.loadUserProfile = function (userid) {
        return loadUserProfile;
    };
    BlogService.prototype.saveBlog = function (blogtext) {
        // need to detect the "streams" (start with @) and tags (starts with #)
        // before saving 
        var tags = blogtext.match(/[#]+[A-Za-z0-9-_]+/g);
        console.log("TAGS");
        console.log(tags);
        var streams = blogtext.match(/[~]+[A-Za-z0-9-_]+/g);
        console.log("STREAMS");
        console.log(streams);
        if (streams != null && streams !== undefined && streams.length > 0) {
            this.stitchDB.saveOrUpdateStreams(streams);
        }
        if (tags != null && tags !== undefined && tags.length > 0) {
            this.stitchDB.saveOrUpdateTags(tags);
        }
        var thisobj = this;
        return new Promise(function (resolve, reject) {
            thisobj.stitchDB.saveBlog(blogtext, streams, tags).then(function () {
                thisobj.blogsStateUpdated();
                resolve();
            });
        });
    };
    BlogService.prototype.blogsStateUpdated = function () {
        this.blogAddedSource.next('event::blogupdated');
    };
    BlogService.prototype.deleteAll = function () {
        this.stitchDB.deleteAll();
    };
    BlogService.prototype.loadUserBlogs = function () {
        return this.stitchDB.loadUserBlogs(this.blogFilter);
    };
    BlogService.prototype.getTags = function () {
        return this.stitchDB.getTags();
    };
    BlogService.prototype.getStreams = function () {
        return this.stitchDB.getStreams();
    };
    BlogService = __decorate([
        core_1.Injectable()
    ], BlogService);
    return BlogService;
}());
exports.BlogService = BlogService;
