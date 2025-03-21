import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../enviroments/environment.prod';
import { Cliente } from '../Models/ClienteModelDto';
import { Area } from '../Models/AreaModelDto';
import { Servicio } from '../Models/ServiciosModelDto';
import { Actividad } from '../Models/ActividadModelDto';
import { RegistroActividades } from '../Models/RegistroActividadDto';
import { DatosGeneralesDto } from '../Models/DatosGeneralesDto';
import { SSF } from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ServicioPrincipalService {

  private tokenKey = 'auth_token';
  private apiUrl =`${environment.apiUrl}/`;    
  private readonly apiClintelist: string = 'Cliente/listaClientes';
  private readonly apiCurrenUser: string = 'auth/current';
  private readonly Apichangepassword: string = 'auth/passwordchange';

  private readonly apilistEstados: string = 'ListasSeleccion/listaEstadosForm';
  private readonly apilistUsuariosclientes: string = 'ListasSeleccion/listaUsuariosclienteproveedor';


  private readonly apilistTipoSolicitud: string = 'ListasSeleccion/listaTipoSolicitud';
  private readonly apilistlClaseTercero: string = 'ListasSeleccion/listaClaseTercero';
  private readonly apilistCategoriaTerceros: string = 'ListasSeleccion/listaCategoriaTercero';
  private readonly apilistPaises: string = 'ListasSeleccion/listaPaises';
  private readonly apilistTamañoTercero: string = 'ListasSeleccion/listaTamañoTercero';
  private readonly apilistActividadesEconomicas: string = 'ListasSeleccion/listaActividadEconomica';
  private readonly apilistsino: string = 'ListasSeleccion/listaSiNO';

  private readonly apilistTipoDocumentos: string = 'ListasSeleccion/listaTiposDocumentos';

  private readonly apilistTipoCuentaBanc: string = 'ListasSeleccion/listaTipoCuentaBancaria';


  private readonly apilistTipoReferencia: string = 'ListasSeleccion/listaTipoReferenciaBanCom';

  private readonly apilistFormularios: string = 'RegistroFormulario/ListaFormularios';

  private readonly apilistResultadosInspektor: string = 'RegistroFormulario/ConsultaResultadosListas';
  
  private readonly ApiSolicitudNuevoFormulario: string = 'RegistroFormulario/SolicitudNuevoFormulario';

  private readonly ApiSolicitudCopiarFormulario: string = 'RegistroFormulario/ReplicaFormulario';
 
  private readonly ApiEstadoCambio: string = 'RegistroFormulario/CambiaEstadoFormulario';


  private readonly ApiAceptaFormulario: string = 'RegistroFormulario/ApruebaFormulario';


  private readonly apiCompradorVendedor: string = 'ListasSeleccion/listaEmpleados';
  private readonly apiUsuarioslist: string = 'auth/listaUsuariosAPP';

  private readonly apiEliminaArchivoCargado: string = 'RegistroFormulario/EliminaArchivoCargado';
  private readonly apiMotivoRechazo: string = 'RegistroFormulario/ConsultaMotivoRechazo';
  private readonly apiArchivosSubidos: string = 'RegistroFormulario/ListaArchivosCargadosxFormualrio';
  private readonly apidESCARGARARCHIVO: string = 'RegistroFormulario/descargararchivo';

  private readonly apiDescargaInfoInkspektor: string = 'RegistroFormulario/descargaReporteInspektor';

  private readonly ApiDatosGeneralesSave: string = 'RegistroFormulario/GuardaDatosGenerales';

  private readonly ApiDatosContactosSave: string = 'RegistroFormulario/GuardaDatosContacto';

  private readonly ApiReferenciasSave: string = 'RegistroFormulario/GuardaReferenciasComerciales';

  private readonly ApiDatoPagoSave: string = 'RegistroFormulario/GuardaDatosPago';

  private readonly ApiCumplimientoNormSave: string = 'RegistroFormulario/GuardaCumplimientoNormativo';
  
  private readonly ApiGuardarConflictoIntereses: string = 'RegistroFormulario/GuardaConflictoInteres';

  private readonly ApGuardaInformacionComplementaria: string = 'RegistroFormulario/GuardaInformacionComplementaria';

  private readonly ApiGuardaInformacionFinanciera: string = 'RegistroFormulario/GuardaInformacionFinanciera';

  private readonly ApiGuardaDatosRevisorFiscal: string = 'RegistroFormulario/GuardaDatosRevisorFiscal';

  private readonly ApiCalcularRiesgo: string = 'RegistroFormulario/CalcularRiesgo';

  private readonly ApiConsultarRiesgo: string = 'RegistroFormulario/ConsultarRiesgo';

  private readonly ApiGuardaInFoTribu: string = 'RegistroFormulario/GuardaInformacionTributaria';
  

  private readonly ApiDeclaracionesSave: string = 'RegistroFormulario/GuardaDeclaracionesFormulario';

  private readonly ApiDespachoMercanciaSave: string = 'RegistroFormulario/GuardaDespachoMercancia';

  private readonly ApiRepresentantesave: string = 'RegistroFormulario/GuardaInfoRepresentantesLegales';

  private readonly ApiAccionistassave: string = 'RegistroFormulario/GuardaInfoAccionistas';

  private readonly ApiJuntaDirectivasave: string = 'RegistroFormulario/GuardaInfoJuntaDirectiva';

  private readonly ApiSubirRCHIVOS: string = 'RegistroFormulario/uploadfiles';

  private readonly apiConsultaDatosGenerales: string = 'RegistroFormulario/ConsultaDatosGenerales';

  private readonly apiConsultaInformacionTributaria: string = 'RegistroFormulario/ConsultaInformacionTriburaria';


  private readonly apiConsultaInfoOEA: string = 'RegistroFormulario/ConsultaInformacionOEA';

  private readonly apiConsultaDatosContacto: string = 'RegistroFormulario/ConsultaDatosContactos';

  private readonly apiConsultaReferencais: string = 'RegistroFormulario/ConsultaReferenciasFinancieras';

  private readonly apiConsultaDatosPgo: string = 'RegistroFormulario/ConsultaDatosPago';

private readonly apiRepresentantelegal: string = 'RegistroFormulario/ConsultaRepresentanteLegal'

private readonly apiconsultaAccionistas: string = 'RegistroFormulario/ConsultaAccionistas'

private readonly apiconsultaJuntaDirectiva: string = 'RegistroFormulario/Consultajuntadirectiva'

  private readonly apiConsultaDespachoMercancia: string = 'RegistroFormulario/ConsultaDespachoMercancia';

  private readonly apiConsultaCumplimiento: string = 'RegistroFormulario/ConsultaCumplimientoNormativo';

  private readonly ApiConsultaConflictoIntereses: string = 'RegistroFormulario/ConsultaConflictoInteres';

  private readonly ApiConsultaInformacionComplementaria: string = 'RegistroFormulario/ConsultaInformacionComplementaria';

  private readonly ApiConsultaInformacionFinanciera: string = 'RegistroFormulario/ConsultaInformacionFinanciera';

  private readonly ApiConsultaDatosRevisorFiscal: string = 'RegistroFormulario/ConsultaDatosRevisorFiscal';

  private readonly apiConsultaDeclaraciones: string = 'RegistroFormulario/ConsultaDeclaraciones';


  private readonly apiUploadArchivosolo: string = 'RegistroFormulario/upload2';

  private readonly Apicreatenewuser: string = 'auth/addnewuser';
  private readonly ApiRechazarFomulario: string = 'RegistroFormulario/GuardaMotivoRechazo';
  private readonly ApiGuardaInfoOEA: string = 'RegistroFormulario/GuardaInformacionOEA';
  private readonly Apiedituser: string = 'auth/edituser';
  private readonly ApiUpdatepassword: string = 'auth/passwordUpdate';
  //url reporte

  private readonly ApiRpteArea :string = 'Reporte/reportehorastrabajadasarea';
  private readonly ApiRpteUsuario: string = 'Reporte/ReporteRegistroTiemposxUsuario';
  private readonly ApiRpreCliente: string = 'Reporte/ReporteRegistroTiemposxCliente';
  private readonly apiReporteServicio: string = 'Reporte/ReporteRegistroTiemposxServicio';

  private readonly apiReporteServicioFiltros: string = 'ReporteForm/GenerateExcel';


  private readonly ApiProcuraduria: string = 'RegistroFormulario/ConsultaInfoProcuraduria';
  private readonly ApiRamaJudicial: string = 'RegistroFormulario/ConsultaInfoRamaJudicial';
  private readonly ApiEjecucionPneas: string = 'RegistroFormulario/ConsultaInfoEjecucionPenas';



  private headers: any;
  private token: any;
  constructor(private http: HttpClient) { 

    this.token= this.gettoken();
    this.headers = {           
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        })
      };

  }

  gettoken(): string | null {
    const tokenString = localStorage.getItem(this.tokenKey);
  if (!tokenString) {
    return null;  // No hay token almacenado
  }  
  try {
    const localestorage = JSON.parse(tokenString);
    const token = localestorage.token.access_token;
    return token;
  } catch (e) {
    console.error('Error parsing token from localStorage', e);
    return null;
  }
}

