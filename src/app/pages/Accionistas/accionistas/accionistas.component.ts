import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ServicioPrincipalService } from '../../Services/main.services';
import { TranslateService } from '@ngx-translate/core';
import { BeneficiarioFinalComponent } from '../../BeneficiarioFinal/beneficiario-final/beneficiario-final.component';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-accionistas',
  templateUrl: './accionistas.component.html',
  styleUrl: './accionistas.component.scss'
})
export class AccionistasComponent implements OnInit {

  Lang: string = 'es';
  @ViewChild(BeneficiarioFinalComponent) ComponenteBeneficiarioFinal: BeneficiarioFinalComponent;
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
  @Input() editable: boolean;
  Accionistas: FormGroup;

  private originalValidators: { [key: string]: any } = {};



  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService, private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.Accionistas = this.fb.group({
      TieneFigura: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Accionista: this.fb.array([], Validators.required)
    });

    this.Accionistas.get('TieneFigura')?.valueChanges.subscribe(value => {
      this.actualizarValidadoresDirectivos(value);
    });
  }

  actualizarValidadoresDirectivos(tieneFigura: string): void {
    const directivosControl = this.Accionistas.get('Accionista');
    if (tieneFigura === '0') {
      directivosControl?.clearValidators();
    } else {
      directivosControl?.setValidators([Validators.required]);
    }
    directivosControl?.updateValueAndValidity();
  }


  getBeneficiariosFinales(index: number): any[] {
    const accionistaControl = this.accionistaArray.at(index).get('BeneficiariosFinales') as FormArray;

    if (accionistaControl) {
      const beneficiarios = accionistaControl.controls.map((control: AbstractControl) => {
        return (control as FormGroup).value;
      });
      return beneficiarios;
    }

    return [];
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.Accionistas.disable()
    if (this.ComponenteBeneficiarioFinal !== undefined) {
      this.ComponenteBeneficiarioFinal.Desabilitacamposdespuesdeenvio();
      this.ComponenteBeneficiarioFinal.IdEstadoFormulario = 3;
    }

    this.IdEstadoFormulario = 3;

    this.cdr.detectChanges(); //


  }


  ngOnInit(): void {

    Object.keys(this.Accionistas.controls).forEach(key => {
      const control = this.Accionistas.get(key);
      this.originalValidators[key] = control?.validator;
    });

    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.ConsultaAccionistas();
    }
  }

  verificarSiFormularioEnviado(): boolean {
    // Implementa la lógica para verificar si el formulario está en estado enviado
    // Por ejemplo, podrías verificar una propiedad en el servicio o en el estado del componente
    return true; // Simulación: el formulario está enviado
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

  ConsultaAccionistas() {
    this.serviciocliente.cosultaAccionistas(this.IdFormulario).subscribe(data => {

      if (data) {
        this.loadAccionistas(data);

        this.actualizarValidadoresDirectivos(data.TieneFigura.toString());


        if (!this.editable) {
          this.Accionistas.disable();
        }
      }
    });

  }

  get accionistaArray(): FormArray {
    return this.Accionistas.get('Accionista') as FormArray;
  }

  get accionista() {
    return this.Accionistas.get('Accionista') as FormArray;
  }

  addAccionista() {
    const representanteForm = this.crearAccionista();
    this.accionista.push(representanteForm);
    this.listenVinculadoPep(representanteForm);


    representanteForm.get('tipoDocumento')?.valueChanges.subscribe(value => {
      if (value === '3') {
        this.resetControls2(representanteForm);
        this.inicializaControlessiesPersonaJuridica(representanteForm);
      }

    });


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

    representanteForm.get('tipoDocumento')?.valueChanges.subscribe(value => {
      if (value === '3') {
        this.resetControls2(representanteForm);
        this.inicializaControlessiesPersonaJuridica(representanteForm);
        representanteForm.get('CotizaEnBolsa')?.setValidators([Validators.required, noSeleccionadoValidator()]);
        representanteForm.get('CotizaEnBolsa')?.updateValueAndValidity();

      } else {
        representanteForm.get('CotizaEnBolsa')?.clearValidators();
        representanteForm.get('CotizaEnBolsa')?.setValue('-1');
        representanteForm.get('CotizaEnBolsa')?.updateValueAndValidity();
      }
    });

    const porcentajeControl = representanteForm.get('Porcentajeparticipacion');
    porcentajeControl?.valueChanges.subscribe(() => {
      this.accionistaArray.controls.forEach(c => {
        c.get('Porcentajeparticipacion')?.updateValueAndValidity({ emitEvent: false });
      });
    });

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

  resetControls2(representanteForm: FormGroup) {
    const cargosPublicosArray = representanteForm.get('cargosPublicos') as FormArray;
    cargosPublicosArray.clear();
    const vinculosMasArray = representanteForm.get('Vinculosmas') as FormArray;
    vinculosMasArray.clear();
    const infoFamiliaPepArray = representanteForm.get('InfoFamiliaPep') as FormArray;
    infoFamiliaPepArray.clear();
    representanteForm.patchValue({
      vinculadoPep: '-1',
      ManejaRecursos: '-1',
      CualesRecursos: '',
      PoderPolitico: '-1',
      RamaPoderPublico: '',
      CargoPublico: '-1',
      CualCargoPublico: '',
      ObligacionTributaria: '-1',
      PaisesObligacionTributaria: '-1',
      CuentasFinancierasExt: '-1',
      PaisesCuentasExt: '-1',
      TienePoderCuentaExtranjera: '-1',
      PaisesPoderCuentaExtranjera: '-1',
      hasidoPep2: '-1',
      Tienevinculosmas5: '-1',
    });
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

  private inicializaControlessiesPersonaJuridica(representanteForm: FormGroup) {
    representanteForm.get('vinculadoPep')?.clearValidators();
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

    representanteForm.get('vinculadoPep')?.updateValueAndValidity();
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


  removeAccionista(index: number) {
    this.accionista.removeAt(index);
  }

  crearAccionista(): FormGroup {
    return this.fb.group({
      NombreCompleto: ['', Validators.required],
      tipoDocumento: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Porcentajeparticipacion: ['', [Validators.required, this.percentageValidator.bind(this)]],
      Domicilio: [''],
      vinculadoPep: ['-1', [Validators.required, noSeleccionadoValidator()]],
      ManejaRecursos: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      RamaPoderPublico: ['', Validators.required],
      CargoPublico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualCargoPublico: ['', Validators.required],
      ObligacionTributaria: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesObligacionTributaria: [[], Validators.required],
      CuentasFinancierasExt: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesCuentasExt: [[], [Validators.required, noSeleccionadoValidator()]],
      TienePoderCuentaExtranjera: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesPoderCuentaExtranjera: [[], [Validators.required, noSeleccionadoValidator()]],
      hasidoPep2: ['-1', [Validators.required, noSeleccionadoValidator()]],
      cargosPublicos: this.fb.array([]),
      Tienevinculosmas5: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Vinculosmas: this.fb.array([]),
      InfoFamiliaPep: this.fb.array([], Validators.required),
      BeneficiariosFinales: this.fb.array([]),
      CotizaEnBolsa: ['-1', [Validators.required, noSeleccionadoValidator()]],
      //cargosPublicos: this.fb.array([this.crearcargospublicos()]) // Array de ca// Array de cargos públicos
    });
  }

  actualizarBeneficiarioFinal(index: number, formularioBeneficiario: FormGroup) {
    const beneficiariosArray = this.accionista.at(index).get('BeneficiariosFinales') as FormArray;

    if (beneficiariosArray && formularioBeneficiario instanceof FormGroup) {
      const nuevoBeneficiarioArray = formularioBeneficiario.get('Beneficiario') as FormArray;

      if (nuevoBeneficiarioArray) {
        beneficiariosArray.clear();
        nuevoBeneficiarioArray.controls.forEach(control => {
          beneficiariosArray.push(control);
        });
      }
    } else {
      console.error("El formulario recibido no es un FormGroup o el array de beneficiarios no existe.");
    }
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

  getCargosPublicos(representanteIndex: number): FormArray {
    return this.accionista.at(representanteIndex).get('cargosPublicos') as FormArray;
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
      NombreCompleto: [''],
      TipoIdentificacion: ['-1'],
      NumeroIdentificacion: [''],
      Pais: ['-1'],
      PorcentajeParticipacion: [''],
      Docimicilio: [''],

    });
    vinculosmas5.push(vinculosmas5Form);
  }

  getVinculomas5(vinculomas5Index: number): FormArray {
    return this.accionista.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.accionista.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
  }

  addInfoFamilia(representanteIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    const InfoFamiliaForm = this.fb.group({
      NombreCompleto: [''],
      TipoIdentificacion: ['-1'],
      NumeroIdentificacion: [''],
      Nacionalidad: ['-1'],
      CargoContacto: [''],
      FechaNombramiento: [''],
      FechaFinalizacion: [''],
      Domicilio: [''],
      CotizaEnBolsa: ['-1'],
      VinculoFamiliar: [''],

    });
    InfoFamilia.push(InfoFamiliaForm);
  }

  removeInfoFamilia(representanteIndex: number, FamilairIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    InfoFamilia.removeAt(FamilairIndex);
  }


  // Enviar el formulario completo
  submit() {
    // if (this.Accionistas.valid) {
    const formValue = this.Accionistas.value; // Obtiene el valor del formulario
    //console.log(JSON.stringify(formValue,null,2));
    const esvalido = this.Accionistas.valid;

    console.log('el formulario es valido?:' + esvalido);

    this.marcarFormularioComoTocado();
    if (this.ComponenteBeneficiarioFinal !== undefined) {
      this.ComponenteBeneficiarioFinal.marcarFormularioComoTocado();
    }
  }

  createAccionista(accionista: any): FormGroup {

    const PaisesObligacionTributariaArray = typeof accionista.PaisesObligacionTributaria === 'string' && accionista.PaisesObligacionTributaria.trim() !== ''
      ? accionista.PaisesObligacionTributaria.split(',').map((pais: string) => pais.trim())
      : [];


    const PaisesPaisesCuentasExtArray = typeof accionista.PaisesCuentasExt === 'string' && accionista.PaisesCuentasExt.trim() !== ''
      ? accionista.PaisesCuentasExt.split(',').map((pais: string) => pais.trim())
      : [];

    const PaisesPoderCuentaExtranjeraArray = typeof accionista.PaisesPoderCuentaExtranjera === 'string' && accionista.PaisesPoderCuentaExtranjera.trim() !== ''
      ? accionista.PaisesPoderCuentaExtranjera.split(',').map((pais: string) => pais.trim())
      : [];


    return this.fb.group({
      NombreCompleto: [accionista.NombreCompleto || '', Validators.required],
      tipoDocumento: [accionista.tipoDocumento || '', Validators.required],
      NumeroIdentificacion: [accionista.NumeroIdentificacion || ''],
      Nacionalidad: [accionista.Nacionalidad || ''],
      Porcentajeparticipacion: [accionista.Porcentajeparticipacion || 0],
      Domicilio: [accionista.Domicilio || ''],
      vinculadoPep: [accionista.vinculadoPep || ''],
      ManejaRecursos: [accionista.ManejaRecursos || ''],
      CualesRecursos: [accionista.CualesRecursos || ''],
      PoderPolitico: [accionista.PoderPolitico || ''],
      RamaPoderPublico: [accionista.RamaPoderPublico || ''],
      CargoPublico: [accionista.CargoPublico || ''],
      CualCargoPublico: [accionista.CualCargoPublico || ''],
      ObligacionTributaria: [accionista.ObligacionTributaria || ''],
      PaisesObligacionTributaria: [PaisesObligacionTributariaArray],
      CuentasFinancierasExt: [accionista.CuentasFinancierasExt || ''],
      PaisesCuentasExt: [PaisesPaisesCuentasExtArray],
      TienePoderCuentaExtranjera: [accionista.TienePoderCuentaExtranjera || ''],
      PaisesPoderCuentaExtranjera: [PaisesPoderCuentaExtranjeraArray],
      hasidoPep2: [accionista.hasidoPep2 || ''],
      cargosPublicos: this.fb.array(accionista.cargosPublicos ? accionista.cargosPublicos.map((c: any) => this.createCargo(c)) : []),
      Tienevinculosmas5: [accionista.Tienevinculosmas5 || ''],
      Vinculosmas: this.fb.array(accionista.Vinculosmas ? accionista.Vinculosmas.map((v: any) => this.createVinculo(v)) : []),
      InfoFamiliaPep: this.fb.array(accionista.InfoFamiliaPep ? accionista.InfoFamiliaPep.map((f: any) => this.createFamilia(f)) : []),
      BeneficiariosFinales: this.fb.array(accionista.BeneficiariosFinales ? accionista.BeneficiariosFinales.map((b: any) => this.createBeneficiario(b)) : [])
    });
  }

  createBeneficiariosFinales(beneficiariosFinales: any[]): FormArray {
    return this.fb.array(
      beneficiariosFinales ? beneficiariosFinales.map((b: any) => this.createBeneficiarioGroup(b.Beneficiario)) : []
    );
  }

  createBeneficiarioGroup(beneficiarioFinal: any): FormGroup {
    return this.fb.group({
      Beneficiario: this.fb.array(beneficiarioFinal.Beneficiario ? beneficiarioFinal.Beneficiario.map((b: any) => this.createBeneficiario(b)) : [])
    });
  }


  createBeneficiarioFinal(beneficiarioFinal: any): FormGroup {
    return this.fb.group({
      Beneficiario: this.fb.array(beneficiarioFinal.Beneficiario ? beneficiarioFinal.Beneficiario.map((b: any) => this.createBeneficiario(b)) : [])
    });
  }



  createBeneficiario(beneficiario: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [beneficiario.NombreCompleto, Validators.required],
      tipoDocumento: [beneficiario.tipoDocumento, Validators.required],
      NumeroIdentificacion: [beneficiario.NumeroIdentificacion, Validators.required],
      Nacionalidad: [beneficiario.Nacionalidad, Validators.required],
      Porcentajeparticipacion: [beneficiario.Porcentajeparticipacion],
      CotizaEnBolsa: [beneficiario.CotizaEnBolsa],
      vinculadoPep: [beneficiario.vinculadoPep],
      ManejaRecursos: [beneficiario.ManejaRecursos],
      CualesRecursos: [beneficiario.CualesRecursos],
      PoderPolitico: [beneficiario.PoderPolitico],
      RamaPoderPublico: [beneficiario.RamaPoderPublico],
      CargoPublico: [beneficiario.CargoPublico],
      CualCargoPublico: [beneficiario.CualCargoPublico],
      ObligacionTributaria: [beneficiario.ObligacionTributaria],
      PaisesObligacionTributaria: [beneficiario.PaisesObligacionTributaria],
      CuentasFinancierasExt: [beneficiario.CuentasFinancierasExt],
      PaisesCuentasExt: [beneficiario.PaisesCuentasExt],
      TienePoderCuentaExtranjera: [beneficiario.TienePoderCuentaExtranjera],
      PaisesPoderCuentaExtranjera: [beneficiario.PaisesPoderCuentaExtranjera],
      hasidoPep2: [beneficiario.hasidoPep2],
      cargosPublicos: this.fb.array(beneficiario.cargosPublicos ? beneficiario.cargosPublicos.map((c: any) => this.createCargo(c)) : []),
      Tienevinculosmas5: [beneficiario.Tienevinculosmas5],
      Vinculosmas: this.fb.array(beneficiario.Vinculosmas ? beneficiario.Vinculosmas.map((v: any) => this.createVinculo(v)) : []),
      InfoFamiliaPep: this.fb.array(beneficiario.InfoFamiliaPep ? beneficiario.InfoFamiliaPep.map((f: any) => this.createFamilia(f)) : [])
    });
  }


  createCargo(cargo: any): FormGroup {
    return this.fb.group({
      NombreEntidad: [cargo.NombreEntidad],
      FechaIngreso: [cargo.FechaIngreso],
      FechaDesvinculacion: [cargo.FechaDesvinculacion]
    });
  }

  createVinculo(vinculo: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [vinculo.NombreCompleto],
      TipoIdentificacion: [vinculo.TipoIdentificacion],
      NumeroIdentificacion: [vinculo.NumeroIdentificacion],
      Pais: [vinculo.Pais],
      PorcentajeParticipacion: [vinculo.PorcentajeParticipacion],
      Domiclio: [vinculo.Domiclio]
    });
  }

  createFamilia(familia: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [familia.NombreCompleto],
      TipoIdentificacion: [familia.TipoIdentificacion],
      NumeroIdentificacion: [familia.NumeroIdentificacion],
      Nacionalidad: [familia.Nacionalidad],
      FechaNombramiento: [familia.FechaNombramiento],
      FechaFinalizacion: [familia.FechaFinalizacion],
      Domicilio: [familia.Domicilio],
      CotizaEnBolsa: [familia.CotizaEnBolsa],
      CargoContacto: [familia.CargoContacto],
      VinculoFamiliar: [familia.VinculoFamiliar]
    });
  }

  // En tu componente AccionistasComponent
  percentageValidator(control: AbstractControl): ValidationErrors | null {
    const formArray = control.parent?.parent as FormArray;
    if (!formArray) return null;

    const currentValue = control.value !== null && control.value !== '' ? Number(control.value) : 0;
    let sumOthers = 0;

    formArray.controls.forEach((group: AbstractControl) => {
      const groupForm = group as FormGroup;
      if (groupForm === control.parent) return;
      const percControl = groupForm.get('Porcentajeparticipacion');
      const percValue = percControl && percControl.value !== null && percControl.value !== ''
        ? Number(percControl.value)
        : 0;
      sumOthers += percValue;
    });

    const maxAllowed = 100 - sumOthers;
    return currentValue > maxAllowed ? { exceedsMax: { maxAllowed } } : null;
  }
  loadAccionistas(data: any): void {

    const accionistasArray = this.accionistaArray;
    this.Accionistas.patchValue({
      TieneFigura: data.TieneFigura.toString()
    });
    data.Accionista.forEach((accionista: any) => {
      accionistasArray.push(this.createAccionista(accionista));
    });
  }

  removeValidators(): void {
    if (!this.Accionistas) {
      console.warn('Formulario no definido en RepresentanteLegalComponent');
      return;
    }
    Object.keys(this.Accionistas.controls).forEach(key => {
      const control = this.Accionistas.get(key);
      if (control) {
        control.clearValidators();
        control.clearAsyncValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  restoreValidators(): void {
    Object.keys(this.Accionistas.controls).forEach(key => {
      const control = this.Accionistas.get(key);
      if (control) {
        control.setValidators(this.originalValidators[key]);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }



  obtenerDatosFormulario(isValid: boolean): any {
    if (isValid) {
      this.Accionistas.markAllAsTouched();
    }

    const formularioValores = this.Accionistas.value;
    formularioValores.Accionista.forEach((representante: any) => {
      if (Array.isArray(representante.PaisesObligacionTributaria)) {
        representante.PaisesObligacionTributaria = representante.PaisesObligacionTributaria.join(', ');
      }
      if (Array.isArray(representante.PaisesCuentasExt)) {
        representante.PaisesCuentasExt = representante.PaisesCuentasExt.join(', ');
      }
      if (Array.isArray(representante.PaisesPoderCuentaExtranjera)) {
        representante.PaisesPoderCuentaExtranjera = representante.PaisesPoderCuentaExtranjera.join(', ');
      }
      if (representante.BeneficiariosFinales && representante.BeneficiariosFinales.length > 0) {
        representante.BeneficiariosFinales.forEach((beneficiario: any) => {
          if (Array.isArray(beneficiario.PaisesObligacionTributaria)) {
            beneficiario.PaisesObligacionTributaria = beneficiario.PaisesObligacionTributaria.join(', ');
          }
          if (Array.isArray(beneficiario.PaisesCuentasExt)) {
            beneficiario.PaisesCuentasExt = beneficiario.PaisesCuentasExt.join(', ');
          }
          if (Array.isArray(beneficiario.PaisesPoderCuentaExtranjera)) {
            beneficiario.PaisesPoderCuentaExtranjera = beneficiario.PaisesPoderCuentaExtranjera.join(', ');
          }
        });
      }
    });
    return formularioValores;
  }


  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('AccionistasDiv');

    return DATA;
  }

  obtenerCamposInvalidos(): any[] {
    const invalidFields: any[] = [];

    // Recorre el FormArray de representantes
    (this.accionista.controls as FormGroup[]).forEach((representanteGroup, representanteIndex) => {
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

  marcarFormularioComoTocado() {
    Object.values(this.accionista.controls).forEach(control => {
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

  esFormularioValido() {
    return this.Accionistas.valid;
  }

  onPaisesObligacionTributariaChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.accionista.at(index).get('PaisesObligacionTributaria')?.setValue(paises);
  }

  onPaisesCuentasExtChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.accionista.at(index).get('PaisesCuentasExt')?.setValue(paises);
  }

  onPaisesPoderCuentaExtranjeraChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.accionista.at(index).get('PaisesPoderCuentaExtranjera')?.setValue(paises);
  }


}


