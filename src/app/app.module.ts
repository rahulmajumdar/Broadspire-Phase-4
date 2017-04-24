import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

import { TruncatePipe } from './shared/truncate';

import { AppComponent } from './app.component';
import { TodoComponent } from './todo/todo.component';
import { SidebarComponent } from './shared/sidebar/sidebar';
import { TopNavComponent } from './shared/topnav/topnav';
import { FooterComponent } from './shared/topnav/footer';
import { LoginComponent } from './login/login.component';
import { FirstTimeLoginComponent } from './login/firstTimePassword.component';
// ------------------------------------dashboard components starts------------------------

import { DashboardComponent } from './dashboard/dashboard.component';
import { ClaimComponent } from './dashboard/claim-payment-info/claim.component';
import { ClaimInfoComponent } from './dashboard/claim-payment-info/claim-info.component';
import { ClaimPaymentDetailsComponent } from './dashboard/claim-payment-info/claim-paymentdetails.component';

import { HealthTicketComponent } from './dashboard/health_ticket/healthTicket.component';
import { ContactAdjusterComponent } from './dashboard/contact-adjuster/contact-adjuster.component';
import { ClaimInfoMessageComponent } from './dashboard/contact-adjuster/claimInfoMessage.component';
import { EmailSupervisorComponent } from './dashboard/contact-adjuster/emailSupervisor.component';

import { FaqComponent } from './dashboard/faq/faq.component';
import { SettingMenuComponent } from './dashboard/settings/settingMenu.component';
import { ChangeSecInfoComponent } from './dashboard/settings/settingMenu.component';
import { ChangePasswordComponent } from './dashboard/settings/settingMenu.component';
import { ChangeUserIDComponent } from './dashboard/settings/settingMenu.component';
import { AboutTheAppComponent } from './dashboard/settings/settingMenu.component';


import { SocialMediaComponent } from './dashboard/social-media/socialMedia.component';
import { AppTutorialComponent } from './dashboard/app-tutorial/appTutorial.component';
import { NearbyPhysiciansMap } from './dashboard/providers/nearbyphysicians_map.component';
import { ProvidersComponent }       from './dashboard/providers/providers.component';

// ------------------------------------dashboard components ends------------------------

// -------------------------------------forgot password component starts ---------------------------
import { ForgotPasswordComponent } from './forgot-password/forgotPassword.component';
import { ValidateRegistrComponent } from './forgot-password/forgotPassword.component';
import { ResetForgotPasswordComponent } from './forgot-password/forgotPassword.component';
import { ForgotHelpComponent } from './forgot-password/forgotPassword.component';
import { ResetPasswordComponent } from './forgot-password/forgotPassword.component';
// -------------------------------------forgot password component ends ---------------------------



// -------------------------------------new user component starts ---------------------------
import { NewUserComponent } from './new-user/newUser.component';
import { CreateNewUserComponent } from './new-user/newUser.component';
import { HelpComponent } from './new-user/newUser.component';
// -------------------------------------new user component ends ---------------------------




// -------------------------------------registration tutorial component starts ---------------------------
import { RegistrationTutorialComponent } from './registration-tutorial/registrationTutorial.component'
// -------------------------------------registration tutorial component ends ---------------------------



