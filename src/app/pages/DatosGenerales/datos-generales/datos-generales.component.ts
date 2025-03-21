import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { content } from 'html2canvas/dist/types/css/property-descriptors/content';
import { retry } from 'rxjs';
import { InternalDataService } from '../../Services/InternalDataService';
import { StructuredType } from 'typescript';


@Component({
  selector: 'app-datos-generales',
  templateUrl: './datos-generales.component.html',
  styleUrls: ['./datos-generales.component.scss']
})
export class DatosGeneralesComponent implements OnInit {
  @ViewChild('childDiv', { static: true }) childDiv!: ElementRef;

  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() FechaFormulario: string;
  @Input() Lang: string;
  @Input() Listatiposolicitud: any[];
  @Input() ListaClaseTerceros: any[];
  @Input() ListaTipoDocumentos: any[];
  @Input() ListaSino: any[];
  @Input() ListaPaises: any[];
  @Input() ListaTamanoterceros: any[];
  @Input() ListaActividadesEco: any[];
  @Input() ListaCategoriaTerceros: any[];
  @Input() editable: boolean;
  @Input() classClient: boolean;
  @Input() classProveedor: boolean;
  @Input() classAliado: boolean;
  
  
  

  DatosGenerales: any = {};

  private originalValidators: { [key: string]: any } = {};

  ListaTipoPago = [
    { id: true, nombre: 'Crédito' },
    { id: false, nombre: 'Contado' }
  ];

  private numericDocumentIds = [1, 2, 3]; 
  public formularioEnviado: boolean = false;

  @Output() claseTerceroChange = new EventEmitter<number>();

  @Output() tabVisibilityChange = new EventEmitter<{ tabDespachos: boolean, tabAccionistas: boolean, tabRepresentanteLegal: boolean, tabInformacionTriburaria: boolean, tabPrinProvAndClient: boolean, tabIsAliado: boolean, tabDeclaraciones: boolean, tabRevisorFiscal: boolean, tabInfoFinanciera: boolean, tabInformacionComplementaria: boolean, tabConflictoInteres: boolean, tabReferenciasBancarias: boolean, tabCumplimientoNormativo: boolean, tabDatosRevisorFiscal: boolean, tabDatosdeContacto: boolean, tabDatosdepagos: boolean, tabtabInformacionTriburaria: boolean}>();

  @Output() idTipoTerceroChange = new EventEmitter<{ idClaseTercero: string }>();

  @Output() idCategoriaTerceroChange = new EventEmitter<{ idCategoriaTercero: string }>();


  isbolean: boolean = false;
  tabdespachos: boolean = true;
  tabRepresentanteLegal: boolean = true;
  tabInfoFinanciera: boolean = true;
  tabRevisorFiscal: boolean = true;
  tabtabInformacionTriburaria: boolean = true;
  tabInformacionComplementaria: boolean = true;
  tabDeclaraciones: boolean = true;
  tabPrinProvAndClient: boolean = true;
  tabConflictoInteres: boolean = true;
  tabIsAliado: boolean = true;
  tabAccionistas: boolean = true;
  tabInformacionTriburaria: boolean = true;
  tabReferenciasBancarias: boolean = true;
  tabCumplimientoNormativo: boolean = true;
  tabDatosRevisorFiscal: boolean = true;
  tabDatosdepagos: boolean = true;
  tabDatosdeContacto: boolean = true;
  formulario: FormGroup;

  constructor(private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService, private cdr: ChangeDetectorRef, private internalservicet: InternalDataService) {

    this.translate.setDefaultLang('es');
    // Opcional: cargar el idioma basado en una preferencia del usuario
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['isVisible']) {
      // Realizar alguna acción cuando el valor cambie
      console.log('Visibility changed:', this.IdEstadoFormulario);
    }
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  notificarCambioClaseTercero(valor: number) {
    this.claseTerceroChange.emit(valor);
  }

  verificarSiFormularioEnviado(): boolean {
    // Implementa la lógica para verificar si el formulario está en estado enviado
    // Por ejemplo, podrías verificar una propiedad en el servicio o en el estado del componente
    return true; // Simulación: el formulario está enviado
  }

