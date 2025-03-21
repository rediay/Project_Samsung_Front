import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-datos-de-pago',
  templateUrl: './datos-de-pago.component.html',
  styleUrl: './datos-de-pago.component.scss'
})
export class DatosDePagoComponent {
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaPaises: any[] ;
  @Input() ListaTipoCuentaBancaria: any[] ;
  @Input() editable:boolean;
 
  formulario: FormGroup;

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
  this.ConsultaDatosDePago();
    }
}


ConsultaDatosDePago (){
  this.serviciocliente.ConsultaDatosdepago(this.IdFormulario).subscribe(data => {
   
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
    NombreBanco:obj.nombreBanco,
    NumeroCuenta:obj.numeroCuenta,
    TipoCuenta:obj.tipoCuenta,
    CodigoSwift:obj.codigoSwift,
    Ciudad:obj.ciudad,
    Pais:obj.pais,
    CorreoElectronico:obj.correoElectronico,
    Sucursal:obj.sucursal,
    DireccionSucursal:obj.direccionSucursal,

  });  

}



private initializeForm(): void {
  this.formulario = this.fb.group({  
    Id:[0], 
    IdFormulario:[this.IdFormulario],
    NombreBanco: ['', [Validators.required]],
    NumeroCuenta: ['', [Validators.required]],
    TipoCuenta: ['-1', [Validators.required, noSeleccionadoValidator()]],
    CodigoSwift: ['', [Validators.required]],
    Ciudad: ['', [Validators.required]],
    Pais: ['-1', [Validators.required,noSeleccionadoValidator()]],
    CorreoElectronico: ['', [Validators.required]],
    Sucursal: ['', [Validators.required]],
    DireccionSucursal: ['', [Validators.required]],
   
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
    this.formulario.markAllAsTouched();
    return this.formulario.value;
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
  const DATA: any = document.getElementById('DatosPagoDiv');

  return DATA;
}

obtenerCamposInvalidos() {
  const camposInvalidos: { control: string; errores: any }[] = [];
  
  Object.keys(this.formulario.controls).forEach(controlName => {
    const control = this.formulario.get(controlName);
    if (control && control.invalid) {
      camposInvalidos.push({
        control: controlName,
        errores: control.errors
      });
    }
  });

  //console.log('Campos inválidos en DatosDePago:', camposInvalidos);

  return camposInvalidos;
}


Desabilitacamposdespuesdeenvio()
{
  this.editable=false;
  this.formulario.disable()
}


}
