import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { DatosGeneralesComponent } from '../../DatosGenerales/datos-generales/datos-generales.component';
import { DatosGeneralesDto } from '../../Models/DatosGeneralesDto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';
import { InternalDataService } from '../../Services/InternalDataService';
import { Router } from '@angular/router';
import { DatosContactoComponent } from '../../DatosContacto/datos-contacto/datos-contacto.component';
import { ReferenciasComercialesBancariasComponent } from '../../ReferenciasComercialesBancarias/referencias-comerciales-bancarias/referencias-comerciales-bancarias.component';
import { DatosDePagoComponent } from '../../DatosPago/datos-de-pago/datos-de-pago.component';
import { CumplimientoNormativoComponent } from '../../CumplimientoNormativo/cumplimiento-normativo/cumplimiento-normativo.component';
import { DespachoDeMercanciaComponent } from '../../DespachoDeMercancia/despacho-de-mercancia/despacho-de-mercancia.component';
import { DatosAdjuntosComponent } from '../../DatosAdjuntos/datos-adjuntos/datos-adjuntos.component';
import { RepresentanteLegalComponent } from '../../representante-legal/representante-legal.component';
import { AccionistasComponent } from '../../Accionistas/accionistas/accionistas.component';
import { JuntaDirectivaComponent } from '../../JuntaDirectiva/junta-directiva/junta-directiva.component';
import { AlertaGuardadoSinValidacionComponent } from '../../utils/alerta-guardado-sin-validacion/alerta-guardado-sin-validacion.component';
import { catchError, forkJoin, retry, switchMap, throwError } from 'rxjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as bootstrap from 'bootstrap';
import { RechazoModalComponent } from '../../utils/rechazo-modal/rechazo-modal.component';
import { DeclaracionesComponent } from '../../Declaraciones/declaraciones/declaraciones.component';
import { InformacionTributariaComponent } from '../../InformacionTributaria/informacion-tributaria/informacion-tributaria.component';
import { ConflictoInteresComponent } from '../../conflictoInteres/conflicto-intereses/conflicto-interes.component';
import { InformacionComplementariaComponent } from '../../InformacionComplementaria/informacion-complementaria/informacion-complementaria.component';
import { InformacionFinancieraComponent } from '../../InformacionFinanciera/informacion-financiera/informacion-financiera.component';
import { DatosRevisorFiscalComponent } from '../../DatosRevisorFiscal/datos-revisorfiscal/datos-revisorfiscal.component';



@Component({
  selector: 'app-formulario-proveedores-clientes',
  templateUrl: './formulario-proveedores-clientes.component.html',
  styleUrls: ['./formulario-proveedores-clientes.component.scss']
})


export class FormularioProveedoresClientesComponent implements OnInit, AfterViewInit {//CumplimientoNormativoComponent


  @ViewChild(DatosGeneralesComponent) componenteDatosGenerales: DatosGeneralesComponent;
  @ViewChild(DatosContactoComponent) componenteDatosContacto: DatosContactoComponent;
  @ViewChild(ReferenciasComercialesBancariasComponent) componenteReferenciasComBn: ReferenciasComercialesBancariasComponent;
  @ViewChild(DatosDePagoComponent) DatosDePagos: DatosDePagoComponent;
  @ViewChild(CumplimientoNormativoComponent) CumplimientoNormativo: CumplimientoNormativoComponent;
  @ViewChild(ConflictoInteresComponent) ConflictoInteresComponent: ConflictoInteresComponent;
  @ViewChild(InformacionComplementariaComponent) InformacionComplementariaComponent: InformacionComplementariaComponent;
  @ViewChild(InformacionFinancieraComponent) InformacionFinancieraComponent: InformacionFinancieraComponent;
  @ViewChild(DatosRevisorFiscalComponent) DatosRevisorFiscalComponent: DatosRevisorFiscalComponent;
  @ViewChild(DespachoDeMercanciaComponent) DespachoDeMercancia: DespachoDeMercanciaComponent; //DatosAdjuntosComponent
  @ViewChild(DatosAdjuntosComponent) DatosAduntos: DatosAdjuntosComponent;
  @ViewChild(DeclaracionesComponent) Declaraciones: DeclaracionesComponent;
  @ViewChild(RepresentanteLegalComponent) DatosRepresentantes: RepresentanteLegalComponent;

  @ViewChild(InformacionTributariaComponent) componenteInformacionTriburaria: InformacionTributariaComponent;

  @ViewChild(AccionistasComponent) DatosAccionistas: AccionistasComponent;

  @ViewChild(JuntaDirectivaComponent) DatosJuntaDirectiva: JuntaDirectivaComponent;

