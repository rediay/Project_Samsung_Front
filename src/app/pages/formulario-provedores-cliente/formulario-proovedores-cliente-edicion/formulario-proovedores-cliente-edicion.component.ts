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
import { catchError, forkJoin, switchMap, throwError } from 'rxjs';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RechazoModalComponent } from '../../utils/rechazo-modal/rechazo-modal.component';
import { MotivoRechazo } from '../../Models/MotivoRechazoDto';
import { ConflictoInteresComponent } from '../../conflictoInteres/conflicto-intereses/conflicto-interes.component';
import { InformacionComplementariaComponent } from '../../InformacionComplementaria/informacion-complementaria/informacion-complementaria.component';
import { DatosRevisorFiscalComponent } from '../../DatosRevisorFiscal/datos-revisorfiscal/datos-revisorfiscal.component';
import { InformacionTributariaComponent } from '../../InformacionTributaria/informacion-tributaria/informacion-tributaria.component';
import { DeclaracionesComponent } from '../../Declaraciones/declaraciones/declaraciones.component';
import { InformacionFinancieraComponent } from '../../InformacionFinanciera/informacion-financiera/informacion-financiera.component';
declare var bootstrap: any;

@Component({
  selector: 'app-formulario-proveedores-clientes-edicion',
  templateUrl: './formulario-proovedores-cliente-edicion.component.html',
  styleUrl: './formulario-proovedores-cliente-edicion.component.scss'
})
export class FormularioProovedoresClienteEdicionComponent implements OnInit, AfterViewInit {//CumplimientoNormativoComponent


  @ViewChild(DatosGeneralesComponent) componenteDatosGenerales: DatosGeneralesComponent;
  @ViewChild(DatosContactoComponent) componenteDatosContacto: DatosContactoComponent;
  @ViewChild(ReferenciasComercialesBancariasComponent) componenteReferenciasComBn: ReferenciasComercialesBancariasComponent;
  @ViewChild(DatosDePagoComponent) DatosDePagos: DatosDePagoComponent;
  @ViewChild(DatosRevisorFiscalComponent) DatosRevisorFiscalComponent: DatosRevisorFiscalComponent;
  @ViewChild(CumplimientoNormativoComponent) CumplimientoNormativo: CumplimientoNormativoComponent;
  @ViewChild(ConflictoInteresComponent) ConflictoInteresComponent: ConflictoInteresComponent;
  @ViewChild(InformacionComplementariaComponent) InformacionComplementariaComponent: InformacionComplementariaComponent;
  @ViewChild(InformacionFinancieraComponent) InformacionFinancieraComponent: InformacionFinancieraComponent;
  @ViewChild(DespachoDeMercanciaComponent) DespachoDeMercancia: DespachoDeMercanciaComponent; //DatosAdjuntosComponent
  @ViewChild(DatosAdjuntosComponent) DatosAduntos: DatosAdjuntosComponent;
  @ViewChild(RepresentanteLegalComponent) DatosRepresentantes: RepresentanteLegalComponent;
 @ViewChild(InformacionTributariaComponent) componenteInformacionTriburaria: InformacionTributariaComponent;
  @ViewChild(AccionistasComponent) DatosAccionistas: AccionistasComponent;
  @ViewChild(DeclaracionesComponent) Declaraciones: DeclaracionesComponent;

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
  mostrarTabInfoFinanciera: boolean = true;
  mostrarTabDatosRevisorFiscal: boolean = true;
  mostrarTabDatosdeContacto: boolean = true;
  mostrarTabInformacionComplementaria: boolean = true;
  mostrarTabConflictoInteres: boolean = true;
  mostrarTabReferenciasBancarias: boolean = true;
  mostrarTabDatosdepagos: boolean = true;
  mostrarTabCumplimientoNormativo: boolean = true;
  claseTerceroEsProveedor: boolean = true
  claseTerceroIsAliado: boolean = true;
  IdFormulario: number;
  IdEstadoFormulario: number = 0;
  tipousuario: string;
  Estado: string;
  idClaseTercero: string;
  idCategoriaTercero:string;
  nivelRiesgo: string = '';
  totalRiesgo: number = 0;
  classClient = false;
  classProveedor = false;
  classAliado = false;
  esPersonaNatural = false;
  esPersonaJuridica = false;

  isCapturing = false;


  constructor(private cdr: ChangeDetectorRef, private fb: FormBuilder, private translate: TranslateService, private serviciocliente: ServicioPrincipalService, private ServicioEdit: InternalDataService, private router: Router, private renderer: Renderer2, private cdRef: ChangeDetectorRef) {


    this.translate.setDefaultLang('es');
    // Opcional: cargar el idioma basado en una preferencia del usuario
    this.Lang = localStorage.getItem('language') || 'es';
    this.translate.use(this.Lang);



  }

