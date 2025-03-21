import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';

@Component({
  selector: 'app-datos-contacto',
  templateUrl: './datos-contacto.component.html',
  styleUrl: './datos-contacto.component.scss'
})
export class DatosContactoComponent implements OnInit {
  Lang: string = 'es';
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() editable: boolean;

  DatosContactos: FormGroup;
  private originalValidators: { [key: string]: any } = {};


  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService, private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.DatosContactos = this.fb.group({
      contactos: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {

    Object.keys(this.DatosContactos.controls).forEach(key => {
      const control = this.DatosContactos.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.serviciocliente.ConsultaDatosContactos(this.IdFormulario).subscribe((contactos: any[]) => {
        this.cargarContactos(contactos);
      });
    }
  }

  // Obtener el FormArray de Representantes
  get contacto() {
    return this.DatosContactos.get('contactos') as FormArray;
  }

  // Agregar un nuevo representante
  addcontacto() {
    this.contacto.push(this.crearContacto());
  }

  // Quitar representante
  removeDirectivo(index: number) {
    this.contacto.removeAt(index);
  }

  // Crear el grupo de un representante, incluyendo el array de cargos públicos
  /*crearContacto(): FormGroup {
    return this.fb.group({
      NombreContacto: ['', Validators.required],
      CargoContacto: ['', Validators.required],
      AreaContacto: ['', Validators.required],
      TelefonoContacto:['', Validators.required],
      CorreoElectronico: ['', Validators.required]   
      
    });
  }*/


  crearContacto(data?: any): FormGroup {
    return this.fb.group({
      Id: [data?.id || 0, Validators.required],
      NombreContacto: [data?.nombreContacto || '', Validators.required],
      CargoContacto: [data?.cargoContacto || '', Validators.required],
      // FechaNombramiento: [data?.fechaNombramiento || '', Validators.required],
      // FechaFinalizacion: [data?.fechaFinalizacion || '', Validators.required],
      AreaContacto: [data?.areaContacto || '', Validators.required],
      TelefonoContacto: [data?.telefonoContacto || '', Validators.required],
      CorreoElectronico: [data?.correoElectronico || '', Validators.required],
      Ciudad: [data?.ciudad || '', Validators.required],
      Direccion: [data?.direccion || '', Validators.required],
      IdFormulario: [this.IdFormulario]
    });
  }

  /*marcarFormularioComoTocado()
  {
    Object.values(this.DatosContactos.controls).forEach(control => {
      control.markAsTouched();
    });
  }
  */
  marcarFormularioComoTocado() {
    Object.values(this.DatosContactos.controls).forEach(control => {
      if (control instanceof FormArray) {
        control.controls.forEach((grupo) => {
          const formGroup = grupo as FormGroup; // Conversión explícita a FormGroup
          Object.values(formGroup.controls).forEach(campo => {
            campo.markAsTouched();
          });
        });
      } else {
        control.markAsTouched();
      }
    });
  }

  
  removeValidators(): void {
    if (!this.DatosContactos) {
      console.warn('Formulario no definido en RepresentanteLegalComponent');
      return;
    }
    Object.keys(this.DatosContactos.controls).forEach(key => {
      const control = this.DatosContactos.get(key);
      if (control) {
        control.clearValidators();
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  restoreValidators(): void {
    Object.keys(this.DatosContactos.controls).forEach(key => {
      const control = this.DatosContactos.get(key);
      if (control) {
        control.setValidators(this.originalValidators[key]);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  obtenerDatosFormulario(isValid: boolean) {
    if (isValid) {
      this.DatosContactos.markAllAsTouched();
      return this.DatosContactos.value; 
    } else {
      return this.DatosContactos.value;
    }
  }

  esFormularioValido() {
    return this.DatosContactos.valid;
  }

  /*obtenerCamposInvalidos() {
    const camposInvalidos = [];
    const controles = this.DatosContactos.controls;
    for (const nombreControl in controles) {
      if (controles[nombreControl].invalid) {
        camposInvalidos.push({
          campo: nombreControl,
          errores: controles[nombreControl].errors
        });
      }
    }
    return camposInvalidos;
  }
  */
  obtenerCamposInvalidos() {
    const camposInvalidos: { index: number; campo: string; errores: any }[] = [];

    this.contacto.controls.forEach((grupo, index) => {
      const formGroup = grupo as FormGroup; // Conversión explícita a FormGroup

      Object.keys(formGroup.controls).forEach(campo => {
        const control = formGroup.get(campo);
        if (control && control.invalid) {
          camposInvalidos.push({
            index,
            campo,
            errores: control.errors
          });
        }
      });
    });

    return camposInvalidos;
  }

  cargarContactos(contactos: any[]) {
    this.contacto.clear();
    if (contactos) {// Limpia el FormArray antes de cargar los datos
      contactos.forEach(contactoData => {
        this.contacto.push(this.crearContacto(contactoData));
      });




      if (!this.editable) {
        this.DatosContactos.disable();
      }


    }
  }

  submit() {

  }


  deshabilitarFormulario(form: FormGroup): void {
    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);
      if (control instanceof FormGroup) {
        this.deshabilitarFormulario(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl: AbstractControl) => {
          if (arrayControl instanceof FormGroup) {
            this.deshabilitarFormulario(arrayControl);
          } else {
            arrayControl.disable();
          }
        });
      } else {
        control?.disable();
      }
    });
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('DatosContactoDiv');

    return DATA;
  }

  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.DatosContactos.disable()
    this.IdEstadoFormulario = 3;
    this.cdr.detectChanges(); //
  }

}