import { NgModule } from '@angular/core';
import { EnumKeysPipe } from './EnumKeys.pipe';
import { ArraySortByIdPipe } from './ArraySortById.pipe';

@NgModule({
    declarations: [EnumKeysPipe, ArraySortByIdPipe],
    exports: [EnumKeysPipe, ArraySortByIdPipe]
})
export class SharedModule { }