CurrentUser(): Observable<any>{  
  return this.http.get<any>(`${this.apiUrl}${this.apiCurrenUser}`,this.headers);
}

changepassword(data:any): Observable<any>{
  return  this.http.post(`${this.apiUrl}${this.Apichangepassword}`, data, this.headers);
}

ListTipoSolicitud(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoSolicitud}?Lang=${Lang}`,this.headers);
}


ListEstadosform(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistEstados}`,this.headers);
}

ListUsuarios(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistUsuariosclientes}`,this.headers);
}



MotivoRechazoservice(IdFormualio:number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apiMotivoRechazo}?IdFormulario=${IdFormualio}`,this.headers);
}

ListClaseTercero(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistlClaseTercero}?Lang=${Lang}`,this.headers);
}

ListCategoriaTercero(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistCategoriaTerceros}?Lang=${Lang}`,this.headers);
}

ListPaises(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistPaises}?Lang=${Lang}`,this.headers);
}

ListTamañoTercero(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTamañoTercero}?Lang=${Lang}`,this.headers);
}

ListActividadEconomica(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistActividadesEconomicas}?Lang=${Lang}`,this.headers);
}

ListaSINO(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistsino}?Lang=${Lang}`,this.headers);
}

ListaTiposDocumentos(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoDocumentos}?Lang=${Lang}`,this.headers);
}

ListaTiposCuentaBancaria(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoCuentaBanc}?Lang=${Lang}`,this.headers);
}
ListaTipoReferencia(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistTipoReferencia}?Lang=${Lang}`,this.headers);
}

getFormularioslist(Lang:string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistFormularios}?Lang=${Lang}`,this.headers);
}


