import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../Services/main.services';
import { noSeleccionadoValidator } from '../utils/validcliente/validacionOpcionales';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-representante-legal',
  templateUrl: './representante-legal.component.html',
  styleUrl: './representante-legal.component.scss'
})
export class RepresentanteLegalComponent implements OnInit {
  @ViewChild('childDivR', { static: true }) childDivR!: ElementRef;
  Lang: string = 'es';
  datos: any;
  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() Listatiposolicitud: any[];
  @Input() ListaClaseTerceros: any[];
  @Input() ListaTipoDocumentos: any[];
  @Input() ListaSino: any[];
  @Input() ListaPaises: any[];
  @Input() ListaTamanoterceros: any[];
  @Input() ListaActividadesEco: any[];
  @Input() ListaCategoriaTerceros: any[];
  @Input() editable:boolean;
  RepresentantesForm: FormGroup;
  isbolean: boolean = false;
  tabdespachos: boolean = true;
  tabdRepresentanteLegal: boolean = true;

  private originalValidators: { [key: string]: any } = {};
  private numericDocumentIds = [1, 2, 3]; 
  formulario: FormGroup;
  constructor(private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService,private cdr: ChangeDetectorRef) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.RepresentantesForm = this.fb.group({

      representantes: this.fb.array([], [Validators.required])
    });
  }
  ngOnInit(): void {

    this.formulario = this.fb.group({
      representantes: this.fb.array([])
    });

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });
    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaInfoRepresentantes();
    }
  }

  ConsultaInfoRepresentantes() {
    this.serviciocliente.cosultaRepresentates(this.IdFormulario).subscribe(data => {

      if (data) {
        this.setRepresentante(data.representantes);
      }
      if (!this.editable) {

        this.RepresentantesForm.disable();
        //this.deshabilitarFormulario(this.DatosContactos);
      }
    });
  }
  limpiarControles(controles: string[]) {
    for (const control of controles) {
      this.representantes.get(control)?.setValue('');
    }
  }



  setRepresentante(RepresentanteData: any[]): void {
    const RepresentantesFormArray = this.RepresentantesForm.get('representantes') as FormArray;
    RepresentanteData.forEach((representante) => {

      const PaisesObligacionTributariaArray = typeof representante.PaisesObligacionTributaria === 'string' && representante.PaisesObligacionTributaria.trim() !== ''
      ? representante.PaisesObligacionTributaria.split(',').map((pais: string) => pais.trim())
      : [];


      const PaisesPaisesCuentasExtArray = typeof representante.PaisesCuentasExt === 'string' && representante.PaisesCuentasExt.trim() !== ''
      ? representante.PaisesCuentasExt.split(',').map((pais: string) => pais.trim())
      : [];

      const PaisesPoderCuentaExtranjeraArray = typeof representante.PaisesPoderCuentaExtranjera === 'string' && representante.PaisesPoderCuentaExtranjera.trim() !== ''
      ? representante.PaisesPoderCuentaExtranjera.split(',').map((pais: string) => pais.trim())
      : [];

      const RepresentanteFormGroup = this.fb.group({
        nombre: [representante.nombre, Validators.required],
        tipoDocumento: [representante.tipoDocumento, [Validators.required, , noSeleccionadoValidator()]],
        NumeroIdentificacion: [representante.NumeroIdentificacion],
        Direccion: [representante.Direccion],
        Ciudad: [representante.Ciudad],
        Nacionalidad: [representante.Nacionalidad, [Validators.required, , noSeleccionadoValidator()]],
        Telefono: [representante.Telefono],
        CorreoElectronico: [representante.CorreoElectronico],
        vinculadoPep: [representante.vinculadoPep],
        ManejaRecursos: [representante.ManejaRecursos, Validators.required],
        CualesRecursos: [representante.CualesRecursos, Validators.required],
        PoderPolitico: [representante.PoderPolitico, Validators.required],
        RamaPoderPublico: [representante.RamaPoderPublico, Validators.required],
        CargoPublico: [representante.CargoPublico, Validators.required],
        CualCargoPublico: [representante.CualCargoPublico, Validators.required],
        ObligacionTributaria: [representante.ObligacionTributaria, Validators.required],
        PaisesObligacionTributaria: [PaisesObligacionTributariaArray, Validators.required],
        CuentasFinancierasExt: [representante.CuentasFinancierasExt, Validators.required],
        PaisesCuentasExt: [PaisesPaisesCuentasExtArray, Validators.required],
        TienePoderCuentaExtranjera: [representante.TienePoderCuentaExtranjera, Validators.required],
        PaisesPoderCuentaExtranjera: [PaisesPoderCuentaExtranjeraArray, Validators.required],
        hasidoPep2: [representante.hasidoPep2],
        cargosPublicos: this.fb.array(representante.cargosPublicos ? representante.cargosPublicos.map((c: any) => this.crearcargospublicosForm(c)) : []),
        Tienevinculosmas5: [representante.Tienevinculosmas5, Validators.required],
        Vinculosmas: this.fb.array(representante.Vinculosmas ? representante.Vinculosmas.map((v: any) => this.crearVinculoForm(v)) : []),
        InfoFamiliaPep: this.fb.array(representante.InfoFamiliaPep ? representante.InfoFamiliaPep.map((f: any) => this.crearInfoFamiliaForm(f)) : []),
      });


      RepresentantesFormArray.push(RepresentanteFormGroup);
      RepresentanteFormGroup.get('vinculadoPep')?.valueChanges.subscribe((value: any) => {
        if (value === '0') {
          this.resetControls(RepresentanteFormGroup);
        }
        this.initializeFormSubscriptions(RepresentanteFormGroup, value);
      });

      if (representante.vinculadoPep === '1')
        {
         this.ajustarValidacionesotroscampos(RepresentanteFormGroup, representante);
        }else{
          this.initializeFormSubscriptions(RepresentanteFormGroup,'0');
        }
      //this.ajustarValidaciones(RepresentanteFormGroup, representante.vinculadoPep);
      //this.ajustarValidacionesotroscampos(RepresentanteFormGroup, representante);
    });
  }

  private ajustarValidacionesotroscampos(formGroup: FormGroup, representante: any): void {
    if (representante.ManejaRecursos === '0') {
      formGroup.get('CualesRecursos')?.clearValidators();
    } else {
      formGroup.get('CualesRecursos')?.setValidators([Validators.required]);
    }
    if (representante.PoderPolitico === '0') {
      formGroup.get('RamaPoderPublico')?.clearValidators();
    } else {
      formGroup.get('RamaPoderPublico')?.setValidators([Validators.required]);
    }
    if (representante.CargoPublico === '0') {
      formGroup.get('CualCargoPublico')?.clearValidators();
    } else {
      formGroup.get('CualCargoPublico')?.setValidators([Validators.required]);
    }
    if (representante.ObligacionTributaria === '0') {
      formGroup.get('PaisesObligacionTributaria')?.clearValidators();
    } else {
      formGroup.get('PaisesObligacionTributaria')?.setValidators([Validators.required]);
    }
    if (representante.CuentasFinancierasExt === '0') {
      formGroup.get('PaisesCuentasExt')?.clearValidators();
    } else {
      formGroup.get('PaisesCuentasExt')?.setValidators([Validators.required]);
    }

    if (representante.TienePoderCuentaExtranjera === '0')
    {
      formGroup.get('PaisesPoderCuentaExtranjera')?.clearValidators();
    }else{
      formGroup.get('PaisesPoderCuentaExtranjera')?.setValidators([Validators.required]);
    }

    formGroup.get('CualesRecursos')?.updateValueAndValidity();
    formGroup.get('RamaPoderPublico')?.updateValueAndValidity();
    formGroup.get('CualCargoPublico')?.updateValueAndValidity();
    formGroup.get('PaisesObligacionTributaria')?.updateValueAndValidity();
    formGroup.get('PaisesCuentasExt')?.updateValueAndValidity();
    formGroup.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
  }

  private ajustarValidaciones(formGroup: FormGroup, vinculadoPepValue: string): void {
    const campos = [
      'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico',
      'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria',
      'PaisesObligacionTributaria', 'CuentasFinancierasExt', 'PaisesCuentasExt',
      'TienePoderCuentaExtranjera', 'PaisesPoderCuentaExtranjera', 'Tienevinculosmas5'
    ];

    if (vinculadoPepValue === '0') {
      campos.forEach(campo => {
        formGroup.get(campo)?.clearValidators();
      });
    } else {
      campos.forEach(campo => {
        formGroup.get(campo)?.setValidators([Validators.required]);
      });
    }

    campos.forEach(campo => {
      formGroup.get(campo)?.updateValueAndValidity();
    });
  }


  crearcargospublicosForm(cargo?: any): FormGroup {
    return this.fb.group({
      NombreEntidad: [cargo?.NombreEntidad || '', Validators.required],
      FechaIngreso: [cargo?.FechaIngreso || '', Validators.required],
      FechaDesvinculacion: [cargo?.FechaDesvinculacion || ''],
    });
  }
  crearVinculoForm(vinculo?: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [vinculo?.NombreCompleto || '', Validators.required],
      TipoIdentificacion: [vinculo?.TipoIdentificacion || '-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: [vinculo?.NumeroIdentificacion || '', Validators.required],
      Pais: [vinculo?.Pais || '', [Validators.required, noSeleccionadoValidator()]],
      PorcentajeParticipacion: [vinculo?.PorcentajeParticipacion || '', Validators.required],
    });
  }
  crearInfoFamiliaForm(infoFamilia?: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [infoFamilia?.NombreCompleto || '', Validators.required],
      TipoIdentificacion: [infoFamilia?.TipoIdentificacion || '-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: [infoFamilia?.NumeroIdentificacion || '', Validators.required],
      Nacionalidad: [infoFamilia?.Nacionalidad || '-1', [Validators.required, noSeleccionadoValidator()]],
      CargoContacto: [infoFamilia?.CargoContacto || '', Validators.required], 
      FechaNombramiento: [infoFamilia?.FechaNombramiento || '', Validators.required],
      FechaFinalizacion: [infoFamilia?.FechaFinalizacion || '', Validators.required],
      VinculoFamiliar: [infoFamilia?.VinculoFamiliar || '', Validators.required],
    });
  }
  enviarFormulario(): void {
    if (this.formulario.valid) {
      console.log('Datos del formulario:', this.formulario.value);
    } else {
      console.log('Formulario no válido');
      this.formulario.markAllAsTouched(); // Muestra los errores
    }
  }

  get representantes() {
    return this.RepresentantesForm.get('representantes') as FormArray;
  }
  addRepresentante() {
    const representanteForm = this.crearRepresentante();
    this.representantes.push(representanteForm);
    this.listenVinculadoPep(representanteForm);
    representanteForm.get('vinculadoPep')?.valueChanges.subscribe(value => {
      if (value === '0') {
        this.resetControls(representanteForm);
      }
      this.initializeFormSubscriptions(representanteForm, value);
    });
    representanteForm.get('hasidoPep2')?.valueChanges.subscribe(value => {
      this.initializeFormSubscriptionsCargos(representanteForm, value);
    });
    representanteForm.get('Tienevinculosmas5')?.valueChanges.subscribe(value => {
      this.initializeFormSubsvinculadosmas5(representanteForm, value);
    });

    representanteForm.get('ManejaRecursos')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('CualesRecursos')?.clearValidators();
      } else {
        representanteForm.get('CualesRecursos')?.setValidators([Validators.required]);
      }
      representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    });
    representanteForm.get('PoderPolitico')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('RamaPoderPublico')?.clearValidators();
      } else {
        representanteForm.get('RamaPoderPublico')?.setValidators([Validators.required]);
      }
      representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    });
    representanteForm.get('CargoPublico')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('CualCargoPublico')?.clearValidators();
      } else {
        representanteForm.get('CualCargoPublico')?.setValidators([Validators.required]);
      }
      representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    });
    representanteForm.get('ObligacionTributaria')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('PaisesObligacionTributaria')?.clearValidators();
      } else {
        representanteForm.get('PaisesObligacionTributaria')?.setValidators([Validators.required]);
      }
      representanteForm.get('PaisesObligacionTributaria')?.updateValueAndValidity();
    });
    representanteForm.get('CuentasFinancierasExt')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('PaisesCuentasExt')?.clearValidators();
      } else {
        representanteForm.get('PaisesCuentasExt')?.setValidators([Validators.required]);
      }
      representanteForm.get('PaisesCuentasExt')?.updateValueAndValidity();
    });
    representanteForm.get('TienePoderCuentaExtranjera')?.valueChanges.subscribe(value => {
      if (value !== '1') {
        representanteForm.get('PaisesPoderCuentaExtranjera')?.clearValidators();
      } else {
        representanteForm.get('PaisesPoderCuentaExtranjera')?.setValidators([Validators.required]);
      }
      representanteForm.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
    });
  }
  private initializeFormSubscriptions(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('ManejaRecursos')?.clearValidators();
      representanteForm.get('CualesRecursos')?.clearValidators();
      representanteForm.get('PoderPolitico')?.clearValidators();
      representanteForm.get('RamaPoderPublico')?.clearValidators();
      representanteForm.get('CargoPublico')?.clearValidators();
      representanteForm.get('CualCargoPublico')?.clearValidators();
      representanteForm.get('ObligacionTributaria')?.clearValidators();
      representanteForm.get('PaisesObligacionTributaria')?.clearValidators();
      representanteForm.get('CuentasFinancierasExt')?.clearValidators();
      representanteForm.get('PaisesCuentasExt')?.clearValidators();
      representanteForm.get('TienePoderCuentaExtranjera')?.clearValidators();
      representanteForm.get('PaisesPoderCuentaExtranjera')?.clearValidators();
      representanteForm.get('hasidoPep2')?.clearValidators();
      representanteForm.get('Tienevinculosmas5')?.clearValidators();
      representanteForm.get('InfoFamiliaPep')?.clearValidators();
    } else {
      representanteForm.get('ManejaRecursos')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('CualesRecursos')?.setValidators([Validators.required]);
      representanteForm.get('PoderPolitico')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('RamaPoderPublico')?.setValidators([Validators.required]);
      representanteForm.get('CargoPublico')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('ObligacionTributaria')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('PaisesObligacionTributaria')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('CuentasFinancierasExt')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('PaisesCuentasExt')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('TienePoderCuentaExtranjera')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('PaisesPoderCuentaExtranjera')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('hasidoPep2')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('Tienevinculosmas5')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      representanteForm.get('InfoFamiliaPep')?.setValidators([Validators.required]);
    }

    representanteForm.get('ManejaRecursos')?.updateValueAndValidity();
    representanteForm.get('CualesRecursos')?.updateValueAndValidity();
    representanteForm.get('PoderPolitico')?.updateValueAndValidity();
    representanteForm.get('RamaPoderPublico')?.updateValueAndValidity();
    representanteForm.get('CualCargoPublico')?.updateValueAndValidity();
    representanteForm.get('ObligacionTributaria')?.updateValueAndValidity();
    representanteForm.get('PaisesObligacionTributaria')?.updateValueAndValidity();
    representanteForm.get('CuentasFinancierasExt')?.updateValueAndValidity();
    representanteForm.get('PaisesCuentasExt')?.updateValueAndValidity();
    representanteForm.get('TienePoderCuentaExtranjera')?.updateValueAndValidity();
    representanteForm.get('PaisesPoderCuentaExtranjera')?.updateValueAndValidity();
    representanteForm.get('hasidoPep2')?.updateValueAndValidity();
    representanteForm.get('Tienevinculosmas5')?.updateValueAndValidity();
    representanteForm.get('InfoFamiliaPep')?.updateValueAndValidity();
  }

  private updateNumeroIdentificacionValidators(tipoId: any): void {
    const numeroIdControl = this.formulario.get('NumeroIdentificacion');
    const isNumericOnly = this.numericDocumentIds.includes(Number(tipoId));
  
    if (numeroIdControl) {
      if (isNumericOnly) {
    
        numeroIdControl.setValidators([
          Validators.required,
          Validators.pattern(/^[0-9]*$/) 
        ]);
      } else {
        
        numeroIdControl.setValidators([
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9]*$/) 
        ]);
      }
      numeroIdControl.updateValueAndValidity();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    const tipoId = this.formulario.get('tipoDocumento')?.value;
    const isNumericField = this.numericDocumentIds.includes(Number(tipoId));
    
    if (isNumericField) {
      const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'];
      const charCode = event.key.charCodeAt(0);
      
      if (
        !allowedKeys.includes(event.key) &&
        (charCode < 48 || charCode > 57) 
      ) {
        event.preventDefault();
      }
    }
  }

  private initializeFormSubscriptionsCargos(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('cargosPublicos')?.clearValidators();
    } else {
      representanteForm.get('cargosPublicos')?.setValidators([Validators.required]);
    }
    representanteForm.get('cargosPublicos')?.updateValueAndValidity();
  }

  private initializeFormSubsvinculadosmas5(representanteForm: FormGroup, value: any) {
    if (value !== '1') {
      representanteForm.get('Vinculosmas')?.clearValidators();
    } else {
      representanteForm.get('Vinculosmas')?.setValidators([Validators.required]);
    }
    representanteForm.get('Vinculosmas')?.updateValueAndValidity();
  }


  resetControls(representanteForm: FormGroup) {
    const cargosPublicosArray = representanteForm.get('cargosPublicos') as FormArray;
    cargosPublicosArray.clear();
    const vinculosMasArray = representanteForm.get('Vinculosmas') as FormArray;
    vinculosMasArray.clear();
    const infoFamiliaPepArray = representanteForm.get('InfoFamiliaPep') as FormArray;
    infoFamiliaPepArray.clear();
    representanteForm.patchValue({
      ManejaRecursos: '-1',
      CualesRecursos: '',
      PoderPolitico: '-1',
      RamaPoderPublico: '',
      CargoPublico: '-1',
      CualCargoPublico: '',
      ObligacionTributaria: '-1',
      PaisesObligacionTributaria: [],
      CuentasFinancierasExt: '-1',
      PaisesCuentasExt: [],
      TienePoderCuentaExtranjera: '-1',
      PaisesPoderCuentaExtranjera: [],
      hasidoPep2: '-1',
      Tienevinculosmas5: '-1',
    });
  }

  removeRepresentante(index: number) {
    this.representantes.removeAt(index);
  }

  crearRepresentante(): FormGroup {
    return this.fb.group({
      nombre: ['', Validators.required],
      tipoDocumento: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Direccion: [''],
      Ciudad: [''],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Telefono: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      CorreoElectronico: ['', [Validators.required, Validators.email]],
      vinculadoPep: ['-1', [Validators.required, noSeleccionadoValidator()]],//si si preguntas
      ManejaRecursos: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      RamaPoderPublico: ['', Validators.required],

      CargoPublico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualCargoPublico: ['', Validators.required],

      ObligacionTributaria: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesObligacionTributaria: [[], Validators.required],

      CuentasFinancierasExt: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesCuentasExt: [[], Validators.required],

      TienePoderCuentaExtranjera: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesPoderCuentaExtranjera: [[], [Validators.required]],

      hasidoPep2: ['-1', [Validators.required, noSeleccionadoValidator()]],
      cargosPublicos: this.fb.array([]),

      Tienevinculosmas5: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Vinculosmas: this.fb.array([]),

      InfoFamiliaPep: this.fb.array([]),
      //cargosPublicos: this.fb.array([this.crearcargospublicos()]) // Array de ca// Array de cargos públicos
    });
  }

  // Obtener el FormArray de cargos públicos para un representante específico
  getCargosPublicos(representanteIndex: number): FormArray {
    return this.representantes.at(representanteIndex).get('cargosPublicos') as FormArray;
  }


  crearcargospublicos() {
    return this.fb.group({
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
      FechaDesvinculacion: ['']
    });
  }

  removeCargoPublico(representanteIndex: number, cargoIndex: number) {
    const cargosPublicos = this.getCargosPublicos(representanteIndex);
    cargosPublicos.removeAt(cargoIndex);
  }

  removeVinculomas5(representanteIndex: number, cargoIndex: number) {
    const vinculomas5 = this.getVinculomas5(representanteIndex);
    vinculomas5.removeAt(cargoIndex);
  }


  // Agregar un cargo público cuando `hasidoPep2` es "si"
  addCargoPublico(representanteIndex: number) {
    const cargosPublicos = this.getCargosPublicos(representanteIndex);
    const cargoPublicoForm = this.fb.group({
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
      FechaDesvinculacion: [''],

    });
    cargosPublicos.push(cargoPublicoForm);
  }

  addVinculomas5(representanteIndex: number) {
    const vinculosmas5 = this.getVinculomas5(representanteIndex);
    const vinculosmas5Form = this.fb.group({
      NombreCompleto: ['', Validators.required],
      TipoIdentificacion: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Pais: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PorcentajeParticipacion: ['', Validators.required],

    });
    vinculosmas5.push(vinculosmas5Form);
  }

  getVinculomas5(vinculomas5Index: number): FormArray {
    return this.representantes.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.representantes.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
  }

  addInfoFamilia(representanteIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    const InfoFamiliaForm = this.fb.group({
      NombreCompleto: ['', Validators.required],
      TipoIdentificacion: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CargoContacto: ['', Validators.required],
      FechaNombramiento: ['', Validators.required],
      NumeroIdentificacionT: ['', Validators.required],
      FechaFinalizacion: ['', Validators.required],
      VinculoFamiliar: ['', Validators.required],

    });
    InfoFamilia.push(InfoFamiliaForm);
  }

  removeInfoFamilia(representanteIndex: number, FamilairIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    InfoFamilia.removeAt(FamilairIndex);
  }

  listenVinculadoPep(representanteForm: FormGroup) {
    representanteForm.get('vinculadoPep')?.valueChanges.subscribe(value => {
      const fields = [
        'ManejaRecursos',
        'CualesRecursos',
        'PoderPolitico',
        'RamaPoderPublico',
        'CargoPublico',
        'CualCargoPublico',
        'ObligacionTributaria',
        'PaisesObligacionTributaria',
        'CuentasFinancierasExt',
        'PaisesCuentasExt',
        'TienePoderCuentaExtranjera',
        'PaisesPoderCuentaExtranjera',
        'Tienevinculosmas5'
      ];

      if (value === '0') {
        fields.forEach(field => {
          representanteForm.get(field)?.clearValidators();
          representanteForm.get(field)?.updateValueAndValidity();
        });
      } else {
        fields.forEach(field => {
          representanteForm.get(field)?.setValidators(Validators.required);
          representanteForm.get(field)?.updateValueAndValidity();
        });
      }
    });
  }

  obtenerCamposInvalidos(): any[] {
    const invalidFields: any[] = [];
    
    // Recorre el FormArray de representantes
    (this.representantes.controls as FormGroup[]).forEach((representanteGroup, representanteIndex) => {
      // Verifica cada control en el FormGroup del representante
      Object.keys((representanteGroup as FormGroup).controls).forEach(field => {
        const control = representanteGroup.get(field);
        
        if (control && control.invalid) {
          invalidFields.push({
            representanteIndex,
            field,
            errors: control.errors
          });
        }
        
        // Verifica si el campo es un FormArray, como cargosPublicos, Vinculosmas, o InfoFamiliaPep
        if (control instanceof FormArray) {
          (control.controls as FormGroup[]).forEach((subControlGroup, subIndex) => {
            Object.keys((subControlGroup as FormGroup).controls).forEach(subField => {
              const subControl = subControlGroup.get(subField);
              if (subControl && subControl.invalid) {
                invalidFields.push({
                  representanteIndex,
                  subArray: field,
                  subIndex,
                  subField,
                  errors: subControl.errors
                });
              }
            });
          });
        }
      });
    });
    
    return invalidFields;
  }


  // Enviar el formulario completo
  submit() {

    const invalidFields = this.obtenerCamposInvalidos();
    console.log('Campos inválidos:', invalidFields);




    //if (this.RepresentantesForm.valid) {
    const formValue = this.RepresentantesForm.value; // Obtiene el valor del formulario
    console.log(JSON.stringify(formValue, null, 2));
    //}else{
    this.marcarFormularioComoTocado();
    // }
  }
  marcarFormularioComoTocado() {
    Object.values(this.RepresentantesForm.controls).forEach(control => {
      if (control instanceof FormControl) {
        // Si es un FormControl, lo marcamos como tocado
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        // Si es un FormGroup, llamamos recursivamente al método para marcar sus subcontroles
        this.marcarGrupoComoTocado(control);
      } else if (control instanceof FormArray) {
        // Si es un FormArray, recorremos cada elemento y aplicamos la misma lógica
        control.controls.forEach(subControl => {
          if (subControl instanceof FormGroup) {
            this.marcarGrupoComoTocado(subControl);
          } else {
            subControl.markAsTouched({ onlySelf: true });
          }
        });
      }
    });
  }

  private marcarGrupoComoTocado(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.marcarGrupoComoTocado(control); // Llamada recursiva para subgrupos
      } else if (control instanceof FormArray) {
        control.controls.forEach(subControl => {
          if (subControl instanceof FormGroup) {
            this.marcarGrupoComoTocado(subControl);
          } else {
            subControl.markAsTouched({ onlySelf: true });
          }
        });
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
      this.RepresentantesForm.markAllAsTouched();
    } 
    
    const formularioValores = this.RepresentantesForm.value;
  
    formularioValores.representantes.forEach((representante: any) => {
      if (Array.isArray(representante.PaisesObligacionTributaria)) {
        representante.PaisesObligacionTributaria = representante.PaisesObligacionTributaria.join(', ');
      }
      if (Array.isArray(representante.PaisesCuentasExt)) {
        representante.PaisesCuentasExt = representante.PaisesCuentasExt.join(', ');
      }
      if (Array.isArray(representante.PaisesPoderCuentaExtranjera)) {
        representante.PaisesPoderCuentaExtranjera = representante.PaisesPoderCuentaExtranjera.join(', ');
      }
    });
  
    return formularioValores;
  }


  esFormularioValido() {
    return this.RepresentantesForm.valid;
  }

  /*Generarpdf()
    {
  
     
      const content = document.getElementById('Representantespdf');  // Asegúrate de que el ID coincida
  
  
      if (content) { 
        const contentHeight = content.scrollHeight; // Altura del contenido
        const pageHeightInMM = contentHeight * 0.264583; // Convertir px a mm (1px = 0.264583mm)
        const pdf = new jsPDF('p', 'mm', [pageHeightInMM, 210]); // Altu // Verificación de null
        pdf.html(content, {
          callback: (doc) => {
            doc.save('documento.pdf');
          },
          margin: [2  , 10, 10, 2],  // Márgenes (arriba, derecha, abajo, izquierda)
          x: 10,  // Posición horizontal
          y: 10,  // Posición vertical inicial
          autoPaging: 'text',  // Paginación automática según el texto
          width: 180, // Ajustar ancho al tamaño de la página
          windowWidth: content.scrollWidth, // Ajustar escala 
        });
      } else {
        console.error("Elemento HTML con id 'htmlContent' no encontrado.");
      }
    }
  
  */



  generarPDF2() {
    const div = document.getElementById('Representantespdf');
    if (!div) {
      console.error('No se encontró el div con id Representantespdf');
      return;
    }

    // Crear un contenedor A4
    const a4Container = document.createElement('div');
    a4Container.classList.add('a4-container');
    a4Container.appendChild(div.cloneNode(true)); // Clonamos el div original al contenedor A4

    // Asegurarse de que el contenedor se inserte en el DOM temporalmente para su procesamiento
    document.body.appendChild(a4Container);

    // Generar el PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    html2canvas(a4Container, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Añadir la imagen al PDF
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 277); // Ajusta 10 y 190 para los márgenes, el tamaño se adapta

      // Guardar el archivo PDF
      pdf.save('documento_a4.pdf');

      // Eliminar el contenedor A4 del DOM después de generar el PDF
      document.body.removeChild(a4Container);
    });
  }

  generarPDF(): void {
    const a4Container = document.getElementById('Representantespdf');  // Obtener el div que quieres convertir a PDF

    if (a4Container) {
      // Usar html2canvas para convertir el div a imagen
      html2canvas(a4Container, {
        scale: 1,  // Resolución más baja para reducir tamaño del archivo
        logging: false,  // Desactivar logging
        useCORS: true  // Para imágenes externas que se puedan cargar
      }).then(canvas => {
        // Convertir el canvas a imagen en formato JPEG
        const imgData = canvas.toDataURL('image/jpeg', 0.5);  // Usar calidad 0.5 para reducir tamaño

        const pdf = new jsPDF('p', 'mm', 'a4');

        // Establecer márgenes
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Añadir la imagen al PDF
        pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

        // Guardar el PDF con un nombre
        pdf.save('documento_a4.pdf');
      });
    }
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable=false;
    this.RepresentantesForm.disable()
    
    this.IdEstadoFormulario=3;
    this.cdr.detectChanges(); //
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('Representantespdf');

    return DATA;
  }


  onPaisesObligacionTributariaChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.representantes.at(index).get('PaisesObligacionTributaria')?.setValue(paises);
  }

  onPaisesCuentasExtChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.representantes.at(index).get('PaisesCuentasExt')?.setValue(paises);
  }

  onPaisesPoderCuentaExtranjeraChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.representantes.at(index).get('PaisesPoderCuentaExtranjera')?.setValue(paises);
  }

}


