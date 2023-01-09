import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SearchComponent } from "./search.component";

const routes: Routes =[
    { path: '', component: SearchComponent }
];

@NgModule({
    declarations: [
        SearchComponent
    ],
    imports: [
        RouterModule.forChild(routes)
    ]
})
export class SearchModule {}