  async CrearNuevoForm() {


  }

  loadTipoSolicitud(): void {
    this.serviciocliente.ListTipoSolicitud(this.Lang).subscribe(data => {
      this.Listatiposolicitud = data;
    });
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
      this.router.navigate(['/pages/dash/ListaFormulariosUsuario']);
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
                this.nivelRiesgo = riesgo.nivelRiesgoFinal;
                this.totalRiesgo = riesgo.totalRiesgo;
              }
            },
            error: (err) => console.error('Error consultando riesgo:', err)
          });
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
    this.cdr.detectChanges();

    if (this.componenteDatosGenerales) {

    }

    this.serviciocliente.CurrentUser().subscribe((data: any) => {
      this.tipousuario = data.rol
      if (this.IdEstadoFormulario === 8 && this.tipousuario === 'Oficial de Cumplimiento') {

        this.abrirModalVerFormulario();
      }


    });


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




  onTabVisibilityChange(event: { tabDespachos: boolean, tabRepresentanteLegal: boolean, tabPrinProvAndClient: boolean, tabIsAliado: boolean, tabInformacionTriburaria: boolean, tabDeclaraciones: boolean, tabInfoFinanciera: boolean }): void {
    this.mostrarTabDespachos = event.tabDespachos;
    this.mostrarTabRepresentanteLegal = event.tabRepresentanteLegal;
    this.claseTerceroEsProveedor = event.tabPrinProvAndClient;
    this.mostrarTabInfoFinanciera = event.tabInfoFinanciera;
    this.claseTerceroIsAliado = event.tabIsAliado;
    this.mostrarTabInformacionTriburaria = event.tabInformacionTriburaria;
    this.mostrarTabDeclaraciones = event.tabDeclaraciones;
    // Aquí puedes manejar el evento y actualizar el estado del padre
  }


  onClaseTerceroChange(event: { idClaseTercero: string }): void {
    this.idClaseTercero = event.idClaseTercero;

  }

  onCategoriaChange(event: { idCategoriaTercero: string }): void {
    this.idCategoriaTercero = event.idCategoriaTercero;
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

  // Método para enviar el formulario
  enviarFormulario(): void {
    /* if (this.formulario.valid) {
      /* console.log('Datos del formulario:', this.formulario.value);
      
     } else {
       console.log('Formulario no válido');
       this.formulario.markAllAsTouched(); // Muestra los errores
     }*/
  }


  


  // Enviar el formulario completo
  public async Enviar() {
    console.log('Método edicion Enviar() disparado');
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
        console.log('obtener invalidos',this.componenteDatosContacto.obtenerCamposInvalidos());
        this.componenteDatosContacto.marcarFormularioComoTocado();
        this.seleccionarTab2('DatosdeContacto-tab');
        this.hideLoadingModal();
        return;
      }
  
  
      if (!this.DatosDePagos) {
        throw new Error('DatosDePagos es undefined. Revisa @ViewChild y el HTML.');
      }
      if (!this.DatosDePagos.esFormularioValido()) {
        this.DatosDePagos.marcarFormularioComoTocado();
        this.seleccionarTab2('Datosdepagos-tab');
        this.hideLoadingModal();
        return;
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
      
          
        //  await this.generarPDFEnvio3(datosGenerales);
      
          
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

    forkJoin(requests).subscribe(results => {
      // Aquí podrías manejar los resultados de todas las solicitudes
      console.log('Todas las solicitudes completadas', results);
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Todas las solicitudes fueron guardadas correctamente!';
      modalRef.componentInstance.title = 'Éxito';
    });
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
      scale: 1,  // Reducir la escala para menor resolución
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
    const a4Container = document.getElementById('DatosGeneralespdf');  // Obtener el div que quieres convertir a PDF

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
        pdf.save('datos_generales.pdf');

        this.isLoading = false;  // Asegurarse de que el spinner desaparezca después de completar la operación
      }).catch(error => {
        console.error('Error al generar PDF:', error);
        this.isLoading = false;  // Asegurarse de que el spinner desaparezca incluso si ocurre un error
      });
    } else {
      console.error('No se encontró el div de datos generales.');
      this.isLoading = false;  // Asegurarse de que el spinner desaparezca si no se encuentra el `div`
    }
  }


  public async DesabilitaFormuarioscambiaEstado(): Promise<void> {

    this.componenteDatosGenerales.Desabilitacamposdespuesdeenvio();
    this.DatosRepresentantes.IdEstadoFormulario = 3;

    this.DatosRepresentantes.Desabilitacamposdespuesdeenvio();
    this.DatosRepresentantes.IdEstadoFormulario = 3;

    this.DatosJuntaDirectiva.Desabilitacamposdespuesdeenvio();
    this.DatosJuntaDirectiva.IdEstadoFormulario = 3;

    this.DatosAccionistas.Desabilitacamposdespuesdeenvio()
    this.DatosAccionistas.IdEstadoFormulario = 3;

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




    //this.seleccionarTab2('DatosGenerales-tab');	
    //const canvasDatosGenerales = await this.generateCanvas(this.componenteDatosGenerales.ObtenerDivFormulario());

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


  RechazarForm(): void {
    const modalRef = this.modalService.open(RechazoModalComponent, {
      centered: true,
      windowClass: 'custom-modal-width'
    });
    modalRef.componentInstance.formularioId = this.IdFormulario;
    modalRef.componentInstance.isReadOnly = false;

    modalRef.result.then((result) => {
      if (result) {


        const motivoRechazo: MotivoRechazo = {
          IdFormulario: this.IdFormulario,
          MotivoRechazo: result.motivo,
          FechaRechazo: ''

        }

        this.serviciocliente.RechazarFomulario(motivoRechazo).subscribe((response) => {
          this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Registro Creado Correctamente!';
          modalRef.componentInstance.title = '!';

          this.router.navigate(['/pages/dash/ListaRegistros']);
          // Aquí podrías manejar la respuesta del servidor si es necesario
        },
          (error) => {
            this.isLoading = false;
            const modalRef = this.modalService.open(AlertModalComponent);
            modalRef.componentInstance.name = 'Error al crear Registro!\n'
              + error.error;
            modalRef.componentInstance.title = 'Error';
            modalRef.componentInstance.isError = true;

          });



        console.log('Formulario Rechazado:', result.formularioId, 'Motivo:', result.motivo);
        // Lógica para manejar el rechazo del formulario
      }
    }, (reason) => {
      // Lógica para manejar el cierre del modal sin rechazo
      console.log('Modal cerrado sin rechazar:', reason);
    });
  }

  async AceptaContabildad() {
    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));

    this.serviciocliente.CambiarEstado(this.IdFormulario, 5).subscribe((response) => {
      this.isLoading = false;
      this.hideLoadingModal();
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Informacion Guardada!';
      modalRef.componentInstance.title = '!';
      this.hideLoadingModal();

      document.body.style.overflow = 'visible';
      this.router.navigate(['/pages/dash/ListaRegistros']);
      // Aquí podrías manejar la respuesta del servidor si es necesario
    },
      (error) => {
        this.isLoading = false;
        this.hideLoadingModal();
        document.body.style.overflow = 'visible';
        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Error al crear Registro!\n'
          + error.error;
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.isError = true;
      });

  }


  async AceptaControlInterno() {
    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));
    this.serviciocliente.AceptaFormualio(this.IdFormulario, 5).subscribe((response) => {
      this.isLoading = false;
      const modalRef = this.modalService.open(AlertModalComponent);
      modalRef.componentInstance.name = 'Informacion Guardada!';
      modalRef.componentInstance.title = '!';
      this.hideLoadingModal();
      document.body.style.overflow = 'visible';
      this.router.navigate(['/pages/dash/ListaRegistros']);
      // Aquí podrías manejar la respuesta del servidor si es necesario
    },
      (error) => {
        this.isLoading = false;
        this.hideLoadingModal();
        document.body.style.overflow = 'visible';
        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Error al crear Registro!\n'
          + error.error;
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.isError = true;
      });

  }


  RechazarControlInterno(): void {
    const modalRef = this.modalService.open(RechazoModalComponent, {
      centered: true,
      windowClass: 'custom-modal-width'
    });
    modalRef.componentInstance.formularioId = this.IdFormulario;
    modalRef.componentInstance.isReadOnly = false;

    modalRef.result.then((result) => {
      if (result) {
        const motivoRechazo: MotivoRechazo = {
          IdFormulario: this.IdFormulario,
          MotivoRechazo: result.motivo,
          FechaRechazo: ''
        }

        this.serviciocliente.RechazarFomulario(motivoRechazo).subscribe((response) => {
          this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Registro Creado Correctamente!';
          modalRef.componentInstance.title = '!';

          this.router.navigate(['/pages/dash/ListaRegistros']);
          // Aquí podrías manejar la respuesta del servidor si es necesario
        },
          (error) => {
            this.isLoading = false;
            const modalRef = this.modalService.open(AlertModalComponent);
            modalRef.componentInstance.name = 'Error al crear Registro!\n'
              + error.error;
            modalRef.componentInstance.title = 'Error';
            modalRef.componentInstance.isError = true;

          });



        console.log('Formulario Rechazado:', result.formularioId, 'Motivo:', result.motivo);
        // Lógica para manejar el rechazo del formulario
      }
    }, (reason) => {
      // Lógica para manejar el cierre del modal sin rechazo
      console.log('Modal cerrado sin rechazar:', reason);
    });
  }



}