getResultadosInspektorlist(IdFormualio:number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.apilistResultadosInspektor}?IdFormulario=${IdFormualio}`,this.headers);
}

CrearNuevoFormulario(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiSolicitudNuevoFormulario}`,this.headers);
}

CopiarFormualrio(IdFormualio:number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiSolicitudCopiarFormulario}?IdFormulario=${IdFormualio}`,this.headers);
}




GuardarDatosGnerales(objRegistro:DatosGeneralesDto): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDatosGeneralesSave}`, objRegistro,this.headers);
}

GuardarInformacionTriburaria(objRegistro:any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardaInFoTribu}`, objRegistro,this.headers);
}




guardarContactos(contactos: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDatosContactosSave}`, contactos,this.headers);
}

guardarReferencias(referencias: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiReferenciasSave}`, referencias,this.headers);
}

GuardarDatoPgado(datopago: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDatoPagoSave}`, datopago,this.headers);
}

GuardarCumplimientoNor(cumplimientoNorm: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiCumplimientoNormSave}`, cumplimientoNorm,this.headers);
}

GuardarConflictoIntereses(conflictoIntereses: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardarConflictoIntereses}`, conflictoIntereses, this.headers );
}

GuardarInformacionComplementaria(informacionComplementaria: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApGuardaInformacionComplementaria}`, informacionComplementaria, this.headers );
}

GuardaInformacionFinanciera(informacionFinanciera: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardaInformacionFinanciera}`, informacionFinanciera, this.headers );
}

