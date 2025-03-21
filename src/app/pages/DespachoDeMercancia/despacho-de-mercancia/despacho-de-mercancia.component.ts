import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-despacho-de-mercancia',
  templateUrl: './despacho-de-mercancia.component.html',
  styleUrl: './despacho-de-mercancia.component.scss'
})
export class DespachoDeMercanciaComponent {
  formulario: FormGroup;
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
@Input() ListaPaises: any[] ;
@Input() editable:boolean;

private originalValidators: { [key: string]: any } = {};

constructor(private fb: FormBuilder, private translate: TranslateService,private serviciocliente : ServicioPrincipalService)
{}



ngOnInit(): void {

  this.initializeForm();  

  Object.keys(this.formulario.controls).forEach(key => {
    const control = this.formulario.get(key);
    this.originalValidators[key] = control?.validator;
  });
  
  if(this.IdFormulario !== 0 && this.IdFormulario !== undefined)
    {
  this.ConsultaDespacho();
    }
}


ConsultaDespacho (){
  this.serviciocliente.ConsultaDespachoMercancia(this.IdFormulario).subscribe(data => {
   
if (data)
{
this.inicilizarinfogurdada(data)
}

if (!this.editable) {

  this.formulario.disable();

  //this.deshabilitarFormulario(this.DatosContactos);
}

});
}

inicilizarinfogurdada(obj:any)
{
  this.formulario.patchValue({
    Id:obj.id,
    IdFormulario:obj.idFormulario,
    DireccionDespacho:obj.direccionDespacho,
    Pais:obj.pais,
    Cuidad:obj.cuidad,
    CodigoPostalEnvio:obj.codigoPostalEnvio,
    Telefono:obj.telefono,
    EmailCorporativo:obj.emailCorporativo
  });  

}




private initializeForm(): void {
  this.formulario = this.fb.group({   
    Id:[0], 
    IdFormulario:[this.IdFormulario],
    DireccionDespacho: ['', [Validators.required]],
    Pais: ['-1', [Validators.required,noSeleccionadoValidator()]],
    Cuidad: ['', [Validators.required]],
    CodigoPostalEnvio: ['', [Validators.required]],
    Telefono: ['', [Validators.required]],   
    EmailCorporativo: ['', [Validators.required, Validators.email]]
  });
}

removeValidators(): void {
  if (!this.formulario) {
    console.warn('Formulario no definido en RepresentanteLegalComponent');
    return;
  }
  Object.keys(this.formulario.controls).forEach(key => {
    const control = this.formulario.get(key);
    if (control) {
      control.clearValidators();
      control.clearAsyncValidators();
      control.updateValueAndValidity({ emitEvent: false });
    }
  });
}

restoreValidators(): void {
  Object.keys(this.formulario.controls).forEach(key => {
    const control = this.formulario.get(key);
    if (control) {
      control.setValidators(this.originalValidators[key]);
      control.updateValueAndValidity({ emitEvent: false });
    }
  });
}

obtenerDatosFormulario(isValid: boolean): any {
  if (isValid) {
    return this.formulario.getRawValue();
  } else {
    return this.formulario.value;
  }       
}

esFormularioValido()
{
  return this.formulario.valid;
}

marcarFormularioComoTocado()
{
  Object.values(this.formulario.controls).forEach(control => {
    control.markAsTouched();
  });
}

ObtenerDivFormulario()
{
  const DATA: any = document.getElementById('DespachoMercanciaDiv');

  return DATA;
}

Desabilitacamposdespuesdeenvio()
{
  this.editable=false;
  this.formulario.disable()
}

}
