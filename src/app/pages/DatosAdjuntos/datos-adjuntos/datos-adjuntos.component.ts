import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';

@Component({
  selector: 'app-datos-adjuntos',
  templateUrl: './datos-adjuntos.component.html',
  styleUrls: ['./datos-adjuntos.component.scss']
})

export class DatosAdjuntosComponent {
  @Output() formReady = new EventEmitter<FormGroup>();
  @Input() IdFormulario: number;
  @Input() IdEstadoFormulario: number;
  @Input() editable: boolean;
  @Input() categoriaTercero: number | null = null;
  @Input() classClient: boolean = false;
  @Input() classProveedor: boolean = false;
  @Input() classAliado: boolean = false;
  @Input() esPersonaNatural: boolean = false;
  @Input() esPersonaJuridica: boolean = false;
  

  private modalService = inject(NgbModal);
  adjuntosForm: FormGroup;
  files: { [key: string]: File } = {};
  disableCertificacionBancariaJuridica: boolean = false;

  fileOverActive: boolean = false;

  disableCamaraComercioDrop: boolean = false;
  //Aliados
  disableRepLegDrop: boolean = false;
  disableCamComer: boolean = false;
  disableRUTAliado: boolean = false;
  disableAnexoAli: boolean = false;

  //cliente
  disableIdPersonaNatural: boolean = false;
  disableDeclaracionRentaNatural: boolean = false;
  disableDeclaracionRentaJuridica: boolean = false;
  disableCertificacionBancaria: boolean = false;
  disableRUTCliNat: boolean = false;
  disableRUTCliente: boolean = false;
  disableEstadosFinancierosNatural: boolean = false;
  disableEstadosFinancierosJuridica: boolean = false;
  disableCamaraComercioNatural: boolean = false;
  disableReferenciaComercialBancariaNatural: boolean = false;
  disableReferenciaComercialBancariaJuridica: boolean = false;
  disableAnexosFormularioNatural: boolean = false;
  disableAnexosFormularioJuridica: boolean = false;

  disableIdRepresentanteLegalProveedor: boolean = false;
  disableCamaraComercioProveedor: boolean = false;
  disableRUTProveedor: boolean = false;
  disableDeclaracionRentaProveedor: boolean = false;
  disableCertificacionBancariaProveedor: boolean = false;
  disableCertificadoLibertadProveedor: boolean = false;
  disableEstadosFinancierosProveedor: boolean = false;
  disablePortafolioServiciosProveedor: boolean = false;
  disableCertificacionComercialProveedor: boolean = false;
  disablePremiosReconocimientosProveedor: boolean = false;
  disableCertificadoInmuebleProveedor: boolean = false;
  disableAcuerdoConfidencialidadProveedor: boolean = false;
  disableCertificadoARLProveedor: boolean = false;
  disableAnexosFormularioProveedor: boolean = false;
  disableIdProveedorNatural: boolean = false;
  disableDeclaracionRentaProveedorNatural: boolean = false;
  disableCertificacionBancariaProveedorNatural: boolean = false;
  disableCertificadoLibertadProveedorNatural: boolean = false;
  disableAcuerdoConfidencialidadProveedorNatural: boolean = false;
  disableAnexosFormularioProveedorNatural: boolean = false;
  disableIdRepresentanteLegalCliente: boolean = false;


  archivosCargados: any[];

  preloadedFiles: { [key: string]: File } = {};


