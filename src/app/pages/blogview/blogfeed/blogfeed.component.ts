import {Component} from '@angular/core';

import { BlogService } from '../../../services/blog.service';
import {BlogFeedService} from './blogfeed.service';

@Component({
  selector: 'blogfeed',
  templateUrl: './blogfeed.html',
  styleUrls: ['./blogfeed.scss']
})
export class BlogFeed {

  public feed:any;

  constructor(private _feedService:BlogFeedService,  private _blogservice:BlogService) {
    // right now using for event, may be I should use a global service for event communication
    const thisobj = this;
    _blogservice.blogAdded$.subscribe(
      msg => {
        console.log("Feed<component> - "+msg);
        thisobj._loadFeed(false);
      }
    );
  }

  ngOnInit() {
    this._loadFeed(true);
  }

  expandMessage (message){
    message.expanded = !message.expanded;
  }

  private _loadFeed(init) {
    // this.feed = this._feedService.getData();
    this._feedService.getData(init).then(
      rslt=>{this.feed = rslt }, 
      err=>{}
    )
  }
}