GuardaDatosRevisorFiscal(datosRevisorFiscal: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiGuardaDatosRevisorFiscal}`, datosRevisorFiscal, this.headers );
}

CalcularRiesgoFormulario(IdFormulario: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiCalcularRiesgo}?IdFormulario=${IdFormulario}`, this.headers);
}

ObtenerRiesgoFormulario(IdFormulario: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiConsultarRiesgo}?IdFormulario=${IdFormulario}`, this.headers);
}

GuardarDeclaraciones(declaracion: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDeclaracionesSave}`, declaracion,this.headers);
}


GuardarDespachoMercancia(despacho: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiDespachoMercanciaSave}`, despacho,this.headers);
}

guardarRepresentantesLegales(IdFormulario:number,representantes: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiRepresentantesave}/${IdFormulario}`, representantes,this.headers);
}


guardarAccionistas(IdFormulario:number,accionistas: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiAccionistassave}/${IdFormulario}`, accionistas,this.headers);
}

guardarJuntaDirectiva(IdFormulario:number,juntadirectiva: any[]): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}${this.ApiJuntaDirectivasave}/${IdFormulario}`, juntadirectiva,this.headers);
}



CambiarEstado(IdFormualrio:number,IdEstado:Number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiEstadoCambio}?IdFormulario=${IdFormualrio}&IdEstado=${IdEstado}`,this.headers);
}



AceptaFormualio(IdFormualrio:number,IdEstado:Number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}${this.ApiAceptaFormulario}?IdFormulario=${IdFormualrio}&IdEstado=${IdEstado}`,this.headers);
}


uploadFiles(idFormulario: string, files: { [key: string]: File }): Observable<any> {
  const formData = new FormData();
  formData.append('IdFormulario', idFormulario);

  // Agrega cada archivo al FormData con su clave
  for (const key in files) {
    if (files.hasOwnProperty(key)) {
      formData.append(key, files[key]);
    }
  }

  return this.http.post(this.ApiSubirRCHIVOS, formData);
}

enviarAdjuntos(formData: FormData) {
  return this.http.post(`${this.apiUrl}${this.ApiSubirRCHIVOS}`, formData);
}



//Reportes

getReporteArea(): Observable<any>{  
  return this.http.get<any>(`${this.apiUrl}${this.ApiRpteArea}`,this.headers);
}

getReporteUsuarios(): Observable<any>{  
  return this.http.get<any>(`${this.apiUrl}${this.ApiRpteUsuario}`,this.headers);
}

getAReporteCliente(): Observable<any>{  
  return this.http.get<any>(`${this.apiUrl}${this.ApiRpreCliente}`,this.headers);
}