  constructor(private fb: FormBuilder, private serviciocliente: ServicioPrincipalService, private cdr: ChangeDetectorRef, private translate: TranslateService) {
    this.adjuntosForm = this.fb.group({
      //RUT: [null, Validators.required],
      CamaraComercioCliente: [null],
      // Aliados
      IdRepresentanteLegalAliado: [null],
      CamaraComercioAliado: [null],
      RUTAliado: [null],
      AnexosFormularioAliado: [null],
      //cliente
      IdPersonaNatural: [null],
      DeclaracionRentaNatural: [null],
      DeclaracionRentaJuridica: [null],
      CertificacionBancaria: [null],
      CertificacionBancariaJuridica: [null],
      RUTCliNat: [null],
      RUTCliente: [null],
      EstadosFinancierosNatural: [null],
      EstadosFinancierosJuridica: [null],
      CamaraComercioNatural: [null],
      ReferenciaComercialBancariaNatural: [null],
      ReferenciaComercialBancariaJuridica: [null],
      AnexosFormularioNatural: [null],
      AnexosFormularioJuridica: [null],
      IdRepresentanteLegalCliente: [null],
      // Jurídica Proveedor
      IdRepresentanteLegalProveedor: [null],
      CamaraComercioProveedor: [null],
      RUTProveedor: [null],
      DeclaracionRentaProveedor: [null],
      CertificacionBancariaProveedor: [null],
      CertificadoLibertadProveedor: [null],
      EstadosFinancierosProveedor: [null],
      PortafolioServiciosProveedor: [null],
      CertificacionComercialProveedor: [null],
      PremiosReconocimientosProveedor: [null],
      CertificadoInmuebleProveedor: [null],
      AcuerdoConfidencialidadProveedor: [null],
      CertificadoARLProveedor: [null],
      AnexosFormularioProveedor: [null],
      //Natural Proveedor
      IdProveedorNatural: [null],
      DeclaracionRentaProveedorNatural: [null],
      CertificacionBancariaProveedorNatural: [null],
      CertificadoLibertadProveedorNatural: [null],
      AcuerdoConfidencialidadProveedorNatural: [null],
      AnexosFormularioProveedorNatural: [null],
    });



    this.formReady.emit(this.adjuntosForm);
  }
  idCategoriaTercero: string = '';


