import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import { ServicioPrincipalService } from '../../Services/main.services';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as bootstrap from 'bootstrap';
import { ListasAdicionalesDto } from '../../Models/listasadicionalesDto';
import { colorSets } from '@swimlane/ngx-charts';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { AlertModalComponent } from '../alert-modal/alert-modal.component';
@Component({
  selector: 'app-resultado-listas-inspektor',
  templateUrl: './resultado-listas-inspektor.component.html',
  styleUrl: './resultado-listas-inspektor.component.scss'
})
export class ResultadoListasInspektorComponent {
  private modalService = inject(NgbModal);
  @Input() formularioId!: number;
  dataSource: any[] = [];
  filteredDataSource:any[] = [];
  totalItems = 0; // Inicializado a 0
  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  searchTerm: string = '';
  adjuntosForm: FormGroup;
  files: { [key: string]: File } = {};
  disableDebidaDiligencia: boolean = false;
  archivosCargados: any[];
  preloadedFiles: { [key: string]: File } = {};

  constructor(private paginationConfig: NgbPaginationConfig,private serviciocliente: ServicioPrincipalService,public activeModal: NgbActiveModal,private fb: FormBuilder){
    this.paginationConfig.boundaryLinks = true;
    this.paginationConfig.rotate = true;
    this.adjuntosForm = this.fb.group({
      DebidaDiligencia: [null],    
      // Agrega los demás campos aquí
    });


  }

  ngOnInit() {
    this.loadItems();
    this.loadAdjuntos();
  }

  loadItems() {
    this.isLoading = true;
    this.serviciocliente.getResultadosInspektorlist(this.formularioId).subscribe((data: any[])=> {
      this.dataSource = data; // Asigna los datos obtenidos al dataSource
      this.filteredDataSource = data;
      this.totalItems = data.length; // Establece el total de ítems
      this.isLoading = false;
    });
  }

  loadAdjuntos(){   
      this.serviciocliente.ConsultaArchivosSUBIDOS(this.formularioId).subscribe(
        (response) => {
          this.archivosCargados = response;
          if (this.archivosCargados !== null) {

            this.archivosCargados.forEach(archivo => {
              if (archivo.key === 'DebidaDiligencia') {
                this.adjuntosForm.patchValue({
                  DebidaDiligencia: archivo.nombreArchivo + archivo.extencion,
                }); 
                this.disableDebidaDiligencia = true;              
              }
            });
            this.archivosCargados.forEach(archivo => {
              const file = new File([''], archivo.nombreArchivo + archivo.extencion.trim());
              this.preloadedFiles[archivo.key] = file;
            });
            // Asignar los archivos preexistentes a this.files
            this.files = { ...this.preloadedFiles };
          }

        },
        (error) => {

        }
      );
    
  }

  getPagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.filteredDataSource.slice(startIndex, endIndex);
  }

  applyFilter() {
    this.filteredDataSource = this.dataSource.filter(element =>
      element.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.numero_Consulta.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.numero_Identificacion.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
    this.totalItems = this.filteredDataSource.length;
    this.currentPage = 1;
  }


  onPageChange(page: number) {
    this.currentPage = page;
  }

  exportToExcel2(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hoja1');
  
    // Definir estilo para los encabezados (títulos)
    const headerStyle = {
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '00BFFF' } // Fondo azul claro
      },
      font: {
        color: { argb: 'FFFFFF' }, // Texto en color blanco
        bold: true
      }
    };
  
    // Definir datos a exportar (dataSource debe ser un arreglo con los datos que quieres exportar)
    const dataToExport = this.dataSource.map(item => ({
      IdFomulario: item.idFomulario,
      TipoTercero: item.tipo_Tercero,
      TipoIdentificacion: item.tipoIdentificacion,
      NumeroIdentificacion: item.numero_Identificacion,
      NombreCompleto: item.nombre,
      NumeroConsulta: item.numero_Consulta,
      Coincidencias: item.coincidencias,
      Fecha_Consulta: item.fecha_Consulta,     

    }));
  
  
    // Agregar encabezados a la hoja de trabajo
    worksheet.addRow(['IdFomulario', 'TipoTercero', 'TipoIdentificacion','NumeroIdentificacion','NombreCompleto','NumeroConsulta','Coincidencias','Fecha_Consulta']);
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell, colNumber) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00BFFF' } // Fondo azul claro
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, // Texto en color blanco
      bold: true
    };
  });
    // Agregar datos a la hoja de trabajo
    dataToExport.forEach(item => {
      worksheet.addRow([item.IdFomulario, item.TipoTercero, item.TipoIdentificacion,item.NumeroIdentificacion,item.NombreCompleto,item.NumeroConsulta,item.Coincidencias,item.Fecha_Consulta,]);
    });
  
    // Ajustar ancho de columnas (opcional)
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  
    // Generar el nombre de archivo
    const fecha = new Date();
    const fechatotal = `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}_${fecha.getHours()}-${fecha.getMinutes()}-${fecha.getSeconds()}`;
    const nombreArchivo = `export-${fechatotal}.xlsx`;
  
    // Guardar el archivo y descargarlo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, nombreArchivo);
    });
  }


  async DescargarInformeInspektor(IdConsulta:number)
  {
    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));


    this.serviciocliente.descargarReporteInspektor(IdConsulta).subscribe(blob => {
      this.hideLoadingModal();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "ReporteInspektor:"+IdConsulta+".pdf";  // Puedes cambiar esto para usar el nombre del archivo real
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }, error => {
      console.error('Error al descargar el archivo:', error);
      this.hideLoadingModal();
    });

  }

  cerrarModal(): void {
    this.activeModal.close(); // Puedes pasar un resultado si lo deseas, ej: this.activeModal.close('some result');
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


  async DescargarresultadosProcuraduria(obj:any)
  {

    const data: ListasAdicionalesDto = 
    { TipoIdentificacion: obj.tipo_Identificacion.toString(),
       NumeroIdentificacion: obj.numero_Identificacion,
        NombreCompleto: obj.nombre
       };

       console.log(obj);
    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));

    this.serviciocliente.ConsultaProcuraduria(data).subscribe(
      response => {
        this.hideLoadingModal();

        // Crear un Blob a partir de la respuesta
        const blob = new Blob([response], { type: 'application/pdf' });

        // Usar file-saver para gestionar la descarga del archivo
        saveAs(blob, `ResultadoProcuraduria_${data.NumeroIdentificacion}.pdf`);
      },
      error => {
        
        this.hideLoadingModal();
        alert('No hay datos para esta consulta.');
      }
    );

  }

  async DescargarRamaJudicial(obj:any)
  {
    const data: ListasAdicionalesDto = 
    { TipoIdentificacion: obj.tipo_Identificacion.toString(),
       NumeroIdentificacion: obj.numero_Identificacion,
        NombreCompleto: obj.nombre
       };

    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));


    this.serviciocliente.ConsultaRamaJudicial(data).subscribe(
      response => {
        this.hideLoadingModal();

        // Crear un Blob a partir de la respuesta
        const blob = new Blob([response], { type: 'application/pdf' });

        // Usar file-saver para gestionar la descarga del archivo
        saveAs(blob, `ResultadosRamaJudicial_${data.NumeroIdentificacion}.pdf`);
      },
      error => {
        this.hideLoadingModal();
        alert('No hay datos para esta consulta.');
      }
    );

  }

  async DescargarEjeccionPenas(obj:any)
  {
    const data: ListasAdicionalesDto = 
    { TipoIdentificacion: obj.tipo_Identificacion.toString(),
       NumeroIdentificacion: obj.numero_Identificacion,
        NombreCompleto: obj.nombre
       };
console.log(obj);

    this.showLoadingModal();
    await new Promise(resolve => setTimeout(resolve, 500));

    this.serviciocliente.ConsultaEjecucionPenas(data).subscribe(
      response => {
        this.hideLoadingModal();

        // Crear un Blob a partir de la respuesta
        const blob = new Blob([response], { type: 'application/pdf' });

        // Usar file-saver para gestionar la descarga del archivo
        saveAs(blob, `ResultadosEjecPenas_${data.NumeroIdentificacion}.pdf`);
      },
      error => {

        this.hideLoadingModal();
        alert('No hay datos para esta consulta.');
      }
    );
  }



  async downloadfile(key: any, NombreDocumento: string) {
    //var url='https://localhost:7123/api/tickets/descarga?IdArchvio='+this.idAdjunto;
    //var url=`${this.apiUrl}/tickets/descarga?IdArchvio=${this.idAdjunto}`;
    //window.open(url, "_blank");
    this.serviciocliente.descargarArchivo(key, this.formularioId).subscribe(blob => {
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


  public onFilesDroppedviejoborrar(key: string, files: NgxFileDropEntry[]): void {
    if (files.length > 0) {
      const droppedFile = files[0];
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.files[key] = file;
          this.adjuntosForm.get(key)?.setValue(file);

          this.serviciocliente.uploadFile2(file, key, this.formularioId).subscribe(
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
          const newFileName = `${key}-${uniqueNumber}-${this.formularioId}.pdf`; // Puedes ajustar la extensión según corresponda  
          // Crear un nuevo File con el Blob del archivo original y el nuevo nombre
          const newFile = new File([file], newFileName, { type: file.type });

          this.files[key] = newFile;
          this.adjuntosForm.get(key)?.setValue(newFile);
  
          // Enviar el nuevo archivo al servidor
          this.serviciocliente.uploadFile2(newFile, key, this.formularioId).subscribe(
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

  private disableDropZone(key: string): void {
    switch (key) {
      case 'DebidaDiligencia':
        this.disableDebidaDiligencia = true;
        break;
     
    }
  }

  public removeFile(key: string): void {
    delete this.files[key];
    this.adjuntosForm.get(key)?.setValue(null);
    this.enableDropZone(key);

    this.serviciocliente.EliminaArchivoCargado(this.formularioId, key).subscribe(
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


  private enableDropZone(key: string): void {
    switch (key) {
      case 'DebidaDiligencia':
        this.disableDebidaDiligencia = false;
        break;
      
    }

  }

}
