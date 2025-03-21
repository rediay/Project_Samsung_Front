import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Parentesco, Inversiones, Pep, Directivo, Socio, Relaciones, Confidencialidad } from '../../Models/conflictoInteresesModelsDto';
import { ServicioPrincipalService } from '../../Services/main.services';

@Component({
  selector: 'app-conflicto-interes',
  templateUrl: './conflicto-interes.component.html',
  styleUrls: ['./conflicto-interes.component.scss']
})
export class ConflictoInteresComponent implements OnInit {
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() ListaSino: any[];
  @Input() editable: boolean;
  @Input() tipoTercero: number;

  formulario: FormGroup;

  private originalValidators: { [key: string]: any } = {};

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private servicioPrincipal: ServicioPrincipalService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.crearFormulario();
    this.setupDynamicValidation();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario) {
      this.cargarDatosConflicto(this.IdFormulario);
    }

    if (!this.editable) {
      this.formulario.disable();
    }
  }

  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable()

    this.IdEstadoFormulario = 3;

    this.cdr.detectChanges();
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      Id: [0],
      fechaDeclaracion: [null, Validators.required],
      ciudadDeclaracion: [null, Validators.required],
      nombresApellidos: [null, Validators.required],
      cedula: [null, Validators.required],
      tipoVinculacionSamsung: [null, Validators.required],
      conoceProcedimientoConflicto: [false, Validators.required],
      razonNoConocerProcedimientoConflicto: [''],
      entidadesDuenoSocio: this.fb.array([]),
      entidadesDirectivoEmpleado: this.fb.array([]),
      entidadesConfidencialidad: this.fb.array([]),
      entidadesRelacionSamsung: this.fb.array([]),
      pepInfo: this.fb.array([]),
      otrasSituacionesConflicto: [null],
      decisionesInteresPersonal: [false, Validators.required],
      razonDecisionesInteresPersonal: [null, Validators.required],
      actividadesCompetidor: [false, Validators.required],
      razonActividadesCompetidor: [null, Validators.required],
      relacionesEstado: [false, Validators.required],
      razonRelacionesEstado: [null, Validators.required],
      regalosHospitalidad: [false, Validators.required],
      razonRegalosHospitalidad: [null, Validators.required],
      incumplimientoExclusividad: [false, Validators.required],
      razonIncumplimientoExclusividad: [null, Validators.required],
      relacionesProveedores: [false, Validators.required],
      razonRelacionesProveedores: [null, Validators.required],
      parentescosTercerGrado: this.fb.array([]),
      inversionesSamsung: [false, Validators.required],
      detalleInversionesSamsung: this.fb.array([]),
      otrasSituacionesAfectanIndependencia: [false, Validators.required],
      razonOtrasSituacionesAfectanIndependencia: [null, Validators.required],
      usoInformacionConfidencial: [false, Validators.required],
      influenciaIndebidaPoliticas: [false, Validators.required],
      influenciaIndebidaAdjudicaciones: [false, Validators.required],
      descuentoReventa: [false, Validators.required],
      comparteCredencialesAliados: [false, Validators.required],
      actividadesRegulatorias: [false, Validators.required],
      corredorIntermediario: [false, Validators.required],
      regalosFuncionarios: [false, Validators.required],
      apruebaTransaccionesConflicto: [false, Validators.required]

    });
  }

  // Get forms
  get entidadesDuenoSocioArr(): FormArray {
    return this.formulario.get('entidadesDuenoSocio') as FormArray;
  }
  get entidadesDirectivoEmpleadoArr(): FormArray {
    return this.formulario.get('entidadesDirectivoEmpleado') as FormArray;
  }
  get entidadesConfidencialidadArr(): FormArray {
    return this.formulario.get('entidadesConfidencialidad') as FormArray;
  }
  get entidadesRelacionSamsungArr(): FormArray {
    return this.formulario.get('entidadesRelacionSamsung') as FormArray;
  }
  get pepInfoArr(): FormArray {
    return this.formulario.get('pepInfo') as FormArray;
  }
  get parentescosArr(): FormArray {
    return this.formulario.get('parentescosTercerGrado') as FormArray;
  }
  get inversionesArr(): FormArray {
    return this.formulario.get('detalleInversionesSamsung') as FormArray;
  }

  private setupDynamicValidation() {
    this.formulario.get('conoceProcedimientoConflicto')?.valueChanges.subscribe(valor => {
      const control = this.formulario.get('razonNoConocerProcedimientoConflicto');

      if (valor === false) {
        control?.setValidators([Validators.required]); 
      } else {
        control?.clearValidators(); 
        control?.reset(); 
      }

      control?.updateValueAndValidity(); 
    });
  }

  // -- Add fields
  agregarEntidadDuenoSocio(): void {
    this.entidadesDuenoSocioArr.push(
      this.fb.group({
        entidad: [null, Validators.required],
        tipoParticipacion: [null, Validators.required],
        fechas: [null, Validators.required]
      })
    );
  }
  eliminarEntidadDuenoSocio(index: number): void {
    this.entidadesDuenoSocioArr.removeAt(index);
  }

  agregarEntidadDirectivoEmpleado(): void {
    this.entidadesDirectivoEmpleadoArr.push(
      this.fb.group({
        entidad: [null, Validators.required],
        tipoParticipacion: [null, Validators.required],
        fechas: [null, Validators.required]
      })
    );
  }
  eliminarEntidadDirectivoEmpleado(index: number): void {
    this.entidadesDirectivoEmpleadoArr.removeAt(index);
  }


  agregarEntidadConfidencialidad(): void {
    this.entidadesConfidencialidadArr.push(
      this.fb.group({
        entidad: [null, Validators.required],
        descripcion: [null, Validators.required],
        fechas: [null, Validators.required]
      })
    );
  }
  eliminarEntidadConfidencialidad(index: number): void {
    this.entidadesConfidencialidadArr.removeAt(index);
  }


  agregarEntidadRelacionSamsung(): void {
    this.entidadesRelacionSamsungArr.push(
      this.fb.group({
        entidad: [null, Validators.required],
        tipoRelacion: [null, Validators.required],
        fechas: [null, Validators.required]
      })
    );
  }
  eliminarEntidadRelacionSamsung(index: number): void {
    this.entidadesRelacionSamsungArr.removeAt(index);
  }


  agregarPepInfo(): void {
    this.pepInfoArr.push(
      this.fb.group({
        relacion: [null, Validators.required],
        nombreCargoEntidad: [null, Validators.required],
        fechasVinculacionEstado: [null, Validators.required]
      })
    );
  }
  eliminarPepInfo(index: number): void {
    this.pepInfoArr.removeAt(index);
  }


  agregarParentesco(): void {
    this.parentescosArr.push(
      this.fb.group({
        nombre: [null, Validators.required],
        tipoRelacion: [null, Validators.required]
      })
    );
  }
  eliminarParentesco(index: number): void {
    this.parentescosArr.removeAt(index);
  }


  agregarInversion(): void {
    this.inversionesArr.push(
      this.fb.group({
        tipoTitulo: [null, Validators.required],
        cantidadTitulos: [null, Validators.required],
        valorTitulos: [null, Validators.required]
      })
    );
  }
  eliminarInversion(index: number): void {
    this.inversionesArr.removeAt(index);
  }


  guardarConflicto(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const formValue = this.formulario.value;

    // convert a JSON
    formValue.entidadesDuenoSocio = JSON.stringify(formValue.entidadesDuenoSocio);
    formValue.entidadesDirectivoEmpleado = JSON.stringify(formValue.entidadesDirectivoEmpleado);
    formValue.entidadesConfidencialidad = JSON.stringify(formValue.entidadesConfidencialidad);
    formValue.entidadesRelacionSamsung = JSON.stringify(formValue.entidadesRelacionSamsung);
    formValue.pepInfo = JSON.stringify(formValue.pepInfo);
    formValue.parentescosTercerGrado = JSON.stringify(formValue.parentescosTercerGrado);
    formValue.detalleInversionesSamsung = JSON.stringify(formValue.detalleInversionesSamsung);



    this.servicioPrincipal.GuardarConflictoIntereses(formValue).subscribe({
      next: (resp) => {
        console.log('Guardado con éxito', resp);
      },
      error: (err) => {
        console.error('Error al guardar', err);
      }
    });
  }


  cargarDatosConflicto(idFormulario: number): void {
    this.servicioPrincipal.ConsultaConflictoIntereses(idFormulario).subscribe({
      next: (data) => {
        if (!data) return;

        const parseOrUse = (field: any): any[] => {
          if (!field) return [];
          if (typeof field === 'string') {
            try {
              return JSON.parse(field);
            } catch {
              return [];
            }
          }
          return field;
        };


        this.entidadesDuenoSocioArr.clear();
        this.entidadesDirectivoEmpleadoArr.clear();
        this.entidadesConfidencialidadArr.clear();
        this.entidadesRelacionSamsungArr.clear();
        this.pepInfoArr.clear();
        this.parentescosArr.clear();
        this.inversionesArr.clear();


        parseOrUse(data.entidadesDuenoSocio).forEach((item: Socio) => {
          this.entidadesDuenoSocioArr.push(
            this.fb.group({
              entidad: [item.entidad],
              tipoParticipacion: [item.tipoParticipacion],
              fechas: [item.fechas]
            })
          );
        });

        parseOrUse(data.entidadesDirectivoEmpleado).forEach((item: Directivo) => {
          this.entidadesDirectivoEmpleadoArr.push(
            this.fb.group({
              entidad: [item.entidad],
              tipoParticipacion: [item.tipoParticipacion],
              fechas: [item.fechas]
            })
          );
        });

        parseOrUse(data.entidadesConfidencialidad).forEach((item: Confidencialidad) => {
          this.entidadesConfidencialidadArr.push(
            this.fb.group({
              entidad: [item.entidad],
              descripcion: [item.descripcion],
              fechas: [item.fechas]
            })
          );
        });

        parseOrUse(data.entidadesRelacionSamsung).forEach((item: Relaciones) => {
          this.entidadesRelacionSamsungArr.push(
            this.fb.group({
              entidad: [item.entidad],
              tipoRelacion: [item.tipoRelacion],
              fechas: [item.fechas]
            })
          );
        });

        parseOrUse(data.pepInfo).forEach((item: Pep) => {
          this.pepInfoArr.push(
            this.fb.group({
              relacion: [item.relacion],
              nombreCargoEntidad: [item.nombreCargoEntidad],
              fechasVinculacionEstado: [item.fechasVinculacionEstado]
            })
          );
        });

        parseOrUse(data.parentescosTercerGrado).forEach((item: Parentesco) => {
          this.parentescosArr.push(
            this.fb.group({
              nombre: [item.nombre],
              tipoRelacion: [item.tipoRelacion]
            })
          );
        });

        parseOrUse(data.detalleInversionesSamsung).forEach((item: Inversiones) => {
          this.inversionesArr.push(
            this.fb.group({
              tipoTitulo: [item.tipoTitulo],
              cantidadTitulos: [item.cantidadTitulos],
              valorTitulos: [item.valorTitulos]
            })
          );
        });

        //map date
        if (data.fechaDeclaracion) {
          const convertDate = new Date(data.fechaDeclaracion);
          if (!isNaN(convertDate.getTime())) {
            const fechaFormateada = convertDate.toISOString().slice(0, 10);
            this.formulario.patchValue({ fechaDeclaracion: fechaFormateada });
          }
        }

        this.formulario.patchValue({
          Id: data.id,
          ciudadDeclaracion: data.ciudadDeclaracion,
          nombresApellidos: data.nombresApellidos,
          cedula: data.cedula,
          tipoVinculacionSamsung: data.tipoVinculacionSamsung,
          conoceProcedimientoConflicto: data.conoceProcedimientoConflicto,
          razonNoConocerProcedimientoConflicto: data.razonNoConocerProcedimientoConflicto,
          otrasSituacionesConflicto: data.otrasSituacionesConflicto,
          decisionesInteresPersonal: data.decisionesInteresPersonal,
          razonDecisionesInteresPersonal: data.razonDecisionesInteresPersonal,
          actividadesCompetidor: data.actividadesCompetidor,
          razonActividadesCompetidor: data.razonActividadesCompetidor,
          relacionesEstado: data.relacionesEstado,
          razonRelacionesEstado: data.razonRelacionesEstado,
          regalosHospitalidad: data.regalosHospitalidad,
          razonRegalosHospitalidad: data.razonRegalosHospitalidad,
          incumplimientoExclusividad: data.incumplimientoExclusividad,
          razonIncumplimientoExclusividad: data.razonIncumplimientoExclusividad,
          relacionesProveedores: data.relacionesProveedores,
          razonRelacionesProveedores: data.razonRelacionesProveedores,
          inversionesSamsung: data.inversionesSamsung,
          otrasSituacionesAfectanIndependencia: data.otrasSituacionesAfectanIndependencia,
          razonOtrasSituacionesAfectanIndependencia: data.razonOtrasSituacionesAfectanIndependencia,
          usoInformacionConfidencial: data.usoInformacionConfidencial,
          influenciaIndebidaPoliticas: data.influenciaIndebidaPoliticas,
          influenciaIndebidaAdjudicaciones: data.influenciaIndebidaAdjudicaciones,
          descuentoReventa: data.descuentoReventa,
          comparteCredencialesAliados: data.comparteCredencialesAliados,
          actividadesRegulatorias: data.actividadesRegulatorias,
          corredorIntermediario: data.corredorIntermediario,
          regalosFuncionarios: data.regalosFuncionarios,
          apruebaTransaccionesConflicto: data.apruebaTransaccionesConflicto

        });
      },
      error: (err) => {
        console.error('Error cargarDatosConflicto', err);
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
