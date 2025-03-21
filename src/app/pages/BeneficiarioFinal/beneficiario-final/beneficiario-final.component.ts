import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioPrincipalService } from '../../Services/main.services';
import { TranslateService } from '@ngx-translate/core';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-beneficiario-final',
  templateUrl: './beneficiario-final.component.html',
  styleUrl: './beneficiario-final.component.scss'
})
export class BeneficiarioFinalComponent  implements OnInit{
  Lang:string='es';
  @Input() IdEstadoFormulario: number;
  @Input() Listatiposolicitud: any[] ;
  @Input() ListaClaseTerceros: any[] ;
  @Input() ListaTipoDocumentos: any[] ;
  @Input() ListaSino: any[];
  @Input() ListaPaises: any[] ;
  @Input() ListaTamanoterceros: any[] ;
  @Input() ListaActividadesEco: any[] ;
  @Input() ListaCategoriaTerceros: any[];
  Beneficiarios: FormGroup;
  @Input() beneficiarios: any;
  @Input() editable:boolean;

  public formularioEnviado: boolean = false;

  @Output() formularioBeneficiarioFinal = new EventEmitter<FormGroup>();


  constructor(
    private fb: FormBuilder,
    private serviciocliente: ServicioPrincipalService,
    private translate: TranslateService,private cdr: ChangeDetectorRef
  ) {
    this.translate.setDefaultLang('es');
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
    this.Beneficiarios = this.fb.group({
      Beneficiario: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.beneficiarios) {
      this.setBeneficiarios(this.beneficiarios);
      if (!this.editable) {
            this.Beneficiarios.disable();        
      }
    }
    this.Beneficiarios.valueChanges.subscribe(() => {
        //this.formularioBeneficiarioFinal.emit(this.obtenerDatosFormulario());    

        this.formularioBeneficiarioFinal.emit(this.Beneficiarios);   
    });


  }

  obtenerDatosFormulario(): any {
    const formularioValores = this.Beneficiarios.value;
    formularioValores.Beneficiario.forEach((representante: any) => {
      if (Array.isArray(representante.PaisesObligacionTributaria)) {
        representante.PaisesObligacionTributaria = representante.PaisesObligacionTributaria.join(', ');
      }
      if (Array.isArray(representante.PaisesCuentasExt)) {
        representante.PaisesCuentasExt = representante.PaisesCuentasExt.join(', ');
      }
      if (Array.isArray(representante.PaisesPoderCuentaExtranjera)) {
        representante.PaisesPoderCuentaExtranjera = representante.PaisesPoderCuentaExtranjera.join(', ');
      }
      // Agrega otras conversiones de arrays a cadenas si es necesario
    });
    return formularioValores;
  }



  /*ngOnChanges(changes: SimpleChanges): void {
    if (changes['beneficiarios'] && changes['beneficiarios'].currentValue && changes['beneficiarios'].previousValue !== changes['beneficiarios'].currentValue) {
      this.setBeneficiarios(changes['beneficiarios'].currentValue);
    }
  */
  

  get beneficiarioArray(): FormArray {
    return this.Beneficiarios.get('Beneficiario') as FormArray;
  }
  setBeneficiarios(beneficiarios: any): void {
    this.beneficiarioArray.clear();
    beneficiarios.forEach((beneficiario: any) => {
      this.beneficiarioArray.push(this.createBeneficiario(beneficiario));
    });
    if(this.formularioEnviado)
    {
      this.beneficiarioArray.disable();
    }
    this.cdr.detectChanges();
  }
  createBeneficiario(beneficiario: any): FormGroup {    
    const PaisesObligacionTributariaArray = typeof beneficiario.PaisesObligacionTributaria === 'string' && beneficiario.PaisesObligacionTributaria.trim() !== ''
    ? beneficiario.PaisesObligacionTributaria.split(',').map((pais: string) => pais.trim())
    : [];


    const PaisesPaisesCuentasExtArray = typeof beneficiario.PaisesCuentasExt === 'string' && beneficiario.PaisesCuentasExt.trim() !== ''
    ? beneficiario.PaisesCuentasExt.split(',').map((pais: string) => pais.trim())
    : [];

    const PaisesPoderCuentaExtranjeraArray = typeof beneficiario.PaisesPoderCuentaExtranjera === 'string' && beneficiario.PaisesPoderCuentaExtranjera.trim() !== ''
    ? beneficiario.PaisesPoderCuentaExtranjera.split(',').map((pais: string) => pais.trim())
    : [];
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
      PaisesObligacionTributaria: [PaisesObligacionTributariaArray],
      CuentasFinancierasExt: [beneficiario.CuentasFinancierasExt],
      PaisesCuentasExt: [PaisesPaisesCuentasExtArray],
      TienePoderCuentaExtranjera: [beneficiario.TienePoderCuentaExtranjera],
      PaisesPoderCuentaExtranjera: [PaisesPoderCuentaExtranjeraArray],
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
      PorcentajeParticipacion: [vinculo.PorcentajeParticipacion]
    });
  }

  createFamilia(familia: any): FormGroup {
    return this.fb.group({
      NombreCompleto: [familia.NombreCompleto],
      TipoIdentificacion: [familia.TipoIdentificacion],
      NumeroIdentificacion: [familia.NumeroIdentificacion],
      Nacionalidad: [familia.Nacionalidad],
      CargoContacto: [familia.CargoContacto],
      FechaNombramiento: [familia.FechaNombramiento],
      FechaFinalizacion: [familia.FechaFinalizacion],
      VinculoFamiliar: [familia.VinculoFamiliar]
    });
  }

  get beneficiario() {
    return this.Beneficiarios.get('Beneficiario') as FormArray;
  }

  // Agregar un nuevo representante
  /*addBeneficiario() {
    this.beneficiario.push(this.crearBeneficiario());

    this.formularioBeneficiarioFinal.emit(this.Beneficiarios);
  }*/

    addBeneficiario() {
      const representanteForm = this.crearBeneficiario();
      this.beneficiario.push(representanteForm);
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
  

  // Quitar representante
  removeBeneficiario(index: number) {
    this.beneficiario.removeAt(index);
  }

  // Crear el grupo de un representante, incluyendo el array de cargos públicos
  crearBeneficiario(): FormGroup {
    return this.fb.group({
      NombreCompleto: ['', Validators.required],
      tipoDocumento: ['-1', [Validators.required, noSeleccionadoValidator()]],
      NumeroIdentificacion: ['', Validators.required],
      Nacionalidad: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Porcentajeparticipacion: ['',Validators.required],
      CotizaEnBolsa: ['', [Validators.required, noSeleccionadoValidator()]],
      vinculadoPep: ['-1', [Validators.required, noSeleccionadoValidator()]],//si si preguntas
      ManejaRecursos: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualesRecursos: ['', Validators.required],
      PoderPolitico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      RamaPoderPublico: ['', Validators.required],

      CargoPublico: ['-1', [Validators.required, noSeleccionadoValidator()]],
      CualCargoPublico: ['', Validators.required],

      ObligacionTributaria: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesObligacionTributaria: ['', Validators.required],

      CuentasFinancierasExt: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesCuentasExt: ['', Validators.required],

      TienePoderCuentaExtranjera: ['-1', [Validators.required, noSeleccionadoValidator()]],
      PaisesPoderCuentaExtranjera: ['-1', [Validators.required, noSeleccionadoValidator()]],

      hasidoPep2: ['-1', [Validators.required, noSeleccionadoValidator()]],
      cargosPublicos: this.fb.array([]),

      Tienevinculosmas5: ['-1', [Validators.required, noSeleccionadoValidator()]],
      Vinculosmas: this.fb.array([]),

      InfoFamiliaPep: this.fb.array([]),
     
    });
  }

   // Obtener el FormArray de cargos públicos para un representante específico
   getCargosPublicos(representanteIndex: number): FormArray {
    return this.beneficiario.at(representanteIndex).get('cargosPublicos') as FormArray;
  }


  crearcargospublicos()
  {
    return this.fb.group({
      NombreEntidad: ['', Validators.required],
      FechaIngreso: ['', Validators.required],
      FechaDesvinculacion: ['']});
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
    return this.beneficiario.at(vinculomas5Index).get('Vinculosmas') as FormArray;
  }


  getInfoFamiliar(indofamiliarIndex: number): FormArray {
    return this.beneficiario.at(indofamiliarIndex).get('InfoFamiliaPep') as FormArray;
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
      FechaFinalizacion:  ['', Validators.required],
      VinculoFamiliar: ['', Validators.required],

    });
    InfoFamilia.push(InfoFamiliaForm);
  }

  removeInfoFamilia(representanteIndex: number, FamilairIndex: number) {
    const InfoFamilia = this.getInfoFamiliar(representanteIndex);
    InfoFamilia.removeAt(FamilairIndex);
  }


  // Enviar el formulario completo
  submit() {
    if (!this.Beneficiarios.valid) {
      const formValue = this.Beneficiarios.value; // Obtiene el valor del formulario
      console.log(JSON.stringify(formValue,null,2));
    }
  }


  Desabilitacamposdespuesdeenvio()
  {
    this.editable=false;
    this.Beneficiarios.disable()

    this.IdEstadoFormulario=3;

    this.cdr.detectChanges(); //
  }

  obtenerCamposInvalidos(): any[] {
    const invalidFields: any[] = [];
  
    // Recorre el FormArray de representantes
    (this.beneficiario.controls as FormGroup[]).forEach((representanteGroup, representanteIndex) => {
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
    if (this.beneficiario && this.beneficiario.controls.length > 0) {

    Object.values(this.beneficiario.controls).forEach(control => {
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

  onPaisesObligacionTributariaChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.beneficiario.at(index).get('PaisesObligacionTributaria')?.setValue(paises);
  }

  onPaisesCuentasExtChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.beneficiario.at(index).get('PaisesCuentasExt')?.setValue(paises);
  }

  onPaisesPoderCuentaExtranjeraChange(index: number, selected: any): void {
    const paises = selected.map((item: any) => item.nombre);
    this.beneficiario.at(index).get('PaisesPoderCuentaExtranjera')?.setValue(paises);
  }
}