  @ViewChild('myTab', { static: false }) tabContainer: ElementRef;
  FormularioService: any = {};
  FechaFormulario: string;
  isLoading = false;
  private modalService = inject(NgbModal);
  Lang: string = 'es';
  Listatiposolicitud: any[] = [];
  ListaClaseTerceros: any[] = [];
  ListaTipoDocumentos: any[] = [];
  ListaSino: any[] = [];
  ListaPaises: any[] = [];
  ListaTamanoterceros: any[] = [];
  ListaActividadesEco: any[] = [];
  ListaCategoriaTerceros: any[] = [];
  ListaTipoCuentaBancaria: any[] = [];
  ListaTipoReferencia: any[] = [];
  isbolean: boolean = false;
  mostrarTabDespachos: boolean = true;
  mostrarTabRepresentanteLegal: boolean = true;
  mostrarTabAccionistas: boolean = true;
  mostrarTabDeclaraciones: boolean = true;
  mostrarTabInformacionTriburaria: boolean = true;
  mostrarTabJuntaDirectiva: boolean = true;
  mostrarTabAdjuntos: boolean = true;
  mostrarTabInfoFinanciera: boolean = true;
  mostrarTabDatosRevisorFiscal: boolean = true;
  mostrarTabDatosdeContacto: boolean = true;
  mostrarTabInformacionComplementaria: boolean = true;
  mostrarTabConflictoInteres: boolean = true;
  mostrarTabReferenciasBancarias: boolean = true;
  mostrarTabDatosdepagos: boolean = true;
  mostrarTabCumplimientoNormativo: boolean = true;
  IdFormulario: number;
  tipousuario: string;
  IdEstadoFormulario: number = 0;
  Estado: string;
  nivelRiesgo: string = '';
  totalRiesgo: number = 0;
  editable: boolean = false;
  classClient = false;
  classProveedor = false;
  classAliado = false;
  esPersonaNatural = false;
  esPersonaJuridica = false;
  claseTerceroEsProveedor: boolean = true;
  claseTerceroIsAliado: boolean = true;
  isCapturing = false;
  public categoriaActual: string = '';
  public classTerceroActual: string = '';
  private loadingModal: bootstrap.Modal | null = null;

  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService, private ServicioEdit: InternalDataService, private router: Router, private renderer: Renderer2, private cdRef: ChangeDetectorRef) {
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);
  }

  loadTipoSolicitud(): void {
    this.serviciocliente.ListTipoSolicitud(this.Lang).subscribe(data => {
      this.Listatiposolicitud = data;
    });
  }

  getColorForRisk(nivel: string): string {
    switch (nivel) {
      case 'Alto':
        return 'red';
      case 'Medio':
        return 'orange';
      default:
        return 'green';

    }
  }

  onCategoriaChange(event: { idCategoria: string }) {
    const valor = parseInt(event.idCategoria, 10);
    this.esPersonaNatural = (valor === 3);
    this.esPersonaJuridica = (valor === 2);
  }

  loadCLaseTerceros(): void {
    this.serviciocliente.ListClaseTercero(this.Lang).subscribe(data => {
      this.ListaClaseTerceros = data;
    });
  }

  loadSino(): void {
    this.serviciocliente.ListaSINO(this.Lang).subscribe(data => {
      this.ListaSino = data;
    });
  }

  loadCategoriaTerceros(): void {
    this.serviciocliente.ListCategoriaTercero(this.Lang).subscribe(data => {
      this.ListaCategoriaTerceros = data;
    });
  }

  loadTiposDocumentos(): void {
    this.serviciocliente.ListaTiposDocumentos(this.Lang).subscribe(data => {
      this.ListaTipoDocumentos = data;
    });
  }

  loadPaises(): void {
    this.serviciocliente.ListPaises(this.Lang).subscribe(data => {
      this.ListaPaises = data;
    });
  }

  loadTamañoTerceros(): void {
    this.serviciocliente.ListTamañoTercero(this.Lang).subscribe(data => {
      this.ListaTamanoterceros = data;
    });
  }
  loadActividadesEco(): void {
    this.serviciocliente.ListActividadEconomica(this.Lang).subscribe(data => {
      this.ListaActividadesEco = data;
    });
  }

  loadTipoCuentaBanc(): void {
    this.serviciocliente.ListaTiposCuentaBancaria(this.Lang).subscribe(data => {
      this.ListaTipoCuentaBancaria = data;
    });

  }
  loadTipoReferencia(): void {
    this.serviciocliente.ListaTipoReferencia(this.Lang).subscribe(data => {
      this.ListaTipoReferencia = data;
    });

  }




  async ngOnInit(): Promise<void> {
    this.FormularioService = this.ServicioEdit.getNuevoFormulario();
    if (this.FormularioService === null || this.FormularioService === undefined) {
      this.router.navigate(['/pages/dash/ListaRegistros']);
      return;
    } else {
      this.IdFormulario = this.FormularioService.id;
      this.FechaFormulario = this.FormularioService.fechaFormulario;
      this.IdEstadoFormulario = this.FormularioService.idEstado;
      this.Estado = this.FormularioService.estado;
      if (this.IdEstadoFormulario === 3) {
        this.serviciocliente.ObtenerRiesgoFormulario(this.IdFormulario)
          .subscribe({
            next: (riesgo) => {
              if (riesgo) {
                console.log("mirar el riesgo", riesgo.nivelRiesgoFinal)
                this.nivelRiesgo = riesgo.nivelRiesgoFinal;
                this.totalRiesgo = riesgo.totalRiesgo;
              }
            },
            error: (err) => console.error('Error consultando riesgo:', err)
          });
      }

      if (this.IdEstadoFormulario === 1 || this.IdEstadoFormulario === 2 || this.IdEstadoFormulario === 6) {
        this.editable = true;

      } else {
        this.editable = false;
      }

      this.loadTipoSolicitud();
      this.loadCLaseTerceros();
      this.loadSino();
      this.loadCategoriaTerceros();
      this.loadTiposDocumentos();
      this.loadPaises();
      this.loadTamañoTerceros();
      this.loadActividadesEco();
      this.initializeForm();         // Inicializa el formulario
      //this.initializeFormSubscriptions(); // Establece las suscripciones
      this.getFechaActual();
      this.loadTipoCuentaBanc();
      this.loadTipoReferencia();
    }


    this.serviciocliente.ConsultaDatosGenerales(this.IdFormulario).subscribe(obj => {
      if (!obj) {
        console.log('No hay datos (obj es null), es un formulario nuevo.');
        return;
      }
      if (obj.claseTercero === 1) {
        this.classClient = true;
        this.classProveedor = false;
        this.classAliado = false;
      } else if (obj.claseTercero === 2) {
        this.classClient = false;
        this.classProveedor = true;
        this.classAliado = false;
      } else if (obj.claseTercero === 3) {
        this.classClient = false;
        this.classProveedor = false;
        this.classAliado = true;
      }


      if (obj.categoriaTercero === 3) {
        this.esPersonaNatural = true;
        this.esPersonaJuridica = false;
      } else if (obj.categoriaTercero === 2) {
        this.esPersonaNatural = false;
        this.esPersonaJuridica = true;
      }

      this.cdr.detectChanges();
    })




  }

  ngAfterViewInit(): void {
    const catControl = this.componenteDatosGenerales?.formulario.get('categoriaTercero');
    const classTercero = this.componenteDatosGenerales?.formulario.get('claseTercero')
    if (catControl) {
      catControl.valueChanges.subscribe(valor => {
        this.categoriaActual = valor;
      });
      this.categoriaActual = catControl.value;
    }
    if (classTercero) {
      classTercero.valueChanges.subscribe(valor => {
        this.classTerceroActual = valor;
      });
      this.classTerceroActual = classTercero.value;
    }

    this.serviciocliente.CurrentUser().subscribe((data: any) => {
      this.tipousuario = data.rol
    })
    this.cdr.detectChanges();




    if (this.IdEstadoFormulario === 6) {

      this.abrirModalVerFormulario();
    }


  }


  abrirModalVerFormulario(): void {

    this.serviciocliente.MotivoRechazoservice(this.IdFormulario).subscribe(data => {

      const modalRef = this.modalService.open(RechazoModalComponent, {
        centered: true,
        windowClass: 'custom-modal-width'
      });
      modalRef.componentInstance.formularioId = this.IdFormulario;
      modalRef.componentInstance.isReadOnly = true;
      modalRef.componentInstance.initialMotivo = data.motivoRechazo;

      modalRef.result.then((result) => {
        // Lógica para manejar el cierre del modal en modo solo lectura
        console.log('Modal cerrado:', result);
      }, (reason) => {
        console.log('Modal cerrado sin rechazar:', reason);
      });

    });



  }


  get gsPersonaNatural(): boolean {
    const cat = this.componenteDatosGenerales?.formulario
      .get('categoriaTercero')
      ?.value;
    return cat === '3';
  }

  get gsPersonaJuridica(): boolean {
    const cat = this.componenteDatosGenerales?.formulario
      .get('categoriaTercero')
      ?.value;
    return cat === '2';
  }

  onTabVisibilityChange(event: { tabDespachos: boolean, tabRepresentanteLegal: boolean, tabInformacionTriburaria: boolean, tabPrinProvAndClient: boolean, tabIsAliado: boolean, tabAccionistas: boolean, tabDeclaraciones: boolean, tabInfoFinanciera: boolean, tabRevisorFiscal: boolean, tabtabInformacionTriburaria: boolean }): void {
    console.log('Evento recibido:', event);
    
    this.mostrarTabDespachos = event.tabDespachos;
    this.mostrarTabAccionistas = event.tabAccionistas;
    this.mostrarTabRepresentanteLegal = event.tabRepresentanteLegal;
    this.mostrarTabInformacionTriburaria = event.tabInformacionTriburaria;
    this.mostrarTabInfoFinanciera = event.tabInfoFinanciera;
    this.mostrarTabReferenciasBancarias = event.tabPrinProvAndClient;
    this.mostrarTabDatosRevisorFiscal = event.tabRevisorFiscal,
    this.claseTerceroIsAliado = event.tabIsAliado;
    this.mostrarTabDeclaraciones = event.tabDeclaraciones;
    this.mostrarTabInformacionTriburaria = event.tabtabInformacionTriburaria
  


    if (parseInt(this.classTerceroActual, 10) === 3) {
      this.mostrarTabDatosdeContacto = true;
      this.mostrarTabInformacionComplementaria = true;
      this.mostrarTabDeclaraciones = true;
      this.mostrarTabRepresentanteLegal = true;
      this.mostrarTabAccionistas = true;
      this.mostrarTabInformacionTriburaria = true;
      this.mostrarTabJuntaDirectiva = true;
      this.mostrarTabAdjuntos = true;
      this.mostrarTabDeclaraciones = true;
    
      this.mostrarTabDatosRevisorFiscal = false;
      this.mostrarTabInfoFinanciera = false;
      this.mostrarTabConflictoInteres = false;
      this.mostrarTabReferenciasBancarias = false;
      this.mostrarTabDatosdepagos = false;
      this.mostrarTabDespachos = false;
      this.mostrarTabCumplimientoNormativo = false;
    }
  }

  onClaseTerceroChange(event: { idClaseTercero: string }) {
    const valor = parseInt(event.idClaseTercero, 10);
  
    this.classClient = (valor === 1);
    this.classProveedor = (valor === 2);
    this.classAliado = (valor === 3);
  
   // == Logica manejo de los tabs  ====
    if (valor === 3) {
     
      this.mostrarTabDatosdeContacto = true;
      this.mostrarTabInformacionComplementaria = true;
      this.mostrarTabDeclaraciones = true;
      this.mostrarTabRepresentanteLegal = true;
      this.mostrarTabAccionistas = true;
      this.mostrarTabInformacionTriburaria = true;
      this.mostrarTabJuntaDirectiva = true;
      this.mostrarTabAdjuntos = true;
  
      // part no se muestra
      this.mostrarTabDatosRevisorFiscal = false;
      this.mostrarTabInfoFinanciera = false;
      this.mostrarTabConflictoInteres = false;
      this.mostrarTabReferenciasBancarias = false;
      this.mostrarTabDatosdepagos = false;
      this.mostrarTabDespachos = false;
      this.mostrarTabCumplimientoNormativo = false;

    } else {
      // 
    }
  }
  

  

  onAdjuntosFormReady(event: any) {

  }

  private initializeForm(): void {

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

  enviarFormulario(): void {

  }

  public async Enviar() {
    console.log('Método creacion Enviar() disparado');
    this.showLoadingModal();

    try {
      await new Promise(resolve => setTimeout(resolve, 300));


      if (!this.componenteDatosGenerales) {
        throw new Error('componenteDatosGenerales es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.componenteDatosGenerales.esFormularioValido()) {
        console.log('DatosGenerales INVALID => ', this.componenteDatosGenerales.obtenerCamposInvalidos());
        const camnposinvalidod = this.componenteDatosGenerales.obtenerCamposInvalidos();
        console.log(camnposinvalidod);
        this.componenteDatosGenerales.marcarFormularioComoTocado();
        this.seleccionarTab2('DatosGenerales-tab');
        this.hideLoadingModal();
        return;
      }


      const datosGenerales = this.componenteDatosGenerales.obtenerDatosFormulario(true);

      if (datosGenerales.claseTercero === '1') {
        if (!this.DespachoDeMercancia) {
          throw new Error('DespachoDeMercancia es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DespachoDeMercancia.esFormularioValido()) {
          this.DespachoDeMercancia.marcarFormularioComoTocado();
          this.seleccionarTab2('Despachodemercancia-tab');
          this.hideLoadingModal();
          return;
        }
      }


      if (datosGenerales.categoriaTercero !== '3') {
        if (!this.DatosRepresentantes) {
          throw new Error('DatosRepresentantes es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosRepresentantes.esFormularioValido()) {
          this.DatosRepresentantes.marcarFormularioComoTocado();
          this.seleccionarTab2('RepresentanteLegal-tab');
          this.hideLoadingModal();
          return;
        }

        if (!this.DatosJuntaDirectiva) {
          throw new Error('DatosJuntaDirectiva es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosJuntaDirectiva.esFormularioValido()) {
          this.DatosJuntaDirectiva.marcarFormularioComoTocado();
          this.seleccionarTab2('JuantaDirectiva-tab');
          this.hideLoadingModal();
          return;
        }

        if (!this.DatosAccionistas) {
          throw new Error('DatosAccionistas es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosAccionistas.esFormularioValido()) {
          this.DatosAccionistas.marcarFormularioComoTocado();
          this.seleccionarTab2('Accionistas-tab');
          this.hideLoadingModal();
          return;
        }
      }

      if (datosGenerales.pais === '43') {
        if (!this.componenteInformacionTriburaria) {
          throw new Error('componenteInformacionTriburaria es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.componenteInformacionTriburaria.esFormularioValido()) {
          this.componenteInformacionTriburaria.marcarFormularioComoTocado();
          this.seleccionarTab2('InformacionTributaria-tab');
          this.hideLoadingModal();
          return;
        }
      }

      if (!this.componenteDatosContacto) {
        throw new Error('componenteDatosContacto es undefined. Revisa @ViewChild y el HTML.');
      }

      if (!this.componenteDatosContacto.esFormularioValido()) {
        console.log('obtener invalidos', this.componenteDatosContacto.obtenerCamposInvalidos());
        this.componenteDatosContacto.marcarFormularioComoTocado();
        this.seleccionarTab2('DatosdeContacto-tab');
        this.hideLoadingModal();
        return;
      }


      if (this.mostrarTabDatosdepagos) {
        if (!this.DatosDePagos) {
          throw new Error('DatosDePagos es undefined. Revisa @ViewChild y el HTML.');
        }
        if (!this.DatosDePagos.esFormularioValido()) {
          this.DatosDePagos.marcarFormularioComoTocado();
          this.seleccionarTab2('Datosdepagos-tab');
          this.hideLoadingModal();
          return;
        }
      }


      if (!this.CumplimientoNormativo) {
        throw new Error('CumplimientoNormativo es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.CumplimientoNormativo.esFormularioValido()) {
        this.CumplimientoNormativo.marcarFormularioComoTocado();
        this.seleccionarTab2('CumplimientoNormativo-tab');
        this.hideLoadingModal();
        return;
      }

      if (!this.DatosAduntos) {
        throw new Error('DatosAduntos es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.DatosAduntos.esFormularioValido()) {
        this.DatosAduntos.marcarFormularioComoTocado();
        this.seleccionarTab2('Adjuntos-tab');
        this.hideLoadingModal();
        return;
      }

      if (!this.Declaraciones) {
        throw new Error('Declaraciones es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.Declaraciones.esFormularioValido()) {
        this.Declaraciones.marcarFormularioComoTocado();
        this.seleccionarTab2('Declaraciones-tab');
        this.hideLoadingModal();
        return;
      }

      const requests = [];
      const DatosGenerarles: DatosGeneralesDto = {
        Id: datosGenerales.Id,
        IdFormulario: this.IdFormulario,
        FechaDiligenciamiento: this.FechaFormulario,
        Empresa: datosGenerales.empresa,
        TipoSolicitud: datosGenerales.tipoSolicitud,
        ClaseTercero: parseInt(datosGenerales.claseTercero),
        CategoriaTercero: parseInt(datosGenerales.categoriaTercero),
        NombreRazonSocial: datosGenerales.nombreRazonSocial,
        TipoIdentificacion: datosGenerales.tipoIdentificacion,
        NumeroIdentificacion: datosGenerales.numeroIdentificacion,
        DigitoVarificacion: datosGenerales.digitoVerificacion,
        Pais: datosGenerales.pais,
        Ciudad: datosGenerales.Ciudad,
        TamanoTercero: datosGenerales.tamanoTercero,
        ActividadEconimoca: datosGenerales.ActividadEconomicatab1,
        DireccionPrincipal: datosGenerales.DireccionPrincipal,
        codigoPostal: datosGenerales.CodigoPostalTab1,
        CorreoElectronico: datosGenerales.CorreoElectronicoTab1,
        Telefono: datosGenerales.TelefornoTab1,
        ObligadoFE: datosGenerales.ObligadoFacturarElectronicatab1,
        EstadoCivil: datosGenerales.estadoCivil,
        ConyugeIdentificacion: datosGenerales.conyugeIdentificacion,
        TipoPago: datosGenerales.tipoPago,
        CertBASC: datosGenerales.basc,
        CertOEA: datosGenerales.oea,
        CertCTPAT: datosGenerales.ctpat,
        CertOtros: datosGenerales.otros,
        CertNinguno: datosGenerales.ninguno,
        CorreoElectronicoFE: datosGenerales.correoElectronicoFE,
        TieneSucursalesOtrosPaises: datosGenerales.TieneSucursalesOtrosPaisestab1,
        PaisesOtrasSucursales: datosGenerales.PaisesOtrasSucursalestab1?.join(', '),
        PreguntasAdicionales: datosGenerales.preguntasAdicionales
      };

      requests.push(
        this.serviciocliente.GuardarDatosGnerales(DatosGenerarles).pipe(
          catchError(error => {
            console.error('[GuardarDatosGenerales] Error:', error);
            return throwError(error);
          })
        )
      );

      if (datosGenerales.claseTercero === '1') {
        const formDespacho = {
          ...this.DespachoDeMercancia.obtenerDatosFormulario(true),
          IdFormulario: this.IdFormulario
        };
        requests.push(
          this.serviciocliente.GuardarDespachoMercancia(formDespacho).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      if (datosGenerales.categoriaTercero !== '3') {
        const datosRepre = this.DatosRepresentantes.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.guardarRepresentantesLegales(this.IdFormulario, datosRepre).pipe(
            catchError(error => throwError(error))
          )
        );

        const datosJunta = this.DatosJuntaDirectiva.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.guardarJuntaDirectiva(this.IdFormulario, datosJunta).pipe(
            catchError(error => throwError(error))
          )
        );

        const datosAccion = this.DatosAccionistas.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.guardarAccionistas(this.IdFormulario, datosAccion).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      if (datosGenerales.pais === '43') {
        const infoTrib = this.componenteInformacionTriburaria.obtenerDatosFormulario(true);
        requests.push(
          this.serviciocliente.GuardarInformacionTriburaria({ ...infoTrib, IdFormulario: this.IdFormulario }).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      const datosContacto = this.componenteDatosContacto.obtenerDatosFormulario(true);
      if (datosContacto.contactos?.length > 0) {
        requests.push(
          this.serviciocliente.guardarContactos(datosContacto.contactos).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      const datosRef = this.componenteReferenciasComBn.obtenerDatosFormulario(true);
      if (datosRef.ReferenciaFinanciera?.length > 0) {
        requests.push(
          this.serviciocliente.guardarReferencias(datosRef.ReferenciaFinanciera).pipe(
            catchError(error => throwError(error))
          )
        );
      }

      const datosPago = this.DatosDePagos.obtenerDatosFormulario(true);
      requests.push(
        this.serviciocliente.GuardarDatoPgado({ ...datosPago, IdFormulario: this.IdFormulario }).pipe(
          catchError(error => throwError(error))
        )
      );

      const datosCumpl = this.CumplimientoNormativo.obtenerDatosFormulario(true);
      requests.push(
        this.serviciocliente.GuardarCumplimientoNor({ ...datosCumpl, IdFormulario: this.IdFormulario }).pipe(
          catchError(error => throwError(error))
        )
      );

      const datosDecl = this.Declaraciones.obtenerDatosFormulario(true);
      requests.push(
        this.serviciocliente.GuardarDeclaraciones({ ...datosDecl, IdFormulario: this.IdFormulario }).pipe(
          catchError(error => throwError(error))
        )
      );

      //change estado a 3 => "Enviado"
      requests.push(
        this.serviciocliente.CambiarEstado(this.IdFormulario, 3).pipe(
          catchError(error => throwError(error))
        )
      );

      console.log('Antes de forkJoin => requests:', requests);
      forkJoin(requests).subscribe({
        next: async (respuestas) => {
          console.log('Respuestas forkJoin', respuestas);

          // 1) Calcula y consulta el riesgo
          this.serviciocliente.CalcularRiesgoFormulario(this.IdFormulario).pipe(
            switchMap(() => this.serviciocliente.ObtenerRiesgoFormulario(this.IdFormulario))
          ).subscribe({
            next: (riesgo: any) => {
              console.log('[Riesgo] => ', riesgo);
              if (riesgo) {
                this.nivelRiesgo = riesgo.nivelRiesgoFinal;
                this.totalRiesgo = riesgo.totalRiesgo;

                setTimeout(() => {
                  this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
                }, 3000);
              }
            },
            error: (err) => {
              console.error('Error calculando/consultando riesgo:', err);
            }
          });


          this.hideLoadingModal();


          await this.generarPDFEnvio3(datosGenerales);


          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Formulario enviado con éxito!';
          modalRef.componentInstance.title = 'Éxito';


        },
        error: (err) => {
          this.hideLoadingModal();
          console.error('[Enviar] Error en forkJoin:', err);
          this.manejarError(err);
        },
        complete: () => {
          console.log('Todas las peticiones completaron');
        }
      });

    } catch (error) {
      this.hideLoadingModal();
      console.error('[Enviar] Excepción no controlada:', error);
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Error al procesar el envío: ' + ((error as any)?.message || JSON.stringify(error));
      modalRef.componentInstance.title = 'Error';
      modalRef.componentInstance.isError = true;
    }
  }

  async Reenviar() {

    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));



    if (!this.componenteDatosGenerales.esFormularioValido()) {
      const camnposinvalidod = this.componenteDatosGenerales.obtenerCamposInvalidos();
      console.log(camnposinvalidod);
      this.seleccionarTab2('DatosGenerales-tab');
      this.componenteDatosGenerales.marcarFormularioComoTocado();
      console.log(camnposinvalidod);
      this.hideLoadingModal();
      return;
    }

    const datosGenerales = this.componenteDatosGenerales.obtenerDatosFormulario();
    const DatosGenerarles: DatosGeneralesDto = {
      Id: datosGenerales.Id,
      IdFormulario: this.IdFormulario,
      FechaDiligenciamiento: this.FechaFormulario,
      Empresa: datosGenerales.empresa,
      TipoSolicitud: datosGenerales.tipoSolicitud,
      ClaseTercero: parseInt(datosGenerales.claseTercero),
      CategoriaTercero: parseInt(datosGenerales.categoriaTercero),
      NombreRazonSocial: datosGenerales.nombreRazonSocial,
      TipoIdentificacion: datosGenerales.tipoIdentificacion,
      NumeroIdentificacion: datosGenerales.numeroIdentificacion,
      DigitoVarificacion: datosGenerales.digitoVerificacion,
      Pais: datosGenerales.pais,
      Ciudad: datosGenerales.Ciudad,
      TamanoTercero: datosGenerales.tamanoTercero,
      ActividadEconimoca: datosGenerales.ActividadEconomicatab1,
      DireccionPrincipal: datosGenerales.DireccionPrincipal,
      codigoPostal: datosGenerales.CodigoPostalTab1,
      CorreoElectronico: datosGenerales.CorreoElectronicoTab1,
      Telefono: datosGenerales.TelefornoTab1,
      ObligadoFE: datosGenerales.ObligadoFacturarElectronicatab1,
      EstadoCivil: datosGenerales.estadoCivil,
      ConyugeIdentificacion: datosGenerales.conyugeIdentificacion,
      TipoPago: datosGenerales.tipoPago,
      CertBASC: datosGenerales.basc,
      CertOEA: datosGenerales.oea,
      CertCTPAT: datosGenerales.ctpat,
      CertOtros: datosGenerales.otros,
      CertNinguno: datosGenerales.ninguno,
      CorreoElectronicoFE: datosGenerales.correoElectronicoFE,
      TieneSucursalesOtrosPaises: datosGenerales.TieneSucursalesOtrosPaisestab1,
      PaisesOtrasSucursales: datosGenerales.PaisesOtrasSucursalestab1,
      PreguntasAdicionales: datosGenerales.preguntasAdicionales,
    };

    if (DatosGenerarles.ClaseTercero.toString() === '1') {

      if (!this.DespachoDeMercancia.esFormularioValido()) {
        this.seleccionarTab2('Despachodemercancia-tab');
        this.DespachoDeMercancia.marcarFormularioComoTocado();
        this.hideLoadingModal();
        return;

      }
    }


    if (DatosGenerarles.CategoriaTercero.toString() !== '3') {
      //const dsdfsdf=this.DatosRepresentantes.esFormularioValido();
      if (!this.DatosRepresentantes.esFormularioValido()) {
        const variables = this.DatosRepresentantes.obtenerCamposInvalidos();
        console.log("🚀 ~ FormularioProveedoresClientesComponent ~ Reenviar ~ variables:", variables)
        const values = this.DatosRepresentantes.obtenerDatosFormulario(true);
        this.seleccionarTab2('RepresentanteLegal-tab');
        this.DatosRepresentantes.marcarFormularioComoTocado();
        this.hideLoadingModal();
        return;

      }


      if (!this.DatosJuntaDirectiva.esFormularioValido()) {
        this.seleccionarTab2('JuantaDirectiva-tab');

        this.DatosJuntaDirectiva.marcarFormularioComoTocado();
        this.hideLoadingModal();
        return;
      }


      if (!this.DatosAccionistas.esFormularioValido()) {
        this.seleccionarTab2('Accionistas-tab');
        this.DatosAccionistas.marcarFormularioComoTocado();
        this.hideLoadingModal();
        return;
      }
    }

    if (DatosGenerarles.Pais.toString() === '43') {
      if (!this.componenteInformacionTriburaria.esFormularioValido()) {
        this.componenteInformacionTriburaria.marcarFormularioComoTocado();
        this.seleccionarTab2('InformacionTributaria-tab');
        this.hideLoadingModal();
        return;

      }
    }


    if (!this.DatosDePagos.esFormularioValido()) {
      console.log('DatosDePagos invalid =>', this.DatosDePagos.obtenerCamposInvalidos());
      this.DatosDePagos.marcarFormularioComoTocado();
      this.seleccionarTab2('Datosdepagos-tab');
      this.hideLoadingModal();
      return;
    }


    if (!this.CumplimientoNormativo.esFormularioValido()) {
      this.CumplimientoNormativo.marcarFormularioComoTocado();
      this.seleccionarTab2('CumplimientoNormativo-tab');
      this.hideLoadingModal();
      return;

    }

    if (!this.Declaraciones.esFormularioValido()) {
      this.Declaraciones.marcarFormularioComoTocado();
      this.seleccionarTab2('Declaraciones-tab');
      this.hideLoadingModal();
      return;
    }


    if (!this.componenteDatosContacto.esFormularioValido()) {
      this.componenteDatosContacto.marcarFormularioComoTocado();
      this.seleccionarTab2('DatosdeContacto-tab');
      this.hideLoadingModal();
      return;
    }

    if (!this.DatosAduntos.esFormularioValido()) {
      this.DatosAduntos.marcarFormularioComoTocado();
      this.seleccionarTab2('Adjuntos-tab');
      this.hideLoadingModal();
      return;
    }

    let requests = [
      this.serviciocliente.GuardarDatosGnerales(DatosGenerarles).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    ];

    if (DatosGenerarles.ClaseTercero.toString() === '1') {
      const despacho = this.DespachoDeMercancia.obtenerDatosFormulario(true);
      const FormDespacho = {
        ...despacho,
        IdFormulario: this.IdFormulario
      };

      requests.push(
        this.serviciocliente.GuardarDespachoMercancia(FormDespacho).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    if (DatosGenerarles.CategoriaTercero.toString() !== '3') {
      const datosrepresentante = this.DatosRepresentantes.obtenerDatosFormulario(true);
      requests.push(
        this.serviciocliente.guardarRepresentantesLegales(this.IdFormulario, datosrepresentante).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.guardarJuntaDirectiva(this.IdFormulario, this.DatosJuntaDirectiva.obtenerDatosFormulario(true)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.guardarAccionistas(this.IdFormulario, this.DatosAccionistas.obtenerDatosFormulario(true)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    if (DatosGenerarles.Pais.toString() === '43') {
      const InformacionTribu = this.componenteInformacionTriburaria.obtenerDatosFormulario(true);
      const FormInformTribu = {
        ...InformacionTribu,
        IdFormulario: this.IdFormulario
      };
      requests.push(
        this.serviciocliente.GuardarInformacionTriburaria(FormInformTribu).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    const datosContacto = this.componenteDatosContacto.obtenerDatosFormulario(true);
    if (datosContacto.contactos && datosContacto.contactos.length > 0) {
      requests.push(
        this.serviciocliente.guardarContactos(datosContacto.contactos.map((contacto: any) => ({
          ...contacto
        }))).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    const datosReferecias = this.componenteReferenciasComBn.obtenerDatosFormulario(true);
    if (datosReferecias.ReferenciaFinanciera && datosReferecias.ReferenciaFinanciera.length > 0) {
      requests.push(
        this.serviciocliente.guardarReferencias(datosReferecias.ReferenciaFinanciera.map((referencia: any) => ({
          ...referencia
        }))).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }


    const datosPgo = this.DatosDePagos.obtenerDatosFormulario(true);
    const Formdatospago = {
      ...datosPgo,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarDatoPgado(Formdatospago).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const CumplimientoNor = this.CumplimientoNormativo.obtenerDatosFormulario(true);
    const FormCumplimiento = {
      ...CumplimientoNor,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarCumplimientoNor(FormCumplimiento).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const Declaraciones = this.Declaraciones.obtenerDatosFormulario(true);
    const FormDeclaraciones = {
      ...Declaraciones,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarDeclaraciones(FormDeclaraciones).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    requests.push(
      this.serviciocliente.CambiarEstado(this.IdFormulario, 4).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    forkJoin(requests).subscribe(results => {
    });



    await this.DesabilitaFormuarioscambiaEstado();
    await this.generarPDFEnvio3(datosGenerales);

    document.body.style.overflow = 'visible';

    console.log('Todas las solicitudes completadas',);
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.name = 'Todas las solicitudes fueron guardadas correctamente!';
    modalRef.componentInstance.title = 'Éxito';
    this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);

  }

  // button de guardar formulario
  submit() {
    this.componenteDatosGenerales.removeValidators();
    this.DespachoDeMercancia?.removeValidators();
    this.DatosRepresentantes?.removeValidators();
    this.DatosJuntaDirectiva?.removeValidators();
    this.DatosAccionistas?.removeValidators();
    this.componenteInformacionTriburaria?.removeValidators();
    this.componenteDatosContacto?.removeValidators();
    this.componenteReferenciasComBn?.removeValidators();
    this.DatosDePagos?.removeValidators();
    this.CumplimientoNormativo?.removeValidators();
    this.Declaraciones?.removeValidators();
    this.ConflictoInteresComponent?.removeValidators();
    this.InformacionComplementariaComponent?.removeValidators();
    this.InformacionFinancieraComponent?.removeValidators();
    this.DatosRevisorFiscalComponent?.removeValidators();

    const datosGenerales = this.componenteDatosGenerales.obtenerDatosFormulario(false);
    const DatosGenerarles: DatosGeneralesDto = {
      Id: datosGenerales.Id,
      IdFormulario: this.IdFormulario,
      FechaDiligenciamiento: this.FechaFormulario,
      Empresa: datosGenerales.empresa,
      TipoSolicitud: datosGenerales.tipoSolicitud,
      ClaseTercero: parseInt(datosGenerales.claseTercero),
      CategoriaTercero: parseInt(datosGenerales.categoriaTercero),
      NombreRazonSocial: datosGenerales.nombreRazonSocial,
      TipoIdentificacion: datosGenerales.tipoIdentificacion,
      NumeroIdentificacion: datosGenerales.numeroIdentificacion,
      DigitoVarificacion: datosGenerales.digitoVerificacion,
      Pais: datosGenerales.pais,
      Ciudad: datosGenerales.Ciudad,
      TamanoTercero: datosGenerales.tamanoTercero,
      ActividadEconimoca: datosGenerales.ActividadEconomicatab1,
      DireccionPrincipal: datosGenerales.DireccionPrincipal,
      codigoPostal: datosGenerales.CodigoPostalTab1,
      CorreoElectronico: datosGenerales.CorreoElectronicoTab1,
      Telefono: datosGenerales.TelefornoTab1,
      ObligadoFE: datosGenerales.ObligadoFacturarElectronicatab1,
      EstadoCivil: datosGenerales.estadoCivil,
      ConyugeIdentificacion: datosGenerales.conyugeIdentificacion,
      TipoPago: datosGenerales.tipoPago,
      CertBASC: datosGenerales.basc,
      CertOEA: datosGenerales.oea,
      CertCTPAT: datosGenerales.ctpat,
      CertOtros: datosGenerales.otros,
      CertNinguno: datosGenerales.ninguno,
      CorreoElectronicoFE: datosGenerales.correoElectronicoFE,
      TieneSucursalesOtrosPaises: datosGenerales.TieneSucursalesOtrosPaisestab1,
      PaisesOtrasSucursales: datosGenerales.PaisesOtrasSucursalestab1,
      PreguntasAdicionales: datosGenerales.preguntasAdicionales,
    };

    let requests = [
      this.serviciocliente.GuardarDatosGnerales(DatosGenerarles).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    ];

    if (DatosGenerarles.ClaseTercero === 1) {
      const despacho = this.DespachoDeMercancia.obtenerDatosFormulario(false);
      const FormDespacho = {
        ...despacho,
        IdFormulario: this.IdFormulario
      };

      requests.push(
        this.serviciocliente.GuardarDespachoMercancia(FormDespacho).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    if (DatosGenerarles.CategoriaTercero !== 3) {
      const datosrepresentante = this.DatosRepresentantes.obtenerDatosFormulario(false);
      requests.push(
        this.serviciocliente.guardarRepresentantesLegales(this.IdFormulario, datosrepresentante).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.guardarJuntaDirectiva(this.IdFormulario, this.DatosJuntaDirectiva.obtenerDatosFormulario(false)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        ),
        this.serviciocliente.guardarAccionistas(this.IdFormulario, this.DatosAccionistas.obtenerDatosFormulario(false)).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    if (DatosGenerarles.Pais === 43) {
      const InformacionTribu = this.componenteInformacionTriburaria.obtenerDatosFormulario(false);
      const FormCumplimiento = {
        ...InformacionTribu,
        IdFormulario: this.IdFormulario
      };
      requests.push(
        this.serviciocliente.GuardarInformacionTriburaria(FormCumplimiento).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );


    }

    const datosContacto = this.componenteDatosContacto.obtenerDatosFormulario(false);
    if (datosContacto.contactos && datosContacto.contactos.length > 0) {
      requests.push(
        this.serviciocliente.guardarContactos(datosContacto.contactos.map((contacto: any) => ({
          ...contacto
        }))).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    const datosReferecias = this.componenteReferenciasComBn.obtenerDatosFormulario(false);
    if (datosReferecias.ReferenciaFinanciera && datosReferecias.ReferenciaFinanciera.length > 0) {
      requests.push(
        this.serviciocliente.guardarReferencias(datosReferecias.ReferenciaFinanciera.map((referencia: any) => ({
          ...referencia
        }))).pipe(
          catchError(error => {
            this.manejarError(error);
            return [];
          })
        )
      );
    }

    const datosPgo = this.DatosDePagos.obtenerDatosFormulario(false);
    const Formdatospago = {
      ...datosPgo,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarDatoPgado(Formdatospago).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const CumplimientoNor = this.CumplimientoNormativo.obtenerDatosFormulario(false);
    const FormCumplimiento = {
      ...CumplimientoNor,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarCumplimientoNor(FormCumplimiento).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const Declaraciones = this.Declaraciones.obtenerDatosFormulario(false);
    const FormDeclaraciones = {
      ...Declaraciones,
      IdFormulario: this.IdFormulario
    };
    requests.push(
      this.serviciocliente.GuardarDeclaraciones(FormDeclaraciones).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const conflictoData = this.ConflictoInteresComponent.obtenerDatosFormulario(true);
    conflictoData.idFormulario = this.IdFormulario;

    requests.push(
      this.serviciocliente.GuardarConflictoIntereses(conflictoData).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const informComplement = this.InformacionComplementariaComponent.obtenerDatosFormulario(false);
    informComplement.idFormulario = this.IdFormulario;

    requests.push(
      this.serviciocliente.GuardarInformacionComplementaria(informComplement).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const inforFinanciera = this.InformacionFinancieraComponent.obtenerDatosFormulario(false);
    inforFinanciera.idFormulario = this.IdFormulario;

    requests.push(
      this.serviciocliente.GuardaInformacionFinanciera(inforFinanciera).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    const inforDatosFiscal = this.DatosRevisorFiscalComponent.obtenerDatosFormulario(false);
    inforDatosFiscal.idFormulario = this.IdFormulario;

    requests.push(
      this.serviciocliente.GuardaDatosRevisorFiscal(inforDatosFiscal).pipe(
        catchError(error => {
          this.manejarError(error);
          return [];
        })
      )
    );

    forkJoin(requests).subscribe(results => {
      // Aquí podrías manejar los resultados de todas las solicitudes
      console.log('Todas las solicitudes completadas', results);
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Todas las solicitudes fueron guardadas correctamente!';
      modalRef.componentInstance.title = 'Éxito';
    });
    this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
  }

  private manejarError(error: any): void {
    // Aquí manejas los errores y puedes guardarlos en una variable
    console.error('Error al guardar:', error);
    const modalRef = this.modalService.open(AlertModalComponent);
    modalRef.componentInstance.name = 'Error al guardar: ' + error.message;
    modalRef.componentInstance.title = 'Error';
    modalRef.componentInstance.isError = true;
  }

  seleccionarTab(tabId: string) {
    const tabLink = this.tabContainer.nativeElement.querySelector(`#${tabId}`);

    if (tabLink) {
      // Remove 'active' class from all tabs
      const tabs = this.tabContainer.nativeElement.querySelectorAll('.nav-link');
      tabs.forEach((tab: any) => this.renderer.removeClass(tab, 'active'));

      // Add 'active' class to the selected tab
      this.renderer.addClass(tabLink, 'active');

      // Show the selected tab content
      const tabContent = this.tabContainer.nativeElement.querySelector(tabLink.getAttribute('data-bs-target'));
      const allTabContents = this.tabContainer.nativeElement.querySelectorAll('.tab-pane');
      allTabContents.forEach((content: any) => this.renderer.removeClass(content, 'show'));
      allTabContents.forEach((content: any) => this.renderer.removeClass(content, 'active'));

      this.renderer.addClass(tabContent, 'show');
      this.renderer.addClass(tabContent, 'active');
    }
  }

  seleccionarTab2(tabId: string): void {
    const tabLink = this.tabContainer.nativeElement.querySelector(`#${tabId}`);

    if (tabLink) {
      // Create a new Tab instance and show the tab
      const tab = new bootstrap.Tab(tabLink);
      tab.show();
    }
  }



  private generateCanvas(element: HTMLElement): Promise<HTMLCanvasElement> {
    return html2canvas(element, {
      scale: 2,  // Reducir la escala para menor resolución
      logging: true,  // Habilitar logging para depuración
      useCORS: true,
      scrollY: -window.scrollY
    }).then(canvas => {
      console.log('Canvas generado:', canvas);
      console.log('Canvas dimensión:', canvas.width, canvas.height);
      return canvas;
    });
  }





  generarPDFrepresentantes(): void {
    const a4Container = document.getElementById('Representantespdf');  // Obtener el div que quieres convertir a PDF

    if (a4Container) {
      html2canvas(a4Container, {
        scale: 1,  // Resolución más baja para reducir tamaño del archivo
        logging: false,  // Desactivar logging
        useCORS: true  // Para imágenes externas que se puedan cargar
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/jpeg', 0.5);  // Usar calidad 0.5 para reducir tamaño

        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
        pdf.save('documento_a4.pdf');
      });
    }
  }


  public generarPDFDatosGenerales(): void {
    this.isLoading = true;
    const a4Container = document.getElementById('DatosGeneralespdf');

    if (a4Container) {
      // Usar html2canvas para convertir el div a imagen
      html2canvas(a4Container, {
        scale: 1,
        logging: false,
        useCORS: true
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


        pdf.save('datos_generales.pdf');

        this.isLoading = false;
      }).catch(error => {
        console.error('Error al generar PDF:', error);
        this.isLoading = false;
      });
    } else {
      console.error('No se encontró el div de datos generales.');
      this.isLoading = false;
    }
  }


  public async DesabilitaFormuarioscambiaEstado(): Promise<void> {

    this.componenteDatosGenerales.Desabilitacamposdespuesdeenvio();
    this.DatosRepresentantes.IdEstadoFormulario = 3;

    this.DatosRepresentantes.Desabilitacamposdespuesdeenvio();
    this.DatosRepresentantes.IdEstadoFormulario = 3;

    this.DatosJuntaDirectiva.Desabilitacamposdespuesdeenvio();
    this.DatosJuntaDirectiva.IdEstadoFormulario = 3;
    this.componenteDatosContacto.Desabilitacamposdespuesdeenvio();
    this.componenteDatosContacto.IdEstadoFormulario = 3;

    this.componenteReferenciasComBn.Desabilitacamposdespuesdeenvio();
    this.componenteReferenciasComBn.IdEstadoFormulario = 3;

    this.DatosDePagos.Desabilitacamposdespuesdeenvio();
    this.DatosDePagos.IdEstadoFormulario = 3;

    this.DespachoDeMercancia.Desabilitacamposdespuesdeenvio();
    this.DespachoDeMercancia.IdEstadoFormulario = 3;

    this.CumplimientoNormativo.Desabilitacamposdespuesdeenvio();
    this.DespachoDeMercancia.IdEstadoFormulario = 3;

    this.DatosAduntos.IdEstadoFormulario = 3;


    this.DatosAccionistas.Desabilitacamposdespuesdeenvio()
    this.DatosAccionistas.IdEstadoFormulario = 3;

    this.DatosAduntos.Desabilitacamposdespuesdeenvio()
    this.DatosAduntos.IdEstadoFormulario = 3;

    this.Declaraciones.Desabilitacamposdespuesdeenvio()
    this.Declaraciones.IdEstadoFormulario = 3;


    this.componenteInformacionTriburaria.Desabilitacamposdespuesdeenvio();
    this.componenteInformacionTriburaria.IdEstadoFormulario = 3;



    //this.seleccionarTab2('DatosGenerales-tab');
    //const canvasDatosGenerales = await this.generateCanvas(this.componenteDatosGenerales.ObtenerDivFormulario());

  }





  createTempContainer(): HTMLElement {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.zIndex = '-1';
    document.body.appendChild(container);
    return container;
  }




  public async generarPDFEnvio3(datosGenerales: any): Promise<void> {
    try {
      const container = this.createTempContainer();

      // Helper function to clone element and preserve selected values
      const cloneElementAndPreserveValues = (element: HTMLElement) => {
        const clone = element.cloneNode(true) as HTMLElement;
        const selects = element.querySelectorAll('select');
        selects.forEach((select, index) => {
          const cloneSelect = clone.querySelectorAll('select')[index];
          cloneSelect.value = select.value;
        });
        return clone;
      };

      const terminosYCondicionesElement = document.createElement('div');
      if (this.Lang === 'en') {
        terminosYCondicionesElement.innerHTML = this.terminosYCondicionesHTMLES;
      } else {
        terminosYCondicionesElement.innerHTML = this.terminosYCondicionesHTMLES;
      }

      container.appendChild(terminosYCondicionesElement);


      // Navigate between tabs and clone the elements preserving selected values

      this.seleccionarTab2('Declaraciones-tab');
      container.appendChild(cloneElementAndPreserveValues(this.Declaraciones.ObtenerDivFormulario()));


      this.seleccionarTab2('DatosGenerales-tab');
      container.appendChild(cloneElementAndPreserveValues(this.componenteDatosGenerales.ObtenerDivFormulario()));

      if (datosGenerales.categoriaTercero.toString() !== '3') {
        this.seleccionarTab2('RepresentanteLegal-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DatosRepresentantes.ObtenerDivFormulario()));

        this.seleccionarTab2('Accionistas-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DatosAccionistas.ObtenerDivFormulario()));

        this.seleccionarTab2('JuantaDirectiva-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DatosJuntaDirectiva.ObtenerDivFormulario()));
      }

      if (datosGenerales.pais === 43) {
        this.seleccionarTab2('InformacionTributaria-tab');
        container.appendChild(cloneElementAndPreserveValues(this.componenteInformacionTriburaria.ObtenerDivFormulario()));
      }

      this.seleccionarTab2('DatosdeContacto-tab');
      container.appendChild(cloneElementAndPreserveValues(this.componenteDatosContacto.ObtenerDivFormulario()));

      this.seleccionarTab2('ReferenciasBancarias-tab');
      container.appendChild(cloneElementAndPreserveValues(this.componenteReferenciasComBn.ObtenerDivFormulario()));

      this.seleccionarTab2('Datosdepagos-tab');
      container.appendChild(cloneElementAndPreserveValues(this.DatosDePagos.ObtenerDivFormulario()));

      if (datosGenerales.claseTercero === 1) {
        this.seleccionarTab2('Despachodemercancia-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DespachoDeMercancia.ObtenerDivFormulario()));
      }

      this.seleccionarTab2('CumplimientoNormativo-tab');
      container.appendChild(cloneElementAndPreserveValues(this.CumplimientoNormativo.ObtenerDivFormulario()));

      this.seleccionarTab2('Adjuntos-tab');
      container.appendChild(cloneElementAndPreserveValues(this.DatosAduntos.ObtenerDivFormulario()));

      // Generate the canvas of the temporary container
      const concatenatedCanvas = await this.generateCanvas(container);
      console.log('Canvas concatenado generado:', concatenatedCanvas);

      // Generate the final image from the concatenated canvas
      const imgData = concatenatedCanvas.toDataURL('image/jpeg', 0.5);

      // Create the PDF using the concatenated image

      //this.createPdf(imgData);

      const pdfBlob = this.createLongPdf(imgData);


      this.serviciocliente.uploadPdfEnviado(pdfBlob, this.IdFormulario).subscribe(
        (response) => {

        },
        (error) => {

        }
      );

      // Remove the temporary container
      document.body.removeChild(container);

      // Ensure the spinner disappears after the operation completes
      this.hideLoadingModal();
    } catch (error) {
      console.error('Error al generar imágenes de los divs:', error);
      // Ensure the spinner disappears even if an error occurs
      this.hideLoadingModal();
    }
  }

  public async generarPDFEnvioFinal(datosGenerales: any): Promise<void> {
    try {
      const container = this.createTempContainer();

      // Helper function to clone element and preserve selected values
      const cloneElementAndPreserveValues = (element: HTMLElement) => {
        const clone = element.cloneNode(true) as HTMLElement;
        const selects = element.querySelectorAll('select');
        selects.forEach((select, index) => {
          const cloneSelect = clone.querySelectorAll('select')[index];
          cloneSelect.value = select.value;
        });

        // Establecer tamaño tipo carta
        clone.style.width = '216mm';
        clone.style.height = '279mm';
        clone.style.pageBreakAfter = 'always';  // Asegurar que cada div clonado ocupe una página completa

        return clone;
      };

      // Navigate between tabs and clone the elements preserving selected values
      this.seleccionarTab2('DatosGenerales-tab');
      container.appendChild(cloneElementAndPreserveValues(this.componenteDatosGenerales.ObtenerDivFormulario()));

      if (datosGenerales.CategoriaTercero !== 3) {
        this.seleccionarTab2('RepresentanteLegal-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DatosRepresentantes.ObtenerDivFormulario()));

        this.seleccionarTab2('Accionistas-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DatosAccionistas.ObtenerDivFormulario()));

        this.seleccionarTab2('JuantaDirectiva-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DatosJuntaDirectiva.ObtenerDivFormulario()));
      }

      this.seleccionarTab2('DatosdeContacto-tab');
      container.appendChild(cloneElementAndPreserveValues(this.componenteDatosContacto.ObtenerDivFormulario()));

      this.seleccionarTab2('ReferenciasBancarias-tab');
      container.appendChild(cloneElementAndPreserveValues(this.componenteReferenciasComBn.ObtenerDivFormulario()));

      this.seleccionarTab2('Datosdepagos-tab');
      container.appendChild(cloneElementAndPreserveValues(this.DatosDePagos.ObtenerDivFormulario()));

      if (datosGenerales.ClaseTercero === 1) {
        this.seleccionarTab2('Despachodemercancia-tab');
        container.appendChild(cloneElementAndPreserveValues(this.DespachoDeMercancia.ObtenerDivFormulario()));
      }

      this.seleccionarTab2('CumplimientoNormativo-tab');
      container.appendChild(cloneElementAndPreserveValues(this.CumplimientoNormativo.ObtenerDivFormulario()));

      this.seleccionarTab2('Adjuntos-tab');
      container.appendChild(cloneElementAndPreserveValues(this.DatosAduntos.ObtenerDivFormulario()));

      // Generate the canvas of the temporary container
      const concatenatedCanvas = await this.generateCanvas(container);
      console.log('Canvas concatenado generado:', concatenatedCanvas);

      // Generate the final image from the concatenated canvas
      const imgData = concatenatedCanvas.toDataURL('image/jpeg', 1.0); // Mejora la calidad aumentando la calidad al 1.0

      // Create the PDF using the concatenated image
      const pdfBlob = this.createLongPdf(imgData);

      this.serviciocliente.uploadPdfEnviado(pdfBlob, this.IdFormulario).subscribe(
        (response) => { },
        (error) => { }
      );

      // Remove the temporary container
      document.body.removeChild(container);

      // Ensure the spinner disappears after the operation completes
      this.hideLoadingModal();
    } catch (error) {
      console.error('Error al generar imágenes de los divs:', error);
      // Ensure the spinner disappears even if an error occurs
      this.hideLoadingModal();
    }
  }






  public async generarPDF(): Promise<void> {

    try {
      // Capturar imágenes de cada pestaña
      this.seleccionarTab2('DatosGenerales-tab');
      const canvasDatosGenerales = await this.generateCanvas(this.componenteDatosGenerales.ObtenerDivFormulario());
      console.log('Canvas de Datos Generales generado:', canvasDatosGenerales);

      this.seleccionarTab2('RepresentanteLegal-tab');
      const canvasRepresentantes = await this.generateCanvas(this.DatosRepresentantes.ObtenerDivFormulario());
      console.log('Canvas de Representantes generado:', canvasRepresentantes);


      this.seleccionarTab2('Accionistas-tab');
      const canvasAccionistas = await this.generateCanvas(this.DatosAccionistas.ObtenerDivFormulario());
      console.log('Canvas de Representantes generado:', canvasAccionistas);

      this.seleccionarTab2('JuantaDirectiva-tab');
      const canvasjuntaDirectiva = await this.generateCanvas(this.DatosJuntaDirectiva.ObtenerDivFormulario());
      console.log('Canvas de Representantes generado:', canvasjuntaDirectiva);

      /*this.cambiarPestana('PestañaTres');
      const canvasPestañaTres = await this.generateCanvas(this.PestañaTres.ObtenerDivFormulario());
      console.log('Canvas de Pestaña Tres generado:', canvasPestañaTres);

      this.cambiarPestana('PestañaCuatro');
      const canvasPestañaCuatro = await this.generateCanvas(this.PestañaCuatro.ObtenerDivFormulario());
      console.log('Canvas de Pestaña Cuatro generado:', canvasPestañaCuatro);

      this.cambiarPestana('PestañaCinco');
      const canvasPestañaCinco = await this.generateCanvas(this.PestañaCinco.ObtenerDivFormulario());
      console.log('Canvas de Pestaña Cinco generado:', canvasPestañaCinco);
        */
      // Volver a la pestaña original


      // Concatenar los canvas
      const concatenatedCanvas = this.concatenateCanvases([
        canvasDatosGenerales,
        canvasRepresentantes,
        canvasjuntaDirectiva,
        canvasAccionistas
      ]);
      console.log('Canvas concatenado generado:', concatenatedCanvas);

      // Generar la imagen final a partir del canvas concatenado
      const imgData = concatenatedCanvas.toDataURL('image/jpeg', 0.5);

      // Crear el PDF usando la imagen concatenada
      this.createSinglePagePdf(imgData);


      this.hideLoadingModal();
      // Asegurarse de que el spinner desaparezca después de completar la operación
    } catch (error) {
      console.error('Error al generar imágenes de los divs:', error);
      // Asegurarse de que el spinner desaparezca incluso si ocurre un error
      this.hideLoadingModal();
    }
  }


  private seleccionarTab3(tabId: string): void {
    const tab = this.tabContainer.nativeElement.querySelector(`#${tabId}`);
    if (tab) {
      tab.click();
    }
  }


  private concatenateCanvases(canvases: HTMLCanvasElement[]): HTMLCanvasElement {
    const totalHeight = canvases.reduce((sum, canvas) => sum + canvas.height, 0);
    const maxWidth = Math.max(...canvases.map(canvas => canvas.width));

    const concatenatedCanvas = document.createElement('canvas');
    concatenatedCanvas.width = maxWidth;
    concatenatedCanvas.height = totalHeight;

    const ctx = concatenatedCanvas.getContext('2d');
    let y = 0;
    canvases.forEach(canvas => {
      ctx?.drawImage(canvas, 0, y);
      y += canvas.height;
    });

    return concatenatedCanvas;
  }



  private async generateImageData(element: HTMLElement): Promise<string> {
    if (!element || element.clientHeight === 0 || element.clientWidth === 0) {
      console.error('El div tiene dimensiones nulas o no está visible:', element);
      throw new Error('El div tiene dimensiones nulas o no está visible');
    }

    return new Promise((resolve, reject) => {
      html2canvas(element, {
        scale: 1,
        logging: true,  // Habilitar logging para depuración
        useCORS: true,
        scrollY: -window.scrollY
      }).then(canvas => {
        console.log('Canvas generado:', canvas);
        const imgData = canvas.toDataURL('image/jpeg', 0.5);  // Usar calidad 0.5 para reducir tamaño del archivo
        if (imgData) {
          resolve(imgData);
        } else {
          reject(new Error('Failed to generate image data'));
        }
      }).catch(error => {
        console.error('Error en html2canvas:', error);
        reject(error);
      });
    });
  }

  private createMultiPagePdf(images: string[]): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let y = margin;

    images.forEach((imgData, index) => {
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

      // Si la imagen no cabe en la página actual, añadir una nueva página
      if (y + imgHeight + margin > pageHeight) {
        pdf.addPage();
        y = margin; // Resetear el margen superior
      }

      pdf.addImage(imgData, 'JPEG', margin, y, pageWidth - 2 * margin, imgHeight);
      y += imgHeight + margin;
    });

    // Guardar el PDF con un nombre
    pdf.save('documento_combined.pdf');
  }


  private createPdf(imgData: string): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, imgHeight);

    // Guardar el PDF con un nombre
    pdf.save('documento_combined.pdf');
  }
  private createSinglePagePdf(imgData: string): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    // Ajustar la altura de la página del PDF según la altura de la imagen
    pdf.internal.pageSize.height = imgHeight + 2 * margin;

    pdf.addImage(imgData, 'JPEG', margin, margin, pageWidth - 2 * margin, imgHeight);

    // Guardar el PDF con un nombre
    pdf.save('documento_single_page.pdf');
  }

  createSinglePagePdf2(imgData: string): Blob {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    // Ajustar la altura de la página del PDF según la altura de la imagen
    const totalPages = Math.ceil(imgHeight / pdf.internal.pageSize.getHeight());
    for (let i = 0; i < totalPages; i++) {
      const y = i * pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', margin, y + margin, pageWidth - 2 * margin, imgHeight);
      if (i < totalPages - 1) {
        pdf.addPage();
      }
    }

    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  }

  private createLongPdf(imgData: string): Blob {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const margin = 10;
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pageWidth) / imgProps.width;

    // Ajustar la altura del PDF
    pdf.internal.pageSize.height = imgHeight + 2 * margin;

    // Añadir la imagen con alta calidad (se recomienda usar PNG para mejor calidad)
    pdf.addImage(imgData, 'PNG', margin, margin, pageWidth - 2 * margin, imgHeight, undefined, 'FAST');

    const pdfBlob = pdf.output('blob');
    return pdfBlob;
  }







  showLoadingModal() {
    const myModalEl = document.getElementById('loadingModal');
    if (myModalEl) {
      const myModal = new bootstrap.Modal(myModalEl, {
        keyboard: false
      });
      myModal.show();
    } else {
      console.error('No se encontró el elemento del modal para mostrarlo');
    }
  }

  hideLoadingModal() {
    this.isLoading = false;
    const myModalEl = document.getElementById('loadingModal');
    if (myModalEl) {
      let modal = bootstrap.Modal.getInstance(myModalEl);
      if (!modal) {
        modal = new bootstrap.Modal(myModalEl);
      }
      modal.hide();
      console.log("Modal ocultado");
      // Espera un pequeño tiempo para asegurarte de que Bootstrap haya terminado de cerrar el modal
      setTimeout(() => {
        if (!this.modalService.hasOpenModals()) {
          document.body.classList.remove('modal-open');
          document.body.style.overflow = ''; // Asegúrate de remover cualquier estilo inline de overflow
          console.log("Clase modal-open removida y overflow restaurado");
        }
      }, 500); // Ajusta el tiempo si es necesario
    } else {
      console.error('No se encontró el elemento del modal para ocultarlo');
    }
  }



  async downloadfile() {

    this.serviciocliente.descargarArchivo('PDFEnviado', this.IdFormulario).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "FormularioPdf.pdf";  // Puedes cambiar esto para usar el nombre del archivo real
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });

  }

  terminosYCondicionesHTMLES = `
  <div style="display: block;">
                    <p style="text-align: center;"><br><br><b>DECLARACIONES DE CUMPLIMIENTO:</b></p>
                    <ol style="text-align:justify; padding:5px 60px 5px 60px;">
                        <li>
                            SAMSUNG ELECTRONICS COLOMBIA SA (SAMSUNG) se encuentra obligada bajo las normas colombianas,
                            especialmente por las relativas
                            a la implementación de un sistema de autocontrol y gestión del riesgo integral de lavado de
                            activos, financiamiento al terrorismo
                            y financiamiento de la proliferación de armas de destrucción masiva- LA/FT/FPADM
                            (“SAGRILAFT”) y un Programa de Transparencia y
                            Ética Empresarial (“PTEE”) para gestionar, prevenir y controlar los riesgos provenientes de
                            actos de corrupción, sobornos y otros,
                            de conformidad con la Ley 2195 de 2022, la Circular 170 de la DIAN y los Capítulos X y XIII
                            de la Circular Básica Jurídica expedida por
                            la Superintendencia de Sociedades. Como parte de la mencionada regulación, SAMSUNG debe
                            llevar a cabo medidas de debida diligencia
                            que permitan entre otras finalidades identificar el/los beneficiario(s) final(es), teniendo
                            en cuenta como mínimo los siguientes criterios:
                            <ul>
                                <li>Identificar la persona natural, persona jurídica, estructura sin personería jurídica
                                    o similar con la que se celebre el negocio jurídico o el contrato.</li>
                                <li>Identificar el/los beneficiario(s) final(es) y la estructura de titularidad y
                                    control de la persona jurídica, estructura sin personería jurídica o similar con la
                                    que se celebre el negocio jurídico o el contrato, y tomar medidas razonables para
                                    verificar la información reportada.</li>
                                <li>Solicitar y obtener información que permita conocer el objetivo que se pretende con
                                    el negocio jurídico o el contrato. Debe obtener la información que permita entender
                                    el objeto social del contratista.</li>
                                <li>Realizar una debida diligencia de manera continua del negocio jurídico o el contrato
                                    estatal, examinando las transacciones llevadas a cabo a lo largo de esa relación
                                    paraidentificar cualquier indicio de lavado de activos, financiamiento al terrorismo
                                    o financiamiento de la proliferación de armas de destrucción masiva.</li>
                            </ul>
                        </li>

                        <li><b> DECLARACIONES GENERALES:</b><br>
                            El suscrito declara que:
                            <ul>
                                <li> La información incluida en el diligenciamiento del presente formato ha
                                    sido entregada de manera voluntaria.
                                </li>
                            </ul>
                            <ul>
                                <li> La información incluida en el diligenciamiento del presente formato es veraz
                                    y completa. Que en el caso de encontrarse incongruencias y/o errores en la misma,
                                    este formato podrá ser devuelto para ajustar la información o ser rechazado.
                                </li>
                            </ul>
                            <ul>
                                <li> Autorizo a SAMSUNG para que lleve a cabo la verificación en Listas Restrictivas
                                    y otras listas que esta utiliza para cumplir con su política de cumplimiento,
                                    respecto
                                    de la persona jurídica, sus representantes legales, miembros de junta directiva,
                                    apoderados, revisores fiscales, accionistas directos e indirectos hasta llegar al
                                    beneficiario real o final. La presente autorización se extiende durante la vigencia
                                    del vínculo o relacionamiento con SAMSUNG por lo que se entiende que la autorización
                                    tiene un alcance indefinido, en la medida en que, por regulación externa y políticas
                                    de lavado de activos, financiamiento al terrorismo, financiamiento de la
                                    proliferación
                                    de armas de destrucción masiva y corrupción, los monitoreos a este sistema exigen
                                    que se
                                    haga verificación de manera constante y/o regular.
                                </li>
                            </ul>
                            <ul>
                                <li> En el evento que la información incluida en este formato cambie o sea actualizada,
                                    el
                                    suscrito se compromete a que de manera inmediata lo pondrá en conocimiento de
                                    SAMSUNG.
                                </li>
                            </ul>
                        </li>
                        <li><b>DECLARACIÓN SOBRE CONOCIMIENTO Y ACEPTACIÓN DE POLÍTICAS SAMSUNG:</b><br>
                            Declaro que he leído y conozco los principios
                            del Código de Conducta de SAMSUNG ELECTRONICS COLOMBIA S.A. (en adelante ""SAMSUNG"")
                            (https://www.sec-audit.com/common/portal/sdpMain.do),
                            así como las politicas y procedimientos aplicables a terceros, accesibles en
                            www.samsung.com/co/info/generalpolicies/ por lo que me adhiero
                            al compromiso de evitar los conflictos de intereses, combatir la corrupción y el soborno,
                            prevenir el lavado de dinero, promover la libre competencia,
                            la protección de datos personales, así como la protección del medio ambiente, la salud y la
                            seguridad y en general, dar cumplimiento a estos principios.
                            Por ello, tomaremos las medidas adecuadas para garantizar el cumplimiento de estos
                            requisitos en la cadena de valor. SAMSUNG se reserva el derecho
                            de verificar el cumplimiento utilizando los medios apropiados, incluyendo, sin limitarse, a
                            solicitudes de información a través cuestionarios o
                            visitas a las instalaciones de sus terceros o aliados, previamente acordadas con este y de
                            manera anual.

                            Asimismo, declaro bajo la gravedad del juramento: (i) que la totalidad de los activos y
                            bienes tienen origen en actividades lícitas y no
                            tienen relaciones con personas u organizaciones dedicadas a actividades delictivas, y que
                            tampoco contribuye a la financiación, mantenimiento o
                            realización de conductas al margen de la ley y/o terroristas y por lo tanto los recursos que
                            se deriven de la presente relación comercial no serán
                            destinados para tales fines; (ii) que dentro del Sistema de Cumplimiento (cuando aplique) se
                            cuenta con altos estándares para la prevención y detección
                            del lavado de activos y la financiación del terrorismo, la lucha contra la corrupción, el
                            soborno y el conflicto de interés a través de prácticas adecuadas
                            para limitar el relacionamiento con funcionarios públicos y/o de gobierno; (iii) que la
                            compañía, ni sus representantes legales o directivos han estado
                            sujetos a penas o sanciones relacionadas a los delitos mencionados en el punto anterior;
                            (iv) que cumplimos a cabalidad con estas obligaciones, y que, de
                            estar obligado a la implementación de un Sistema de Cumplimiento, enviará a SAMSUNG una
                            certificación sobre dicha implementación firmada por
                            un Representante Legal y el Oficial de Cumplimiento.

                            Cuando exista cualquier indicio de la comisión de delitos relacionados anteriormente,
                            SAMSUNG se reserva la facultad de terminar de
                            manera anticipada cualquier relación comercial con el tercero sin que haya indemnización a
                            favor de este. Si hay evidencia de una
                            posible mala conducta por parte de los empleados de SAMSUNG, el tercero deberá informarlo
                            por correo electrónico (local) compliance.co&#64;samsung.com,
                            (regional) compliancela&#64;samsung.com, (global) cp.wb.sec&#64;samsung.com, página web:
                            https://www.sec-compliance.net/gcc/gcc.do?method=gccReport&langCd=es_ES o
                            línea telefónica: 01 800-9136740.
                        <li><b>CERTIFICACIÓN DE CUMPLIMIENTO DE REQUERIMIENTOS DE IMPORTACIÓN:</b>
                            <ul>
                                <li> Al firmar el presente documento manifiesto de manera voluntaria y expresa que la
                                    empresa que represento está comprometida con
                                    el cumplimiento de los requerimientos de importación exigidos por los diferentes
                                    entes certificadores en seguridad de la cadena
                                    de suministro y comercio internacional a la empresa SAMSUNG ELECTRONICS COLOMBIA
                                    S.A. Así mismo, manifiesto que todas las actividades de la
                                    empresa que represento son lícitas y se ejercen dentro de los marcos legales que
                                    corresponden. Igualmente, mi representada está
                                    comprometida a prevenir actividades ilícitas en la cadena de suministro de las
                                    operaciones logísticas de la empresa SAMSUNG,
                                    mediante el establecimiento de controles en las actividades desarrolladas.
                                </li>
                            </ul>

                        <li><b> AUTORIZACIÓN PARA PAGOS:</b>
                            <ul>
                                <li><b>Autorizo</b> para que se realicen los pagos por todo concepto que se adeuden, a
                                    través de transferencia electrónica a la cuenta bancaria anexa
                                    como documento a el presente formato. Igualmente, autorizo expresa e
                                    irrevocablemente a la entidad SAMSUNG y/o a quien ella autorice
                                    para consultar, reportar, procesar, solicitar y divulgar ante las centrales de
                                    informacion de la Asociacion Bancaria o cualquier otra
                                    entidad encargada del manejo de datos, información y riesgos sobre mis relaciones
                                    comerciales, el comportamiento comercial, datos
                                    personales económicos, análisis de estados financieros de la empresa que represento.
                                </li>
                            </ul>
                        <li><b> CONDICIONES GENERALES: </b>
                            <ul>
                                <li> Ordenes de Pedido / Recibo de Mercancia: Expediremos órdenes de pedido individuales
                                    por cada despacho de mercancía
                                    solicitada por cualquier medio probatorio adecuado que sirva de soporte documentario
                                    a las partes (fax, correo electrónico,
                                    comunicación escrita, EDI). 2. Las partes de buena fe aceptarán que tales órdenes de
                                    pedido han sido suscritas por persona
                                    delegada por el cliente para tal efecto. 3. Recibo de Facturas: El recibo de
                                    facturas por cualquier dependencia de la empresa
                                    implica aceptación de las mismas. 4. El pago de las facturas es de acuerdo al plazo
                                    de crédito otorgado por SAMSUNG.
                                    5. No efectuarán pagos en efectivos ni de cuentas de terceros.
                                </li>
                            </ul>
                        </li>
                        <li><b> AUTORIZACIÓN DE TRATAMIENTO DE DATOS PERSONALES:</b>
                            <ul>
                                <li> Autorizo a SAMSUNG ELECTRONICS COLOMBIA S.A. (en adelante “SAMSUNG”) como
                                    responsable, el tratamiento de mis datos personales en calidad de representante
                                    legal de persona jurídica y/o persona natural, para las siguientes finalidades: (i)
                                    creación y actualización de proveedores; (ii) reporte de obligaciones tributarias y
                                    legales; (iii) formalización de contratos, registro y control de compras,
                                    comunicaciones físicas y digitales derivadas de la relación comercial; (iv)
                                    comunicación y contacto con mis colaboradores para la efectiva prestación del
                                    servicio; (v) cumplir con normas legales de conocimiento del contraparte/tercero;
                                    (vi) evaluar el riesgo; (vii) determinar el nivel de endeudamiento de manera
                                    consolidada; (viii) prevención de lavado de activos, financiamiento del terrorismo,
                                    financiamiento de la proliferación de armas de destrucción masiva, corrupción y
                                    cumplimiento de normas legales y/o contractuales, y; (ix) las demás finalidades
                                    propias de la relación comercial, en los términos de la Política de Tratamiento de
                                    la Información de SAMSUNG y que hace parte integral de la presente autorización,
                                    disponible en www.samsung.com/co/privacy/. Autorizo igualmente a que la información
                                    personal sea almacenada en servidores propios de SAMUNG y servidores de terceros,
                                    los cuales en ambos casos pueden estar ubicados dentro o fuera del país (Colombia);
                                    asimismo, autorizo a que mi información personal sea transmitida y transferida a la
                                    Republica de Corea del Sur donde se ubica la casa matriz de SAMSUNG, o a otras
                                    filiales de SAMSUNG. Los anteriores tratamientos cuentan con todas las medidas de
                                    seguridad físicas, técnicas y administrativas para evitar su perdida, adulteración,
                                    uso fraudulento o no adecuado. Tengo derecho a conocer, actualizar y rectificar mi
                                    información personal, solicitar la supresión de mis datos personales y la
                                    revocatoria de la presente autorización cuando proceda, asi como presentar quejas
                                    ante la Superintendencia de Industria y Comercio. Se me ha informado que puedo
                                    ejercer los anteriores derechos mediante un correo electrónico enviado a
                                    tusdatos.co&#64;samsung.com o una comunicación escrita enviada a la Carrera 7 No. 113-43
                                    of. 607, Torre Samsung en la ciudad de Bogotá, Colombia</li>
                            </ul>
                        </li>
                    </ol>
                    <p style="text-align:justify; padding:5px 50px 5px 50px;">
                        He leído y acepto las condiciones establecidas en las secciones anteriores.
                    </p>

                </div>`;

  // terminosYCondicionesHTMLEN = `
  //           <!-- Modal Header -->
  //           <div class="modal-header">
  //               <h2 class="modal-title" id="terminos-header">Terms and conditions</h2>
  //           </div>

  //           <!-- Modal body -->
  //           <div class="modal-body" style="text-align: justify;" style="width: 100%;">

  //               <div  style="display: block;">
  //                   <p style="text-align: center;"><br><br><b>COMPLIANCE STATEMENTS:</b></p>
  //                   <ol style="text-align:justify; padding:5px 60px 5px 60px;">
  //                       <li><b> General Statements:</b>
  //                           <ul>
  //                               <li> Under the severity of the oath, I declare that I have obtained all authorizations,
  //                                    consents or approvals from the authorities or persons necessary for the completion of this form,
  //                                     therefore I declare that I have sufficient powers to act on behalf of the natural
  //                                     person or legal status of the person providing the information, which is bound and obligated
  //                                      by the statements contained herein
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li> The natural or legal person is legally constituted and authorized by its bylaws
  //                                    and applicable laws to carry out the activities within its corporate purpose.
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li> There are no claims, conditions, obligations,
  //                                    encumbrances, lawsuits, or proceedings before any governmental authority of any country,
  //                                     court or administrative order, reorganization or liquidation process against the natural or legal person that may or
  //                                      may generate: (i) Prohibition, impediment, restriction, or limitation in any way, of the powers to enter into contracts
  //                                       and fulfill the obligations included therein; (ii) Request or declaration of nullity, ineffectiveness,
  //                                       unenforceability or invalidity of contracts; (iii) Limitation, prohibition, restriction, impediment,
  //                                       cessation, or annulment of the activities that are initiated with
  //                                   <b>Enka de Colombia</b> y/o <b>Eko Red</b>.
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li> Under oath, I declare that all the data provided here and its attachments are truthful,
  //                                    complete, accurate, up-to-date, and verifiable. I authorize their verification
  //                                    by any natural or legal person, private or public,
  //                                   from now on and as long as there is any business relationship with <b>Enka de Colombia</b> y/o <b>Eko Red</b>,
  //                                   or those representing their rights. Finally, I declare my commitment to <b>Enka de
  //                                       Colombia</b> y/o <b>Eko Red</b> to update and inform about any changes in the informatio on this form or its
  //                                       annexed documents at least once a year and/or when changes occur in any part of the content, through the
  //                                       same tool used for the enrollment process.
  //                               </li>
  //                           </ul>
  //                       </li>
  //                       <li><b> Declarations of origin and provenance of funds:</b><br>
  //                           With the purpose of contributing to the prevention
  //                            and control of the risk of Money Laundering, Financing of Terrorism and
  //                            Financing the Proliferation of Weapons of Mass Destruction, I declare:
  //                           <ul>
  //                               <li> That the resources with which the natural or legal person was established
  //                                    and carries out operations do not come from any illicit activity contemplated
  //                                     in the Colombian Penal Code or in any regulation that modifies or adds to it;
  //                                      These resources come from the development of legal activities for
  //                                       which the natural or legal person is authorized.
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li> I will not allow third parties to carry out, on behalf of the natural
  //                                    or legal person, operations with funds coming from illicit activities contemplated
  //                                     in the Colombian Penal Code or in any regulation that modifies or adds to it;
  //                                     nor will the natural or legal person carry out transactions intended for such
  //                                      activities or in favor of persons related to them.
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li> There are no prior convictions or ongoing investigations,
  //                                    or I am unaware of their existence, as a result of civil, criminal, administrative,
  //                                    tax-related actions or proceedings of any kind by Colombian or foreign authorities related to
  //                                    illicit activities; therefore, I certify that as of the date, the natural or legal person,
  //                                    its partners, or administrators do not have negative records in the national or international
  //                                    anti-money laundering and counter-terrorism financing risk control lists, and that in accordance
  //                                    with the above, inclusion in such lists shall constitute just cause for termination of the business
  //                                    relationship with
  //                                   <b>Enka de Colombia</b> y/o <b>Eko Red</b>.
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li> In the event of a breach of any of the facts contained in this form,
  //                                    I absolve  <b>Enka de Colombia</b> y/o <b>Eko Red</b>
  //                                     of any liability arising from erroneous, false,
  //                                     or inaccurate information that I may have provided herein,
  //                                      or from its violation.</li>
  //                           </ul>
  //                           <ul>
  //                               <li> In carrying out its corporate purpose,
  //                                    the natural or legal person will not engage in any illicit activity contemplated
  //                                     in the Penal Code or in any other regulation modifying or adding to it, and consequently
  //                                     undertakes to respond to  <b>Enka de Colombia</b> or <b>Eko Red</b> and third parties for all
  //                                     damages that may be caused as a result of these affirmations.</li>
  //                           </ul>
  //                       </li>
  //                       <li><b>Declaration and authorization for consultation and reporting of information:</b>
  //                           <ul>
  //                               <li>I voluntarily, prior, expressly and informedly authorize
  //                                   <b>Enka de Colombia</b> / <b>Eko Red</b> to request, collect, store, consult, verify,
  //                                    share, modify, update, clarify or remove the data provided in this form and its annexes,
  //                                    with the purpose of managing the process of knowledge, linking and updating of my information,
  //                                    allowing the fulfillment of the negotiation, formalization, execution, supervision and termination of the
  //                                    commercial relationship activities through the means and tools determined by <b>Enka de Colombia</b> / <b>Eko Red</b>;
  //                                    as well as to manage requests, complaints and claims or requests filed, in accordance with the
  //                                     applicable regulations, both internally and with competent third parties; Additionally, to
  //                                      transmit or transfer at a national or international level, to related companies, allied
  //                                       third parties and suppliers of <b>Enka de Colombia</b> / <b>Eko Red</b>, my information, that of referred or
  //                                       represented third parties, to support or contribute to the proper functioning and execution of
  //                                       the processes; also to share my personal data with related companies, third parties, allies,
  //                                       suppliers for the development of promotional or commercial management activities of both
  //                                       <b>Enka de Colombia</b> / <b>Eko Red</b>, as well as third parties that accredit an adequate level of
  //                                        compliance with the protection of personal data law; and eventually to report activities,
  //                                        events, news or other commercial information for the purposes of promotion and marketing of the
  //                                         services of <b>Enka de Colombia</b> / <b>Eko Red</b>, related companies or allied third parties. The personal
  //                                         information processed is general, identification, location and socioeconomic </li>
  //                           </ul>
  //                           <ul>
  //                               <li>The owners of the information registered in this form declare
  //                                   that they have been informed about the right they have to know, update and rectify their data;
  //                                    be informed about the treatment that has been given to the data; revoke the authorization granted
  //                                     and/or request the deletion of data; request proof of the authorization granted, and file complaints
  //                                      with the Superintendency of Industry and Commerce when queries or
  //                                      complaints regarding the protection of personal data are not properly addressed.</li>
  //                           </ul>
  //                           <ul>
  //                               <li>The above rights may be exercised by submitting a query or claim through the following service channels:
  //                                   <ul>
  //                                       <li style="list-style-type: disc"> <b>Enka de Colombia</b>:
  //                                           <ul>
  //                                               <li>To email:  <a href="">datospersonales&#64;enka.com.co</a><br>
  //                                                   <a href="">datospersonales&#64;ekored.co</a>
  //                                               </li>
  //                                               <li>To the address: Calle 3 Sur # 43ª – 52 Piso 5 en Medellín - Antioquia<br>
  //                                                   Vía Cabildo Km 2 en Girardota - Antioquia <br>
  //                                                   Carrera 64 # 56 A – 40 en Medellín - Antioquia
  //                                               </li>
  //                                               <li>By phone:  (57) 4055139<br>
  //                                                   (57) (604) 5606241
  //                                               </li>
  //                                           </ul>
  //                                       </li>
  //                                   </ul>
  //                               </li>
  //                           </ul>
  //                           <ul>
  //                               <li>By completing and signing this form, I declare that I know and accept,
  //                                    expressly and in writing, the content of this authorization request, as well as the
  //                                    content of the Personal Data Protection and Privacy Policy of <b>Enka de Colombia</b> /
  //                                   <b>Eko Red</b> Network published on the web page: <a
  //                                       href="https://www.enka.com.co">https://www.enka.com.co</a> y <a
  //                                       href="https://www.ekored.co">https://www.ekored.co</a></li>
  //                           </ul>
  //                       </li>
  //                       <li><b>Declaration and authorization to consult, report and share information in credit risk information centers:</b>
  //                           <ul>
  //                               <li>I authorize <b>Enka de Colombia</b> y/o <b>Eko Red</b> or
  //                                   those who represent their rights, to consult, request, provide,
  //                                    report, process and disclose all information that refers to the
  //                                    credit, financial and commercial behavior of the natural or legal
  //                                    person, to the credit risk information centers, or any entity that
  //                                     manages or administers databases for the same purposes.</li>
  //                           </ul>
  //                           <ul>
  //                               <li>I declare that I am aware that the scope of this authorization implies that the behavior
  //                                    regarding the obligations of the natural or legal
  //                                    person will be recorded in order to provide sufficient and
  //                                     appropriate information to the market on the status of financial,
  //                                      commercial and credit obligations. Consequently, I know and accept
  //                                       that those who are affiliated and/or have access to the credit risk information
  //                                       centers will be able to know this information, in accordance with applicable legislation and jurisprudence. </li>
  //                           </ul>
  //                       </li>
  //                       <li><b>Ethics and Corporate Governance:</b>
  //                           <ul>
  //                               <li> By completing and signing this form, I declare that I know and
  //                                    accept, expressly and in writing, the content of the ethics and good
  //                                     governance standards of Enka de Colombia/Eko Red, which frame the principles
  //                                      of action in the relationship with third parties and encourage negotiations.
  //                                      and ethical, transparent, respectful operations with corporate social responsibility,
  //                                       published on the website:
  //                                   <a href="https://www.enka.com.co/inversionistas/etica-y-buen-gobierno">https://www.enka.com.co/inversionistas/etica-y-buen-gobierno/</a>
  //                                   I understand that the lack of compliance empowers to
  //                                    Enka de Colombia/Eko Red to unilaterally terminate the business relationship,
  //                                     exclude me from commercial opportunities and take legal action to obtain compensation for all
  //                                     material and moral damages that such conduct may cause.
  //                               </li>
  //                               <li>
  //                                I undertake to report any suspicion or evidence of the performance of an incorrect act through any of following reporting channels:
  //                                <ul>
  //                                   <li>
  //                                   Accounting and Internal Control Division: Phone  (57) (604) 4055169
  //                                   </li>
  //                                   <li>
  //                                   Transparency mailbox:  buzon&#64;enka.com.co; buzondetransparencia&#64;ekored.co
  //                                   </li>
  //                                   <li>
  //                                    Websites: https://www.enka.com.co/contacto/buzon-de-transparencia/.; https://ekored.co/buzon-de-transparencia/
  //                                    </li>
  //                                   </ul>
  //                               </li>
  //                           </ul>
  //                       </li>
  //                       <li><b>Declaration of good labor practices:</b>
  //                           <ul>
  //                               <li>I declare that the natural or legal person
  //                                    that I represent complies with labor standards in relation to:
  //                                     personnel selection, compensation, occupational health, forced labor,
  //                                      non-hiring of child labor, non-discrimination and promotes equal employment opportunities.
  //                                      To date, there are no processes or investigations for violation of these principles and neither
  //                                       has it been sanctioned for the aspects stated above.</li>
  //                           </ul>

  //                       </li>
  //                       <li><b>Declaration applicable only to suppliers of recycled material: </b>
  //                           <ul>
  //                               <li>I declare as a <b>SUPPLIER OF RECYCLED MATERIAL</b> that I
  //                                    received training on the quality conditions of the product
  //                                     according to the information provided to me as a supplier
  //                                     and the production plant visit. </li>
  //                           </ul>
  //                       </li>
  //                   </ol>
  //                   <p style="text-align:justify; padding:5px 50px 5px 50px;">
  //                       I have read and accept the conditions established in the seven (7) sections above.
  //                   </p>
  //               </div>
  //           </div>
  //      `;


}




