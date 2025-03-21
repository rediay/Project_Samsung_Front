import { Component } from '@angular/core';
import { AuthService } from '../../auth/authservices/auth.services';
import { ServicioPrincipalService } from '../Services/main.services';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {
  nombreUsuario: string;

  constructor(private serviciocliente: ServicioPrincipalService,private translate: TranslateService) {}


  ngOnInit(): void {
    this.serviciocliente.CurrentUser().subscribe((data: any)=> {     
      this.nombreUsuario=data.nombre+' '+data.apellido;      
    });
  }
}