const routes: Routes = [
  //  { path: '**', redirectTo: '/all' }
  { path: '', component: LoginComponent },
  { path: 'firstTimeLogin', component: FirstTimeLoginComponent },
  { path: '', component: LoginComponent },
  { path: 'status', component: TodoComponent },


  /* ---------------------------dashboard and its children routing starts--------------------------------------- */

  {
    path: 'dashboard',
    component: DashboardComponent,

    children: [
      { path: 'claimpage', component: ClaimComponent, data: { title: 'Claims' } },
      { path: 'claim-info', component: ClaimInfoComponent, data: { title: 'Claims', parent: 'claimpage' } },
      { path: 'claim-paymentdetailspage', component: ClaimPaymentDetailsComponent, data: { title: 'Claims', parent: 'claimpage' } },

      { path: 'healthTicket', component: HealthTicketComponent, data: { title: 'Health Ticket'} },
      { path: 'contactAdjuster', component: ContactAdjusterComponent, data: { title: 'Contact'} },
      { path: 'claimInfoMessage', component: ClaimInfoMessageComponent, data: { title: 'Message', parent: 'contactAdjuster' } },
      { path: 'emailSupervisor', component: EmailSupervisorComponent, data: { title: 'Supervisor Email', parent: 'contactAdjuster' } },

      { path: 'faqs', component: FaqComponent, data: { title: 'FAQ' } },
      { path: 'settingMenu', component: SettingMenuComponent, data: { title: 'Settings'} },
       { path:'changeSecurityInfo',component: ChangeSecInfoComponent, data: { title: 'Security Info', parent: 'settingMenu'} },
       { path:'changeSettingPass',component: ChangePasswordComponent, data: { title: 'Password', parent: 'settingMenu'}},
       { path:'changeSettingUserId',component: ChangeUserIDComponent, data: { title: 'Change Email Address', parent: 'settingMenu'}},
       { path:'aboutTheApp',component: AboutTheAppComponent, data: { title: 'Info', parent: 'settingMenu'}},

      { path: 'socialMedia', component: SocialMediaComponent, data: { title: 'Social'} },
      { path:'appTutorial',component: AppTutorialComponent, data: { title: 'Tutorial'}},
      { path: 'providers', component: ProvidersComponent, data: { title: 'Providers' } },
      { path: 'physiciansmap', component: NearbyPhysiciansMap, data: { title: 'Providers', parent: 'providers' } }

    ]
  },

  /* ---------------------------dashboard and its children routing ends--------------------------------------- */


  /* ---------------------------forgotpassword routing starts--------------------------------------- */


  { path: 'forgotPass', component: ForgotPasswordComponent, data: { title: 'Validate Security Answer' } },
  { path: 'resetForgotPassword', component: ResetForgotPasswordComponent, data: { title: 'Reset Password', parent: 'forgotPass' } },
  { path: 'validateRegister', component: ValidateRegistrComponent, data: { title: 'Validate Registration', parent: 'forgotPass' } },
  { path: 'forgotHelp', component: ForgotHelpComponent, data: { title: 'Help', parent: 'validateRegister' } },

  /* ---------------------------forgot password routing ends--------------------------------------- */



  /* ---------------------------new user routing starts--------------------------------------- */


  { path: 'newUser', component: NewUserComponent, data: { title: 'EULA'} },
  { path: 'createNewUser', component: CreateNewUserComponent, data: { title: 'Registration', parent: '' } },
  { path: 'help', component: HelpComponent, data: { title: 'Help', parent: 'createNewUser' } },


  /* ---------------------------new user routing ends--------------------------------------- */

  /* ---------------------------First time routing starts -----------------------------------*/

  /*---------------------------First time routing starts -----------------------------------*/

  /* ---------------------------new user routing starts--------------------------------------- */
  { path: 'registrationTutorial', component: RegistrationTutorialComponent, data: { title: 'Registration Tutorial', parent: '' } }

  /* ---------------------------new user routing ends--------------------------------------- */



];

@NgModule({
  declarations: [
TruncatePipe,
    AppComponent,DashboardComponent,ClaimInfoComponent,TodoComponent,LoginComponent,
    SidebarComponent,TopNavComponent,HealthTicketComponent,ContactAdjusterComponent,
    FaqComponent,SettingMenuComponent,ChangeSecInfoComponent, ChangePasswordComponent,
    ForgotPasswordComponent, ValidateRegistrComponent,ForgotHelpComponent,ResetPasswordComponent,
    NewUserComponent, CreateNewUserComponent, HelpComponent, SocialMediaComponent, ProvidersComponent,
    NearbyPhysiciansMap, FirstTimeLoginComponent,ResetForgotPasswordComponent, FirstTimeLoginComponent,
    EmailSupervisorComponent,
    AppComponent, DashboardComponent, ClaimComponent, ClaimPaymentDetailsComponent,
    ClaimInfoComponent, TodoComponent, LoginComponent, SidebarComponent, TopNavComponent,
    HealthTicketComponent, ContactAdjusterComponent, ClaimInfoMessageComponent, FaqComponent,
    SettingMenuComponent,ChangeSecInfoComponent, ChangePasswordComponent,
    ValidateRegistrComponent, ForgotHelpComponent, ResetPasswordComponent, NewUserComponent,
    CreateNewUserComponent, HelpComponent, SocialMediaComponent,AppTutorialComponent,
    ProvidersComponent,NearbyPhysiciansMap, ChangeUserIDComponent, AboutTheAppComponent,
    RegistrationTutorialComponent, FooterComponent

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{provide: LocationStrategy,
		useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