getReporteServicio(): Observable<any>{  
  return this.http.get<any>(`${this.apiUrl}${this.apiReporteServicio}`,this.headers);
  }

  getReporteServicioFiltro(filtro:any): Observable<any>{  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.apiReporteServicioFiltros}`, filtro, {
      headers,
      responseType: 'blob'
    });
  }



  ConsultaDatosGenerales(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDatosGenerales}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultaInformacionTributaria(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaInformacionTributaria}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultainfoOEA(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaInfoOEA}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaDatosContactos(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDatosContacto}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultaReferenciasFinancieras(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaReferencais}?IdFormulario=${IdFormualio}`,this.headers);
  }


  ConsultaDatosdepago(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDatosPgo}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaDespachoMercancia(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDespachoMercancia}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaCumplimiento(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaCumplimiento}?IdFormulario=${IdFormualio}`,this.headers);
  }

  ConsultaConflictoIntereses(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaConflictoIntereses}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultarInformacionComplementaria(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaInformacionComplementaria}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultaInformacionFinanciera(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaInformacionFinanciera}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultaDatosRevisorFiscal(IdFormulario: number): Observable<any> {
    return this.http.get<any>( `${this.apiUrl}${this.ApiConsultaDatosRevisorFiscal}?IdFormulario=${IdFormulario}`, this.headers);
  }

  ConsultaDeclaraciones(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiConsultaDeclaraciones}?IdFormulario=${IdFormualio}`,this.headers);
  }

  


  cosultaRepresentates(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiRepresentantelegal}?IdFormulario=${IdFormualio}`,this.headers);
  }


  cosultaAccionistas(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiconsultaAccionistas}?IdFormulario=${IdFormualio}`,this.headers);
  }


  cosultaJuntaDirectiva(IdFormualio:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${this.apiconsultaJuntaDirectiva}?IdFormulario=${IdFormualio}`,this.headers);
  }
  //


  getUsuarioslist(): Observable<any>{  
    return this.http.get<any>(`${this.apiUrl}${this.apiUsuarioslist}`,this.headers);
  }


  getCompradorVendedor(): Observable<any>{  
    return this.http.get<any>(`${this.apiUrl}${this.apiCompradorVendedor}`,this.headers);
  }

  createnewUser(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.Apicreatenewuser}`, data, this.headers);
  }


  RechazarFomulario(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.ApiRechazarFomulario}`, data, this.headers);
  }

  editUser(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.Apiedituser}`, data, this.headers);
  }

  updatepassword(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.ApiUpdatepassword}`, data, this.headers);
  }

  GuardarInfoOEA(data:any): Observable<any>{
    return  this.http.post(`${this.apiUrl}${this.ApiGuardaInfoOEA}`, data, this.headers);
  }


  uploadFile2(file: File,key: string, idFormulario: number): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('idFormulario', idFormulario.toString());
    formData.append('key', key);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.post(`${this.apiUrl}${this.apiUploadArchivosolo}`, formData, { headers });
  }




  uploadPdfEnviado(pdfBlob: Blob,idFormualrio:number): Observable<any> {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'PDFEnviado_Formulario_'+idFormualrio+'.pdf');
    formData.append('idFormulario', idFormualrio.toString());
    formData.append('key', 'PDFEnviado');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });



    return this.http.post(`${this.apiUrl}${this.apiUploadArchivosolo}`, formData, { headers });
  }



  EliminaArchivoCargado(IdFormualio:number,key:string): Observable<any>{  
    return this.http.get<any>(`${this.apiUrl}${this.apiEliminaArchivoCargado}?IdFormulario=${IdFormualio}&Key=${key}`,this.headers);
  }

  ConsultaArchivosSUBIDOS(IdFormualio:number): Observable<any>{  
    return this.http.get<any>(`${this.apiUrl}${this.apiArchivosSubidos}?IdFormulario=${IdFormualio}`,this.headers);
  }


  descargarArchivo(key: string, idFormulario: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}${this.apidESCARGARARCHIVO}?key=${key}&idFormulario=${idFormulario}`, {
      headers,
      responseType: 'blob'
    });
  }

  descargarReporteInspektor(IdConsulta: number): Observable<Blob> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}${this.apiDescargaInfoInkspektor}?IdConsulta=${IdConsulta}`, {
      headers,
      responseType: 'blob'
    });
  }

  ConsultaProcuraduria(data:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.ApiProcuraduria}`, data,  {
      headers,
      responseType: 'blob'
    });
  }

  ConsultaRamaJudicial(data:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.ApiRamaJudicial}`, data, {
      headers,
      responseType: 'blob'
    });
  }

  ConsultaEjecucionPenas(data:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return  this.http.post(`${this.apiUrl}${this.ApiEjecucionPneas}`, data, {
      headers,
      responseType: 'blob'
    });
  }




//apiUploadArchivosolo
}