  deshabilitarFormulario(form: FormGroup | FormArray): void {
    if (form instanceof FormGroup) {
      Object.keys(form.controls).forEach(controlName => {
        const control = form.get(controlName);
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.deshabilitarFormulario(control);
        } else {
          control?.disable();
        }
      });
    } else if (form instanceof FormArray) {
      form.controls.forEach((control: AbstractControl) => {
        if (control instanceof FormGroup || control instanceof FormArray) {
          this.deshabilitarFormulario(control);
        } else {
          control?.disable();
        }
      });
    }
  }



  ngOnInit(): void {
    this.initializeForm();  
    this.emitirCambioDeVisibilidad();
  //  this.initializeFormSubscriptions();
  
    
    this.formulario.get('tipoIdentificacion')?.valueChanges.subscribe(value => {
      if (value === 3) {
        this.formulario.get('digitoVerificacion')?.setValue(this.formulario.get('digitoVerificacion')?.value || '');
      }
    });
    

    this.formulario.get('claseTercero')?.valueChanges.subscribe(value => {
      this.idTipoTerceroChange.emit({ idClaseTercero: value.toString() });

    });

    this.formulario.get('categoriaTercero')?.valueChanges.subscribe(value => {
      this.idCategoriaTerceroChange.emit({ idCategoriaTercero: value.toString() });
    });

    this.formulario.get('claseTercero')?.valueChanges.subscribe(valor => {
      const controlSelect = this.formulario.get('obligadoFE');
      const controlEmail = this.formulario.get('correoElectronicoFE');
    
      if (valor === 3 || valor === '3') {
        controlSelect?.setValue("");
        controlEmail?.setValue("");

        controlSelect?.clearValidators();
        controlEmail?.clearValidators();
      } else {
        controlSelect?.setValidators([Validators.required]);
        controlEmail?.setValidators([
          Validators.required,
          Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
        ]);
      }
      
      controlSelect?.updateValueAndValidity();
      controlEmail?.updateValueAndValidity();
    });
    
    
    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    this.initializeFormSubscriptions(); // Establece las suscripciones
    this.getFechaActual();
    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaDatosGenerales();
      /* if (!this.editable) {
         this.deshabilitarFormulario(this.formulario);
       }*/
    }
  }

  ConsultaDatosGenerales() {

    if (this.IdFormulario !== 0) {
      this.serviciocliente.ConsultaDatosGenerales(this.IdFormulario).subscribe(data => {
        if (data) {
          this.inicilizarinfogurdada(data)
          if (!this.editable) {
            this.deshabilitarFormulario(this.formulario);
          }
        }
      });

    }


  }

  private updateNumeroIdentificacionValidators(tipoId: any): void {
    const numeroIdControl = this.formulario.get('numeroIdentificacion');
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
    const tipoId = this.formulario.get('tipoIdentificacion')?.value;
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

  inicilizarinfogurdada(obj: any) {
    let paisesOtrasSucursalesArray = [];
    if (typeof obj.paisesOtrasSucursales === 'string' && obj.paisesOtrasSucursales.trim() !== '') {
      paisesOtrasSucursalesArray = obj.paisesOtrasSucursales.split(',').map((pais: string) => pais.trim());
    }
 
    const preguntasAdicionales = JSON.parse(obj.preguntasAdicionales);
    this.formulario.patchValue({
      Id: obj.id,
      IdFormulario: this.IdFormulario,
      fechaDiligenciamiento: this.FechaFormulario,
      //empresa: obj.empresa.toString(),
      tipoSolicitud: obj.tipoSolicitud,
      tipoPago: obj.tipoPago,
      claseTercero: obj.claseTercero,
      categoriaTercero: obj.categoriaTercero.toString(),
      nombreRazonSocial: obj.nombreRazonSocial,
      estadoCivil: obj.estadoCivil,
      conyugeIdentificacion: obj.conyugeIdentificacion,
      tipoIdentificacion: obj.tipoIdentificacion,
      numeroIdentificacion: obj.numeroIdentificacion,
      digitoVarificacion: obj.digitoVarificacion,
      pais: obj.pais,
      Ciudad: obj.ciudad,
      tamanoTercero: obj.tamanoTercero,
      ActividadEconomicatab1: obj.actividadEconimoca,
      DireccionPrincipal: obj.direccionPrincipal,
      CodigoPostalTab1: obj.codigoPostal,
      CorreoElectronicoTab1: obj.correoElectronico,
      TelefornoTab1: obj.telefono,
      ObligadoFacturarElectronicatab1: obj.obligadoFE,
      correoElectronicoFE: obj.correoElectronicoFE,
      TieneSucursalesOtrosPaisestab1: obj.tieneSucursalesOtrosPaises,
      PaisesOtrasSucursalestab1: paisesOtrasSucursalesArray,
      basc: obj.certBASC,
      oea: obj.certOEA,
      ctpat: obj.certCTPAT,
      otros: obj.certOtros,
      ninguno: obj.certNinguno,
      preguntasAdicionales: {
        vinculadoPep: preguntasAdicionales.vinculadoPep,
        ManejaRecursos: preguntasAdicionales.ManejaRecursos,
        CualesRecursos: preguntasAdicionales.CualesRecursos,
        PoderPolitico: preguntasAdicionales.PoderPolitico,
        RamaPoderPublico: preguntasAdicionales.RamaPoderPublico,
        CargoPublico: preguntasAdicionales.CargoPublico,
        CualCargoPublico: preguntasAdicionales.CualCargoPublico,
        ObligacionTributaria: preguntasAdicionales.ObligacionTributaria,
        PaisesObligacionTributaria: preguntasAdicionales.PaisesObligacionTributaria,
        CuentasFinancierasExt: preguntasAdicionales.CuentasFinancierasExt,
        PaisesCuentasExt: preguntasAdicionales.PaisesCuentasExt,
        TienePoderCuentaExtranjera: preguntasAdicionales.TienePoderCuentaExtranjera,
        PaisesPoderCuentaExtranjera: preguntasAdicionales.PaisesPoderCuentaExtranjera,
        hasidoPep2: preguntasAdicionales.hasidoPep2,
        Tienevinculosmas5: preguntasAdicionales.Tienevinculosmas5,
        InfoFamiliaPep: preguntasAdicionales.InfoFamiliaPep,
      }
    });

    if (obj.tipoIdentificacion === 3) {
      this.formulario.get('digitoVarificacion')?.setValue(obj.digitoVarificacion || '');
    }
    this.adjustValidators(preguntasAdicionales.vinculadoPep.toString(), obj.categoriaTercero.toString());

    this.initializeCargosPublicos(preguntasAdicionales.cargosPublicos);
    this.initializeVinculosmas(preguntasAdicionales.Vinculosmas);
    this.initializeInfoFamilia(preguntasAdicionales.InfoFamiliaPep);

    this.internalservicet.setIdClaseTercero(obj.claseTercero);
  }


  private adjustValidators(vinculadoPep: string, categoriaTercero: string): void {
    const preguntasAdicionales = this.formulario.get('preguntasAdicionales') as FormGroup;

    if ((categoriaTercero === '3') && (vinculadoPep === '1')) {
      preguntasAdicionales.get('ManejaRecursos')?.clearValidators();
      preguntasAdicionales.get('CualesRecursos')?.clearValidators();
      preguntasAdicionales.get('PoderPolitico')?.clearValidators();
      preguntasAdicionales.get('RamaPoderPublico')?.clearValidators();
      preguntasAdicionales.get('CargoPublico')?.clearValidators();
      preguntasAdicionales.get('CualCargoPublico')?.clearValidators();
      preguntasAdicionales.get('ObligacionTributaria')?.clearValidators();
      preguntasAdicionales.get('PaisesObligacionTributaria')?.clearValidators();
      preguntasAdicionales.get('CuentasFinancierasExt')?.clearValidators();
      preguntasAdicionales.get('PaisesCuentasExt')?.clearValidators();
      preguntasAdicionales.get('TienePoderCuentaExtranjera')?.clearValidators();
      preguntasAdicionales.get('PaisesPoderCuentaExtranjera')?.clearValidators();
      preguntasAdicionales.get('hasidoPep2')?.clearValidators();
      preguntasAdicionales.get('Tienevinculosmas5')?.clearValidators();
      preguntasAdicionales.get('InfoFamiliaPep')?.clearValidators();
      // Actualizar estado de validación
      Object.keys(preguntasAdicionales.controls).forEach(key => {
        preguntasAdicionales.get(key)?.updateValueAndValidity();
      });

    } else if ((categoriaTercero === '3') && (vinculadoPep === '0')) {
      // Si vinculadoPep es 0, eliminar validadores
      const camposAdicionales = ['ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico', 'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria', 'PaisesObligacionTributaria', 'CuentasFinancierasExt', 'PaisesCuentasExt', 'TienePoderCuentaExtranjera', 'PaisesPoderCuentaExtranjera', 'hasidoPep2', 'InfoFamiliaPep', 'Tienevinculosmas5'];
      camposAdicionales.forEach(campo => {
        preguntasAdicionales.get(campo)?.clearValidators();
        preguntasAdicionales.get(campo)?.updateValueAndValidity();

      });
    } else {
      const camposAdicionales = ['vinculadoPep', 'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico', 'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria', 'PaisesObligacionTributaria', 'CuentasFinancierasExt', 'PaisesCuentasExt', 'TienePoderCuentaExtranjera', 'PaisesPoderCuentaExtranjera', 'hasidoPep2', 'InfoFamiliaPep', 'Tienevinculosmas5'];
      camposAdicionales.forEach(campo => {
        preguntasAdicionales.get(campo)?.clearValidators();
        preguntasAdicionales.get(campo)?.updateValueAndValidity();

      });
    }

  }

  private adjustValidators2(vinculadoPep: string): void {
    const preguntasAdicionales = this.formulario.get('preguntasAdicionales') as FormGroup;

    if (vinculadoPep === '1') {
      preguntasAdicionales.get('ManejaRecursos')?.clearValidators();
      preguntasAdicionales.get('CualesRecursos')?.clearValidators();
      preguntasAdicionales.get('PoderPolitico')?.clearValidators();
      preguntasAdicionales.get('RamaPoderPublico')?.clearValidators();
      preguntasAdicionales.get('CargoPublico')?.clearValidators();
      preguntasAdicionales.get('CualCargoPublico')?.clearValidators();
      preguntasAdicionales.get('ObligacionTributaria')?.clearValidators();
      preguntasAdicionales.get('PaisesObligacionTributaria')?.clearValidators();
      preguntasAdicionales.get('CuentasFinancierasExt')?.clearValidators();
      preguntasAdicionales.get('PaisesCuentasExt')?.clearValidators();
      preguntasAdicionales.get('TienePoderCuentaExtranjera')?.clearValidators();
      preguntasAdicionales.get('PaisesPoderCuentaExtranjera')?.clearValidators();
      preguntasAdicionales.get('hasidoPep2')?.clearValidators();
      preguntasAdicionales.get('Tienevinculosmas5')?.clearValidators();
      preguntasAdicionales.get('InfoFamiliaPep')?.clearValidators();
      // Actualizar estado de validación
      Object.keys(preguntasAdicionales.controls).forEach(key => {
        preguntasAdicionales.get(key)?.updateValueAndValidity();
      });

    } else {
      const camposAdicionales = ['vinculadoPep', 'ManejaRecursos', 'CualesRecursos', 'PoderPolitico', 'RamaPoderPublico', 'CargoPublico', 'CualCargoPublico', 'ObligacionTributaria', 'PaisesObligacionTributaria', 'CuentasFinancierasExt', 'PaisesCuentasExt', 'TienePoderCuentaExtranjera', 'PaisesPoderCuentaExtranjera', 'hasidoPep2', 'InfoFamiliaPep', 'Tienevinculosmas5'];
      camposAdicionales.forEach(campo => {
        preguntasAdicionales.get(campo)?.clearValidators();
        preguntasAdicionales.get(campo)?.updateValueAndValidity();

      });
    }


  }



  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id: [0],
      IdFormulario: [],
      fechaDiligenciamiento: [{ value: this.FechaFormulario, disabled: true }],
      //empresa: ['-1', [Validators.required, noSeleccionadoValidator()]],
      tipoSolicitud: ['-1', [Validators.required, noSeleccionadoValidator()]],
      tipoPago: [null],
      claseTercero: ['-1', [Validators.required, noSeleccionadoValidator()]],
      categoriaTercero: ['-1', [Validators.required, noSeleccionadoValidator()]],
      estadoCivil: [''],
      conyugeIdentificacion: [''],
      nombreRazonSocial: ['', [Validators.required]],
      tipoIdentificacion: ['-1', [Validators.required, noSeleccionadoValidator()]],
      numeroIdentificacion: ['', [Validators.required]],
      digitoVerificacion: [''],
      pais: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Ciudad: ['', [Validators.required]],
      tamanoTercero: ['-1', [Validators.required, noSeleccionadoValidator()]],
      ActividadEconomicatab1: ['-1', [Validators.required, noSeleccionadoValidator()]],
      DireccionPrincipal: ['', [Validators.required]],
      CodigoPostalTab1: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      CorreoElectronicoTab1: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/)]],
      TelefornoTab1: ['', [Validators.required, Validators.pattern(/^[0-9]*$/)]],
      ObligadoFacturarElectronicatab1: ['-1', [Validators.required, noSeleccionadoValidator()]],
      correoElectronicoFE: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      TieneSucursalesOtrosPaisestab1: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesOtrasSucursalestab1: [[], [Validators.required, noSeleccionadoValidator()]],
      basc: [false],
      oea: [false],
      ctpat: [false],
      otros: [false],
      ninguno: [false],
      preguntasAdicionales: this.fb.group({
        vinculadoPep: ['-1'],
        ManejaRecursos: ['-1'],
        CualesRecursos: ['', Validators.required],
        PoderPolitico: ['-1'],
        RamaPoderPublico: [''],
        CargoPublico: ['-1'],
        CualCargoPublico: [''],
        ObligacionTributaria: ['-1'],
        PaisesObligacionTributaria: [[]],
        CuentasFinancierasExt: ['-1'],
        PaisesCuentasExt: [[]],
        TienePoderCuentaExtranjera: ['-1'],
        PaisesPoderCuentaExtranjera: [[], [Validators.required]],
        hasidoPep2: ['-1'],
        cargosPublicos: this.fb.array([]),
        Tienevinculosmas5: ['-1'],
        Vinculosmas: this.fb.array([]),
        InfoFamiliaPep: this.fb.array([])
      })
    });
    this.formulario.get('preguntasAdicionales.vinculadoPep')?.valueChanges.subscribe(value => {
      this.adjustValidators2(value.toString());
    });
    //this.disableAdditionalQuestions();
  }


  initializeCargosPublicos(cargos: any[]): void {
    const cargosPublicos = this.getCargosPublicos();
    cargos.forEach(cargo => {
      cargosPublicos.push(this.fb.group({
        NombreEntidad: [cargo.NombreEntidad, Validators.required],
        FechaIngreso: [cargo.FechaIngreso, Validators.required],
        FechaDesvinculacion: [cargo.FechaDesvinculacion]
      }));
    });
  }

  initializeVinculosmas(vinculos: any[]): void {
    const vinculosMas = this.getVinculomas5();
    vinculos.forEach(vinculo => {
      vinculosMas.push(this.fb.group({
        NombreCompleto: [vinculo.NombreCompleto, Validators.required],
        TipoIdentificacion: [vinculo.TipoIdentificacion, Validators.required],
        NumeroIdentificacion: [vinculo.NumeroIdentificacion, Validators.required],
        Pais: [vinculo.Pais, Validators.required],
        PorcentajeParticipacion: [vinculo.PorcentajeParticipacion, [Validators.required, Validators.min(0), Validators.max(100)]]
      }));
    });
  }

  initializeInfoFamilia(familia: any[]): void {
    const infoFamilia = this.getInfoFamiliar();
    familia.forEach(member => {
      infoFamilia.push(this.fb.group({
        NombreCompleto: [member.NombreCompleto, Validators.required],
        TipoIdentificacion: [member.TipoIdentificacion, Validators.required],
        NumeroIdentificacion: [member.NumeroIdentificacion, Validators.required],
        Nacionalidad: [member.Nacionalidad, Validators.required],
        CargoContacto: [member.CargoContacto, Validators.required],
        FechaNombramiento: [member.FechaNombramiento, Validators.required],
        FechaFinalizacion: [member.FechaFinalizacion, Validators.required],
        VinculoFamiliar: [member.VinculoFamiliar, Validators.required]
      }));
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

  public get categoriaTerceroValue(): number | null {
    return this.formulario
      ?.get('categoriaTercero')
      ?.value ?? null;
  }
  esFormularioValido() {
    return this.formulario.valid;
  }


  marcarFormularioComoTocado(): void {
    this.markAllAsTouched(this.formulario);
  }

  private markAllAsTouched(formGroup: FormGroup | FormArray): void {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }



  private initializeFormSubscriptions(): void {
    // Suscripción al cambio en el valor de 'pais'
    this.formulario.get('pais')?.valueChanges.subscribe((valorPais) => {
      if (valorPais !== '43') {
        this.formulario.get('tamanoTercero')?.clearValidators();
        this.formulario.get('ActividadEconomicatab1')?.clearValidators();
        this.formulario.get('ObligadoFacturarElectronicatab1')?.clearValidators();
      } else {
        this.formulario.get('tamanoTercero')?.setValidators([Validators.required, noSeleccionadoValidator()]);
        this.formulario.get('ActividadEconomicatab1')?.setValidators([Validators.required, noSeleccionadoValidator()]);
        this.formulario.get('ObligadoFacturarElectronicatab1')?.setValidators([Validators.required, noSeleccionadoValidator()]);
      }
      this.formulario.get('tamanoTercero')?.updateValueAndValidity();
      this.formulario.get('ActividadEconomicatab1')?.updateValueAndValidity();
      this.formulario.get('ObligadoFacturarElectronicatab1')?.updateValueAndValidity();

    });

    this.formulario.get('ObligadoFacturarElectronicatab1')?.valueChanges.subscribe((valorPais) => {
      if (valorPais !== '1') {
        this.formulario.get('correoElectronicoFE')?.clearValidators();
      } else {
        this.formulario.get('correoElectronicoFE')?.setValidators([Validators.required]);
      }
      this.formulario.get('correoElectronicoFE')?.updateValueAndValidity();
    });



    this.formulario.get('TieneSucursalesOtrosPaisestab1')?.valueChanges.subscribe((valorPais) => {
      if (valorPais !== '1') {
        this.formulario.get('PaisesOtrasSucursalestab1')?.clearValidators();
      } else {
        this.formulario.get('PaisesOtrasSucursalestab1')?.setValidators([Validators.required]);
      }
      this.formulario.get('PaisesOtrasSucursalestab1')?.updateValueAndValidity();
    });


    // Suscripción al cambio en el valor de 'claseTercero'
    this.formulario.get('claseTercero')?.valueChanges.subscribe((value) => {
      this.tabdespachos = (value.toString() === '1');
      this.emitirCambioDeVisibilidad();
    });



    this.formulario.get('claseTercero')?.valueChanges.subscribe((value) => {
      this.tabPrinProvAndClient = (value === '2');
      this.emitirCambioDeVisibilidad();
    });

    this.formulario.get('claseTercero')?.valueChanges.subscribe((value) => {
      this.tabIsAliado = (value === '3');
      this.emitirCambioDeVisibilidad();
    });

    this.formulario.get('categoriaTercero')?.valueChanges.subscribe((value) => {
      this.updateAdditionalQuestionsValidators(value);
      this.tabRepresentanteLegal = (value.toString() !== '3');
      this.emitirCambioDeVisibilidad();
    });

    this.formulario.get('pais')?.valueChanges.subscribe((value) => {
      this.tabInformacionTriburaria = (value.toString() === '43');
      this.emitirCambioDeVisibilidad();
    });


    this.formulario.get('claseTercero')?.valueChanges.subscribe((value) => {
      this.idTipoTerceroChange.emit({ idClaseTercero: value });
    });

  }

  private emitirCambioDeVisibilidad(): void {
    this.tabVisibilityChange.emit({
      tabDespachos: this.tabdespachos,
      tabRepresentanteLegal: this.tabRepresentanteLegal,
      tabInformacionTriburaria: this.tabInformacionTriburaria,
      tabPrinProvAndClient: this.tabPrinProvAndClient,
      tabIsAliado: this.tabIsAliado,
      tabAccionistas: this.tabAccionistas,
      tabDeclaraciones: this.tabDeclaraciones,
      tabInfoFinanciera: this.tabInfoFinanciera,
      tabRevisorFiscal: this.tabRevisorFiscal,
      tabtabInformacionTriburaria: this.tabtabInformacionTriburaria,
      tabInformacionComplementaria: this.tabInformacionComplementaria,
      tabConflictoInteres: this.tabConflictoInteres,
      tabReferenciasBancarias: this.tabReferenciasBancarias,
      tabCumplimientoNormativo: this.tabCumplimientoNormativo,
      tabDatosRevisorFiscal: this.tabDatosRevisorFiscal,
      tabDatosdeContacto: this.tabDatosdeContacto,
      tabDatosdepagos: this.tabDatosdepagos
      

    });
  }

  private getFechaActual(): string {
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio = fechaActual.getFullYear();
    return `${anio}-${mes}-${dia}`;
  }


  alMenosUnoSeleccionado(group: FormGroup): { [key: string]: any } | null {
    const { ambas, ekoRed, enka } = group.value;
    return ambas || ekoRed || enka ? null : { requerido: true };
  }

  // Método para enviar el formulario
  enviarFormulario(): void {
    if (this.formulario.valid) {
      console.log('Datos del formulario:', this.formulario.value);
      // Aquí podrías enviar los datos al backend, por ejemplo
    } else {
      console.log('Formulario no válido');
      this.formulario.markAllAsTouched(); // Muestra los errores
    }
  }

  submit() {

    const formValue = this.obtenerDatosFormulario();
    console.log(JSON.stringify(formValue, null, 2));

    this.logInvalidControls(this.formulario);



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

  obtenerDatosFormulario(isValidSave: boolean = false): any {
    if (isValidSave) {
      return this.formulario.getRawValue();
    } else {
      const formularioValores = this.formulario.value;
      return {
        ...formularioValores,
        PaisesOtrasSucursalestab1: this.getPaisesOtrasSucursales()
      };
    }
  }

  private logInvalidControlsRecursive(
    form: FormGroup | FormArray,
    parentName: string = ''
  ) {
    Object.keys(form.controls).forEach(controlName => {
      const control = form.get(controlName);
      const fullPath = parentName ? `${parentName}.${controlName}` : controlName;
  
      if (control instanceof FormGroup || control instanceof FormArray) {
        if (control.invalid) {
          console.warn('Grupo/Array inválido:', fullPath, 'errors:', control.errors);
        }
        this.logInvalidControlsRecursive(control, fullPath);
      } else if (control && control.invalid) {
        console.error('Control inválido:', fullPath, 'errors:', control.errors);
      }
    });
  }
  
  

  obtenerCamposInvalidos() {
    this.logInvalidControlsRecursive(this.formulario, 'DatosGenerales');
    const camposInvalidos = [];
    const controles = this.formulario.controls;
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


  Generarpdf() {




    const DATA: any = document.getElementById('datosgenerales');



    html2canvas(DATA).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      // Crear un PDF en orientación vertical, tamaño A4
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Medidas de la página y del contenido
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Agregar la imagen generada desde el canvas al PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Descargar el PDF con el nombre especificado
      pdf.save('documento.pdf');
    });

  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.formulario.disable();
    // this.deshabilitarFormulario(this.formulario);

    this.cdr.detectChanges();
  }

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('datosgenerales');

    return DATA;
  }

  onPaisesChange(selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.formulario.get('PaisesOtrasSucursalestab1')?.setValue(paises);
  }

  getPaisesOtrasSucursales(): string {
    const paises = this.formulario.get('PaisesOtrasSucursalestab1')?.value;
    return paises ? paises.join(', ') : '';
  }


  private setupValueChanges(): void {
    this.formulario.get('categoriaTercero')?.valueChanges.subscribe(value => {
      this.updateAdditionalQuestionsValidators(value);
    });
  }

  private updateAdditionalQuestionsValidators(value: string): void {
    const preguntasAdicionales = this.formulario.get('preguntasAdicionales') as FormGroup;
    if (value === '3') {
      Object.keys(preguntasAdicionales.controls).forEach(key => {
        preguntasAdicionales.get(key)?.setValidators(this.getValidatorsForQuestion(key));
        preguntasAdicionales.get(key)?.updateValueAndValidity();
      });
    } else {
      this.disableAdditionalQuestions();
    }
  }

  private disableAdditionalQuestions(): void {
    const preguntasAdicionales = this.formulario.get('preguntasAdicionales') as FormGroup;
    Object.keys(preguntasAdicionales.controls).forEach(key => {
      const control = preguntasAdicionales.get(key);

      if (control instanceof FormArray) {
        // Limpiar el FormArray
        while (control.length) {
          control.removeAt(0);
        }
      } else {
        control?.setValue('-1');
        control?.clearValidators();
      }

      control?.updateValueAndValidity();
    });
  }


  private getValidatorsForQuestion(key: string): any {
    if (key === 'cargosPublicos' || key === 'Vinculosmas' || key === 'InfoFamiliaPep') {
      return []; // Customize validators for these if needed
    }
    return [Validators.required, noSeleccionadoValidator()];
  }


  onPaisesObligacionTributariaChange(selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.formulario.get('preguntasAdicionales')?.get('PaisesObligacionTributaria')?.setValue(paises);
  }



  onPaisesCuentasExtChange(selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.formulario.get('preguntasAdicionales')?.get('PaisesCuentasExt')?.setValue(paises);
  }

  onPaisesPoderCuentaExtranjeraChange(selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.formulario.get('preguntasAdicionales')?.get('PaisesPoderCuentaExtranjera')?.setValue(paises);
  }


  get cargosPublicos(): FormArray {
    return this.formulario.get('preguntasAdicionales')?.get('cargosPublicos') as FormArray;
  }

  get vinculosMas(): FormArray {
    return this.formulario.get('preguntasAdicionales')?.get('Vinculosmas') as FormArray;
  }

  get infoFamilia(): FormArray {
    return this.formulario.get('preguntasAdicionales')?.get('InfoFamiliaPep') as FormArray;
  }

  getCargosPublicos(): FormArray {
    return this.formulario.get('preguntasAdicionales')?.get('cargosPublicos') as FormArray;
  }

  getVinculomas5(): FormArray {
    return this.formulario.get('preguntasAdicionales')?.get('Vinculosmas') as FormArray;
  }

  getInfoFamiliar(): FormArray {
    return this.formulario.get('preguntasAdicionales')?.get('InfoFamiliaPep') as FormArray;
  }


  addCargoPublico(): void {
    this.cargosPublicos.push(this.fb.group({
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
      FechaDesvinculacion: ['']
    }));
  }

  removeCargoPublico(index: number): void {
    this.cargosPublicos.removeAt(index);
  }

  addVinculomas5(): void {
    this.vinculosMas.push(this.fb.group({
      NombreCompleto: ['', Validators.required],
      TipoIdentificacion: ['-1', Validators.required],
      NumeroIdentificacion: ['', Validators.required],
      Pais: ['-1', Validators.required],
      PorcentajeParticipacion: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    }));
  }

  removeVinculomas5(index: number): void {
    this.vinculosMas.removeAt(index);
  }



  addInfoFamilia() {
    this.infoFamilia.push(
      this.fb.group({
        NombreCompleto: ['', Validators.required],
        TipoIdentificacion: ['-1', [Validators.required, noSeleccionadoValidator()]],
        NumeroIdentificacion: ['', Validators.required],
        Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
        CargoContacto: ['', Validators.required],
        FechaNombramiento: ['', Validators.required],
        FechaFinalizacion: ['', Validators.required],
        VinculoFamiliar: ['', Validators.required],
      }));
  }


  removeInfoFamilia(index: number): void {
    this.infoFamilia.removeAt(index);
  }


  logInvalidControls(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.get(controlName);
      if (control instanceof FormControl && control.invalid) {
        console.log(`Control Name: ${controlName}, Error: ${JSON.stringify(control.errors)}`);
      } else if (control instanceof FormGroup) {
        this.logInvalidControls(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach((arrayControl, index) => {
          if (arrayControl instanceof FormGroup) {
            this.logInvalidControls(arrayControl);
          } else if (arrayControl.invalid) {
            console.log(`Array Control Name: ${controlName}[${index}], Error: ${JSON.stringify(arrayControl.errors)}`);
          }
        });
      }
    });
  }


}


