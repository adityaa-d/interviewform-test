import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InterviewformRegComponent } from './interviewform-reg/interviewform-reg.component';

const routes: Routes = [{ path: '', component: InterviewformRegComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
