import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { InformacionComplementariaDto } from './../../Models/InformacionComplementariaDto';
import { InformacionFinancieraDto } from '../../Models/InformacionFinancieraDto';

@Component({
  selector: 'app-informacion-financiera',
  templateUrl: './informacion-financiera.component.html'
})
export class InformacionFinancieraComponent implements OnInit {
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  @Input() tipoTercero: number;

  formulario: FormGroup;
  private originalValidators: { [key: string]: any } = {};
  constructor(
    private fb: FormBuilder,
    private infoFinancieraService: ServicioPrincipalService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.crearFormulario();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario) {
      this.cargarInformacionFinanciera(this.IdFormulario);
    }
    if (!this.editable) {
      this.formulario.disable();
    }
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
      patrimonio: [0, [Validators.required]],
      activos: [0, [Validators.required]],
      ingresosMensuales: [0, [Validators.required]],
      egresosMensuales: [0, [Validators.required]],
      ActivosVirtuales: [false],
      GrandesCantidadesEfectivo: [false],
    });
  }

  cargarInformacionFinanciera(idFormulario: number): void {
    this.infoFinancieraService.ConsultaInformacionFinanciera(idFormulario)
      .subscribe({
        next: (data) => {

          if (data) {
            this.formulario.patchValue({
              id: data.id,
              idFormulario: data.idFormulario,
              patrimonio: data.patrimonio,
              activos: data.activos,
              ingresosMensuales: data.ingresosMensuales,
              egresosMensuales: data.egresosMensuales,
              ActivosVirtuales: !!data.activosVirtuales, 
              GrandesCantidadesEfectivo: !!data.grandesCantidadesEfectivo 
            });
  
          }
        },
        error: (err) => console.error('Error al cargar InformacionFinanciera', err)
      });
  }

  guardarInformacionFinanciera(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const dto: InformacionFinancieraDto = this.formulario.value;
    this.infoFinancieraService.GuardaInformacionFinanciera(dto)
      .subscribe({
        next: (res) => {
          console.log('Guardado con éxito', res);
        },
        error: (err) => {
          console.error('Error al guardar', err);
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

  obtenerDatosFormulario(isValid: boolean): any {
    if (isValid) {
      this.formulario.markAllAsTouched();
      return this.formulario.value;
    } else {
      return this.formulario.value;
    }
  }
}