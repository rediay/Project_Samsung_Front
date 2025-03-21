import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';

@Component({
  selector: 'app-declaraciones',
  templateUrl: './declaraciones.component.html',
  styleUrl: './declaraciones.component.scss'
})
export class DeclaracionesComponent implements OnInit {
  formulario: FormGroup;
  private originalValidators: { [key: string]: any } = {};

  @Input() IdFormulario: number;
  @Input() editable:boolean;
  @Input() IdEstadoFormulario: number;

  constructor(private fb: FormBuilder, private translate: TranslateService,private serviciocliente : ServicioPrincipalService,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeForm();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if(this.IdFormulario !== 0 && this.IdFormulario !== undefined)
      {
        this.ConsultaDeclaraciones();
      }
  }

  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id:[0], 
      IdFormulario:[this.IdFormulario], 
      NombreRepresentanteFirma: ['', [Validators.required]],
      CorreoRepresentante: ['', [Validators.required]]
    });
  }

  // Método para manejar el envío del formulario (si es necesario)
  onSubmit(): void {
    if (this.formulario.valid) {
      // Procesar la información del formulario
      console.log('Formulario válido:', this.formulario.value);
    } else {
      // Marcar todos los controles como tocados para mostrar los mensajes de error
      this.formulario.markAllAsTouched();
    }
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

inicilizarinfogurdada(obj:any)
{
  this.formulario.patchValue({
    Id:obj.id,
    IdFormulario:obj.idFormulario,
    NombreRepresentanteFirma:obj.nombreRepresentanteFirma,
    CorreoRepresentante:obj.correoRepresentante,
  });  
}

ConsultaDeclaraciones (){
  this.serviciocliente.ConsultaDeclaraciones(this.IdFormulario).subscribe(data => {
   
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

ObtenerDivFormulario()
{
  const DATA: any = document.getElementById('declaraciones');

  return DATA;
}

Desabilitacamposdespuesdeenvio()
{
  this.editable=false;
  this.formulario.disable()

  this.cdr.detectChanges();
}

}
