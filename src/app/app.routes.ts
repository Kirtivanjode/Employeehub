import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { LeaveManagementComponent } from './components/leave-management/leave-management.component';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  {
    path: 'employees',
    component: EmployeeListComponent,
  },
  {
    path: 'employee/new',
    component: EmployeeFormComponent,
  },
  {
    path: 'employee/edit/:id',
    component: EmployeeFormComponent,
  },
  {
    path: 'employee/:id',
    component: EmployeeDetailComponent,
  },
  {
    path: 'leave',
    component: LeaveManagementComponent,
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
  },
  { path: 'chat', component: ChatComponent },
  { path: '**', redirectTo: '' },
];