  async ngOnInit(): Promise<void> {


    if (this.IdFormulario !== 0 && this.IdFormulario !== undefined) {
      this.serviciocliente.ConsultaArchivosSUBIDOS(this.IdFormulario).subscribe(
        (response) => {
          this.archivosCargados = response;
          if (this.archivosCargados !== null) {

            this.archivosCargados.forEach(archivo => {
              if (archivo.key === 'IdRepresentanteLegalAliado') {
                this.adjuntosForm.patchValue({
                  IdRepresentanteLegalAliado: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableRepLegDrop = true;
              } else if (archivo.key === 'CamaraComercioCliente') {
                this.adjuntosForm.patchValue({
                  CamaraComercioCliente: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCamaraComercioDrop = true;
              } else if (archivo.key === 'CamaraComercioAliado') {
                this.adjuntosForm.patchValue({
                  CamaraComercioAliado: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCamComer = true;
              } else if (archivo.key === 'RUTAliado') {
                this.adjuntosForm.patchValue({
                  RUTAliado: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableRUTAliado = true;
              } else if (archivo.key === 'RUTCliente') {
                this.adjuntosForm.patchValue({
                  RUTCliente: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableRUTCliente = true;
              } else if (archivo.key === 'AnexosFormularioAliado') {
                this.adjuntosForm.patchValue({
                  AnexosFormularioAliado: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAnexoAli = true;
              } else if (archivo.key === 'AnexosFormularioJuridica') {
                this.adjuntosForm.patchValue({
                  AnexosFormularioJuridica: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAnexosFormularioJuridica = true;
              }
              else if (archivo.key === 'IdRepresentanteLegalCliente') {
                this.adjuntosForm.patchValue({
                  IdRepresentanteLegalCliente: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableIdRepresentanteLegalCliente = true;
              } else if (archivo.key === 'IdPersonaNatural') {
                this.adjuntosForm.patchValue({
                  IdPersonaNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableIdPersonaNatural = true;
              } else if (archivo.key === 'DeclaracionRentaNatural') {
                this.adjuntosForm.patchValue({
                  DeclaracionRentaNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableDeclaracionRentaNatural = true;
              } else if (archivo.key === 'DeclaracionRentaJuridica') {
                this.adjuntosForm.patchValue({
                  DeclaracionRentaJuridica: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableDeclaracionRentaJuridica = true;
              } else if (archivo.key === 'CertificacionBancaria') {
                this.adjuntosForm.patchValue({
                  CertificacionBancaria: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificacionBancaria = true;
              } else if (archivo.key === 'CertificacionBancariaJuridica') {
                this.adjuntosForm.patchValue({
                  CertificacionBancariaJuridica: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificacionBancariaJuridica = true;
              }
              else if (archivo.key === 'RUTCliNat') {
                this.adjuntosForm.patchValue({
                  RUTCliNat: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableRUTCliNat = true;
              } else if (archivo.key === 'EstadosFinancierosNatural') {
                this.adjuntosForm.patchValue({
                  EstadosFinancierosNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableEstadosFinancierosNatural = true;
              } else if (archivo.key === 'EstadosFinancierosJuridica') {
                this.adjuntosForm.patchValue({
                  EstadosFinancierosJuridica: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableEstadosFinancierosJuridica = true;
              }
              else if (archivo.key === 'CamaraComercioNatural') {
                this.adjuntosForm.patchValue({
                  CamaraComercioNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCamaraComercioNatural = true;
              } else if (archivo.key === 'ReferenciaComercialBancariaNatural') {
                this.adjuntosForm.patchValue({
                  ReferenciaComercialBancariaNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableReferenciaComercialBancariaNatural = true;
              } else if (archivo.key === 'ReferenciaComercialBancariaJuridica') {
                this.adjuntosForm.patchValue({
                  ReferenciaComercialBancariaJuridica: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableReferenciaComercialBancariaJuridica = true;
              }
              else if (archivo.key === 'AnexosFormularioNatural') {
                this.adjuntosForm.patchValue({
                  AnexosFormularioNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAnexosFormularioNatural = true;
              } else if (archivo.key === 'IdRepresentanteLegalProveedor') {
                this.adjuntosForm.patchValue({
                  IdRepresentanteLegalProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableIdRepresentanteLegalProveedor = true;
              }
              else if (archivo.key === 'CamaraComercioProveedor') {
                this.adjuntosForm.patchValue({
                  CamaraComercioProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCamaraComercioProveedor = true;
              }
              else if (archivo.key === 'RUTProveedor') {
                this.adjuntosForm.patchValue({
                  RUTProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableRUTProveedor = true;
              }
              else if (archivo.key === 'DeclaracionRentaProveedor') {
                this.adjuntosForm.patchValue({
                  DeclaracionRentaProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableDeclaracionRentaProveedor = true;
              } else if (archivo.key === 'CertificacionBancariaProveedor') {
                this.adjuntosForm.patchValue({
                  CertificacionBancariaProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificacionBancariaProveedor = true;
              }
              else if (archivo.key === 'CertificadoLibertadProveedor') {
                this.adjuntosForm.patchValue({
                  CertificadoLibertadProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificadoLibertadProveedor = true;
              }
              else if (archivo.key === 'EstadosFinancierosProveedor') {
                this.adjuntosForm.patchValue({
                  EstadosFinancierosProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableEstadosFinancierosProveedor = true;
              }
              else if (archivo.key === 'PortafolioServiciosProveedor') {
                this.adjuntosForm.patchValue({
                  PortafolioServiciosProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disablePortafolioServiciosProveedor = true;
              }
              else if (archivo.key === 'CertificacionComercialProveedor') {
                this.adjuntosForm.patchValue({
                  CertificacionComercialProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificacionComercialProveedor = true;
              }
              else if (archivo.key === 'PremiosReconocimientosProveedor') {
                this.adjuntosForm.patchValue({
                  PremiosReconocimientosProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disablePremiosReconocimientosProveedor = true;
              }
              else if (archivo.key === 'CertificadoInmuebleProveedor') {
                this.adjuntosForm.patchValue({
                  CertificadoInmuebleProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificadoInmuebleProveedor = true;
              }
              else if (archivo.key === 'AcuerdoConfidencialidadProveedor') {
                this.adjuntosForm.patchValue({
                  AcuerdoConfidencialidadProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAcuerdoConfidencialidadProveedor = true;
              }
              else if (archivo.key === 'CertificadoARLProveedor') {
                this.adjuntosForm.patchValue({
                  CertificadoARLProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificadoARLProveedor = true;
              }
              else if (archivo.key === 'AnexosFormularioProveedor') {
                this.adjuntosForm.patchValue({
                  AnexosFormularioProveedor: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAnexosFormularioProveedor = true;
              }
              else if (archivo.key === 'IdProveedorNatural') {
                this.adjuntosForm.patchValue({
                  IdProveedorNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableIdProveedorNatural = true;
              }
              else if (archivo.key === 'DeclaracionRentaProveedorNatural') {
                this.adjuntosForm.patchValue({
                  DeclaracionRentaProveedorNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableDeclaracionRentaProveedorNatural = true;
              }
              else if (archivo.key === 'CertificacionBancariaProveedorNatural') {
                this.adjuntosForm.patchValue({
                  CertificacionBancariaProveedorNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificacionBancariaProveedorNatural = true;
              }
              else if (archivo.key === 'CertificadoLibertadProveedorNatural') {
                this.adjuntosForm.patchValue({
                  CertificadoLibertadProveedorNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableCertificadoLibertadProveedorNatural = true;
              }
              else if (archivo.key === 'AcuerdoConfidencialidadProveedorNatural') {
                this.adjuntosForm.patchValue({
                  AcuerdoConfidencialidadProveedorNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAcuerdoConfidencialidadProveedorNatural = true;
              }
              else if (archivo.key === 'AnexosFormularioProveedorNatural') {
                this.adjuntosForm.patchValue({
                  AnexosFormularioProveedorNatural: archivo.nombreArchivo + archivo.extencion,
                });
                this.disableAnexosFormularioProveedorNatural = true;
              }

            });
            this.archivosCargados.forEach(archivo => {
              const file = new File([''], archivo.nombreArchivo + archivo.extencion.trim());
              this.preloadedFiles[archivo.key] = file;
            });
            // Asignar los archivos preexistentes a this.files
            this.files = { ...this.preloadedFiles };

            this.cdr.detectChanges();
          }

        },
        (error) => {

        }
      );
    }

  }

  get isPersonaNatural(): boolean {
    return this.categoriaTercero === 3;
  }
  
  get isPersonaJuridica(): boolean {
    return this.categoriaTercero === 2;
  }
  

  ObtenerDivFormulario() {
    const DATA: any = document.getElementById('DatosAjuntosDiv');

    return DATA;
  }



  public onFilesDroppedviejoborrar(key: string, files: NgxFileDropEntry[]): void {
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.files[key] = file;
          this.adjuntosForm.get(key)?.setValue(file);

          this.serviciocliente.uploadFile2(file, key, this.IdFormulario).subscribe(
            (response) => {
              this.disableDropZone(key);
              const modalRef = this.modalService.open(AlertModalComponent);
              modalRef.componentInstance.name = 'Archivo Guardado Correctamente'
              modalRef.componentInstance.title = 'ok';
              modalRef.componentInstance.isError = false;
            },
            (error) => {
              const modalRef = this.modalService.open(AlertModalComponent);
              modalRef.componentInstance.name = 'Error al guardar: ' + error.message;
              modalRef.componentInstance.title = 'Error';
              modalRef.componentInstance.isError = true;
            }
          );
        });
      }
    }
  }

  public onFilesDropped(key: string, files: NgxFileDropEntry[]): void {
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

  
          // Generar un nombre de archivo único
          const uniqueNumber = Date.now(); // Usar un timestamp para asegurar unicidad
          const newFileName = `${key}-${uniqueNumber}-${this.IdFormulario}.pdf`; // Puedes ajustar la extensión según corresponda  
          // Crear un nuevo File con el Blob del archivo original y el nuevo nombre
          const newFile = new File([file], newFileName, { type: file.type });

          this.files[key] = newFile;
          this.adjuntosForm.get(key)?.setValue(newFile);
  
          // Enviar el nuevo archivo al servidor
          this.serviciocliente.uploadFile2(newFile, key, this.IdFormulario).subscribe(
            (response) => {
              this.disableDropZone(key);
              const modalRef = this.modalService.open(AlertModalComponent);
              modalRef.componentInstance.name = 'Archivo Guardado Correctamente';
              modalRef.componentInstance.title = 'Ok';
              modalRef.componentInstance.isError = false;
            },
            (error) => {
              const modalRef = this.modalService.open(AlertModalComponent);
              modalRef.componentInstance.name = 'Error al guardar: ' + error.message;
              modalRef.componentInstance.title = 'Error';
              modalRef.componentInstance.isError = true;
            }
          );
        });
      }
    }
  }

  public removeFile(key: string): void {
    delete this.files[key];
    this.adjuntosForm.get(key)?.setValue(null);
    this.enableDropZone(key);

    this.serviciocliente.EliminaArchivoCargado(this.IdFormulario, key).subscribe(
      (response) => {

        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Archivo Eliminado Correctamente'
        modalRef.componentInstance.title = 'ok';
        modalRef.componentInstance.isError = false;
      },
      (error) => {
        const modalRef = this.modalService.open(AlertModalComponent);
        modalRef.componentInstance.name = 'Error al guardar: ' + error.message;
        modalRef.componentInstance.title = 'Error';
        modalRef.componentInstance.isError = true;
      }
    );

  }

  public isInvalid(key: string): boolean {
    const control = this.adjuntosForm.get(key);
    return control ? control.invalid && control.touched : false;
  }

  obtenerDatosFormulario() {
    return this.adjuntosForm.value;
  }


  Desabilitacamposdespuesdeenvio() {
    this.editable = false;
    this.adjuntosForm.disable();
    this.disableDropZoneall();
    this.IdEstadoFormulario = 3
    
    this.cdr.detectChanges(); //

  }


  esFormularioValido() {
    return this.adjuntosForm.valid;
  }

  marcarFormularioComoTocado() {
    Object.values(this.adjuntosForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  async downloadfile(key: any, NombreDocumento: string) {
    //var url='https://localhost:7123/api/tickets/descarga?IdArchvio='+this.idAdjunto;
    //var url=`${this.apiUrl}/tickets/descarga?IdArchvio=${this.idAdjunto}`;
    //window.open(url, "_blank");
    this.serviciocliente.descargarArchivo(key, this.IdFormulario).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = NombreDocumento;  // Puedes cambiar esto para usar el nombre del archivo real
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, error => {
      console.error('Error al descargar el archivo:', error);
    });

  }




  private disableDropZone(key: string): void {
    switch (key) {
      case 'CamaraComercioCliente':
        this.disableCamaraComercioDrop = true;
        break;
      case 'IdRepresentanteLegalAliado':
        this.disableRepLegDrop = true;
        break;
      case 'CamaraComercioAliado':
        this.disableCamComer = true;
        break
      case 'RUTAliado':
        this.disableRUTAliado = true;
        break
      case 'RUTCliente':
        this.disableRUTCliente = true;
        break
      case 'AnexosFormularioAliado':
        this.disableAnexoAli = true;
        break
      case 'AnexosFormularioJuridica':
        this.disableAnexosFormularioJuridica = true;
        break
      case 'IdPersonaNatural':
        this.disableIdPersonaNatural = true;
        break
      case 'DeclaracionRentaNatural':
        this.disableDeclaracionRentaNatural = true;
        break
      case 'DeclaracionRentaJuridica':
        this.disableDeclaracionRentaJuridica = true;
        break
      case 'CertificacionBancaria':
        this.disableCertificacionBancaria = true;
        break
      case 'CertificacionBancariaJuridica':
        this.disableCertificacionBancariaJuridica = true;
        break
      case 'RUTCliNat':
        this.disableRUTCliNat = true;
        break
      case 'EstadosFinancierosNatural':
        this.disableEstadosFinancierosNatural = true;
        break
      case 'EstadosFinancierosJuridica':
        this.disableEstadosFinancierosJuridica = true;
        break
      case 'CamaraComercioNatural':
        this.disableCamaraComercioNatural = true;
        break
      case 'ReferenciaComercialBancariaNatural':
        this.disableReferenciaComercialBancariaNatural = true;
        break
      case 'ReferenciaComercialBancariaJuridica':
        this.disableReferenciaComercialBancariaJuridica = true;
        break
      case 'AnexosFormularioNatural':
        this.disableAnexosFormularioNatural = true;
        break
      case 'IdRepresentanteLegalProveedor':
        this.disableIdRepresentanteLegalProveedor = true;
        break;
      case 'CamaraComercioProveedor':
        this.disableCamaraComercioProveedor = true;
        break;
      case 'RUTProveedor':
        this.disableRUTProveedor = true;
        break;
      case 'DeclaracionRentaProveedor':
        this.disableDeclaracionRentaProveedor = true;
        break;
      case 'CertificacionBancariaProveedor':
        this.disableCertificacionBancariaProveedor = true;
        break;
      case 'CertificadoLibertadProveedor':
        this.disableCertificadoLibertadProveedor = true;
        break;
      case 'EstadosFinancierosProveedor':
        this.disableEstadosFinancierosProveedor = true;
        break;
      case 'PortafolioServiciosProveedor':
        this.disablePortafolioServiciosProveedor = true;
        break;
      case 'CertificacionComercialProveedor':
        this.disableCertificacionComercialProveedor = true;
        break;
      case 'PremiosReconocimientosProveedor':
        this.disablePremiosReconocimientosProveedor = true;
        break;
      case 'CertificadoInmuebleProveedor':
        this.disableCertificadoInmuebleProveedor = true;
        break;
      case 'AcuerdoConfidencialidadProveedor':
        this.disableAcuerdoConfidencialidadProveedor = true;
        break;
      case 'CertificadoARLProveedor':
        this.disableCertificadoARLProveedor = true;
        break;
      case 'AnexosFormularioProveedor':
        this.disableAnexosFormularioProveedor = true;
        break;

      // Persona Natural Proveedor
      case 'IdProveedorNatural':
        this.disableIdProveedorNatural = true;
        break;
      case 'DeclaracionRentaProveedorNatural':
        this.disableDeclaracionRentaProveedorNatural = true;
        break;
      case 'CertificacionBancariaProveedorNatural':
        this.disableCertificacionBancariaProveedorNatural = true;
        break;
      case 'CertificadoLibertadProveedorNatural':
        this.disableCertificadoLibertadProveedorNatural = true;
        break;
      case 'AcuerdoConfidencialidadProveedorNatural':
        this.disableAcuerdoConfidencialidadProveedorNatural = true;
        break;
      case 'AnexosFormularioProveedorNatural':
        this.disableAnexosFormularioProveedorNatural = true;
        break;
      case 'IdRepresentanteLegalCliente':
        this.disableIdRepresentanteLegalCliente = true;
        break;
    }
  }

  private enableDropZone(key: string): void {
    switch (key) {
      case 'IdRepresentanteLegalAliado':
        this.disableRepLegDrop = false;
        break;
      case 'CamaraComercioAliado':
        this.disableCamComer = false;
        break;
      case 'RUTAliado':
        this.disableRUTAliado = false;
        break;
      case 'RUTCliente':
        this.disableRUTCliente = false;
        break;
      case 'AnexosFormularioAliado':
        this.disableAnexoAli = false;
        break;
      case 'AnexosFormularioJuridica':
        this.disableAnexosFormularioJuridica = false;
        break;
      case 'IdPersonaNatural':
        this.disableIdPersonaNatural = false;
        break;
      case 'DeclaracionRentaNatural':
        this.disableDeclaracionRentaNatural = false;
        break
      case 'DeclaracionRentaJuridica':
        this.disableDeclaracionRentaJuridica = false;
        break
      case 'CertificacionBancaria':
        this.disableCertificacionBancaria = false;
        break
      case 'disableCertificacionBancariaJuridica':
        this.disableCertificacionBancariaJuridica = false;
        break
      case 'RUTCliNat':
        this.disableRUTCliNat = false;
        break
      case 'EstadosFinancierosNatural':
        this.disableEstadosFinancierosNatural = false;
        break
      case 'EstadosFinancierosJuridica':
        this.disableEstadosFinancierosJuridica = false;
        break
      case 'CamaraComercioNatural':
        this.disableCamaraComercioNatural = false;
        break
      case 'ReferenciaComercialBancariaNatural':
        this.disableReferenciaComercialBancariaNatural = false;
        break
      case 'ReferenciaComercialBancariaJuridica':
        this.disableReferenciaComercialBancariaJuridica = false;
        break
      case 'AnexosFormularioNatural':
        this.disableAnexosFormularioNatural = false;
        break

      case 'IdRepresentanteLegalProveedor':
        this.disableIdRepresentanteLegalProveedor = false;
        break;
      case 'CamaraComercioProveedor':
        this.disableCamaraComercioProveedor = false;
        break;
      case 'RUTProveedor':
        this.disableRUTProveedor = false;
        break;
      case 'DeclaracionRentaProveedor':
        this.disableDeclaracionRentaProveedor = false;
        break;
      case 'CertificacionBancariaProveedor':
        this.disableCertificacionBancariaProveedor = false;
        break;
      case 'CertificadoLibertadProveedor':
        this.disableCertificadoLibertadProveedor = false;
        break;
      case 'EstadosFinancierosProveedor':
        this.disableEstadosFinancierosProveedor = false;
        break;
      case 'PortafolioServiciosProveedor':
        this.disablePortafolioServiciosProveedor = false;
        break;
      case 'CertificacionComercialProveedor':
        this.disableCertificacionComercialProveedor = false;
        break;
      case 'PremiosReconocimientosProveedor':
        this.disablePremiosReconocimientosProveedor = false;
        break;
      case 'CertificadoInmuebleProveedor':
        this.disableCertificadoInmuebleProveedor = false;
        break;
      case 'AcuerdoConfidencialidadProveedor':
        this.disableAcuerdoConfidencialidadProveedor = false;
        break;
      case 'CertificadoARLProveedor':
        this.disableCertificadoARLProveedor = false;
        break;
      case 'AnexosFormularioProveedor':
        this.disableAnexosFormularioProveedor = false;
        break;

      // Persona Natural Proveedor
      case 'IdProveedorNatural':
        this.disableIdProveedorNatural = false;
        break;
      case 'DeclaracionRentaProveedorNatural':
        this.disableDeclaracionRentaProveedorNatural = false;
        break;
      case 'CertificacionBancariaProveedorNatural':
        this.disableCertificacionBancariaProveedorNatural = false;
        break;
      case 'CertificadoLibertadProveedorNatural':
        this.disableCertificadoLibertadProveedorNatural = false;
        break;
      case 'AcuerdoConfidencialidadProveedorNatural':
        this.disableAcuerdoConfidencialidadProveedorNatural = false;
        break;
      case 'AnexosFormularioProveedorNatural':
        this.disableAnexosFormularioProveedorNatural = false;
        break;


      case 'CamaraComercioCliente':
        this.disableCamaraComercioDrop = false;
        break;
      case 'IdRepresentanteLegalCliente':
        this.disableIdRepresentanteLegalCliente = false;
        break;
    }

  }

  disableDropZoneall(): void {
    this.disableCamaraComercioDrop = true;
    this.disableRepLegDrop = true;
    this.disableCamComer = true;
    this.disableRUTAliado = true;
    this.disableRUTCliente = true;
    this.disableAnexoAli = true;
    this.disableIdPersonaNatural
    this.disableCertificacionBancaria = true;
    this.disableCertificacionBancariaJuridica = true;
    this.disableRUTCliNat = true;
    this.disableDeclaracionRentaNatural = true;
    this.disableDeclaracionRentaJuridica = true;
    this.disableEstadosFinancierosNatural = true;
    this.disableEstadosFinancierosJuridica = true;
    this.disableCamaraComercioNatural = true;
    this.disableReferenciaComercialBancariaNatural = true;
    this.disableReferenciaComercialBancariaJuridica = true;
    this.disableAnexosFormularioNatural = true;
    this.disableAnexosFormularioJuridica = true;
  }


}
