import {Component, AfterViewInit } from '@angular/core';

import { BlogService } from '../../services/blog.service';

declare var $;

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.html'
})
export class Dashboard implements AfterViewInit {

  private bloginput:string = 'this is a stream @Tom  and I want to talk about #tag2   and another stream @Anne  and topic #tag3  are good';
  private blogs:any;
  
  constructor(private blogService:BlogService) {
  }
  
  ngAfterViewInit() {
    
    const thisobj = this;
    
    $('#textarea01').atwho({
        at: "@",
        data:['Peter', 'Tom', 'Anne']
    })
    
        $('#textarea01').atwho({
        at: "#",
        data:['tag1', 'tag2', 'tag3']
    })
    
  }
  
  onSubmitPost(){
    // blogService
    console.log(this.bloginput);
    this.blogService.saveBlog(this.bloginput);
  }
  
  deleteAll(){
    this.blogService.deleteAll();
  }

}
