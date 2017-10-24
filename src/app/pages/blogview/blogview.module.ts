import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';

import { BlogView } from './blogview.component';
import { routing }       from './blogview.routing';

import { BlogFeed } from './blogfeed';
import { MetaView } from './metaview';
import { BlogFeedService } from './blogfeed/blogfeed.service';
import { MetaviewService } from './metaview/metaview.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    routing
  ],
  declarations: [
    BlogFeed,
    BlogView,
    MetaView
  ],
  providers: [
    BlogFeedService,MetaviewService
  ]
})
export class BlogViewdModule {}
