import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { InformacionComplementariaDto } from './../../Models/InformacionComplementariaDto';
import { DatosRevisorFiscalDto } from '../../Models/DatosRevisorFiscalDto';

@Component({
  selector: 'app-datos-revisorfiscal',
  templateUrl: './datos-revisorfiscal.component.html'
})
export class DatosRevisorFiscalComponent implements OnInit {
    @Input() IdEstadoFormulario: number;
    @Input() IdFormulario: number;
    @Input() ListaSino: any[];
    @Input() editable: boolean;
    @Input() tipoTercero: number;
  
    formulario: FormGroup;
    private originalValidators: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private revisorFiscalService: ServicioPrincipalService, private cdr: ChangeDetectorRef
  ) {}

    allowOnlyNumbers(event: KeyboardEvent): void {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
      const charCode = event.key.charCodeAt(0);
      
      if (
        !allowedKeys.includes(event.key) &&
        (charCode < 48 || charCode > 57) 
      ) {
        event.preventDefault();
      }
    
  }

  ngOnInit(): void {
    this.crearFormulario();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });
    if (this.IdFormulario) {
      this.cargarDatosRevisorFiscal(this.IdFormulario);
    }

    if (!this.editable) {
      this.formulario.disable();
    }

    this.formulario.get('tieneRevisorFiscal')?.valueChanges.subscribe((valor: boolean) => {
      if (!valor) {
        this.formulario.patchValue({
          justificarRespuesta: '',
          nombreCompletoApellidos: '',
          tipoID: '',
          numeroID: '',
          telefono: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
          ciudad: '',
          direccion: '',
          email: ''
        });
      } 
    });

    this.formulario.get('revisorFiscalAdscritoFirma')?.valueChanges.subscribe((valor: boolean) => {
      if (!valor) {
        //clear fiels
        this.formulario.patchValue({
          nombreFirma: ''
        });
      }
    });
  }

  
  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable();
    // this.deshabilitarFormulario(this.formulario);

    this.cdr.detectChanges();
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      id: [0],
      idFormulario: [this.IdFormulario],
      tieneRevisorFiscal: [false],
      justificarRespuesta: [''],
      revisorFiscalAdscritoFirma: [false],
      nombreFirma: [''],
      nombreCompletoApellidos: [''],
      tipoID: [''],
      numeroID: [''],
      telefono: [''],
      ciudad: [''],
      direccion: [''],
      email: ['']
    });
  }

  cargarDatosRevisorFiscal(idFormulario: number): void {
    this.revisorFiscalService.ConsultaDatosRevisorFiscal(idFormulario).subscribe({
      next: (data) => {
        if (data) {
          this.formulario.patchValue(data);
        }
      },
      error: (err) => console.error('Error al cargar DatosRevisorFiscal', err)
    });
  }

  guardarDatosRevisorFiscal(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const dto: DatosRevisorFiscalDto = this.formulario.value;
    this.revisorFiscalService.GuardaDatosRevisorFiscal(dto).subscribe({
      next: (res) => {
        console.log('Guardado con éxito', res);
      },
      error: (err) => {
        console.error('Error al guardar DatosRevisorFiscal', err);
      }
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
  
  obtenerDatosFormulario(isValidSave: boolean): any {
    if (isValidSave) {
      this.formulario.markAllAsTouched();
      return this.formulario.getRawValue();
    } else {
      return this.formulario.getRawValue();
    }
  }
}