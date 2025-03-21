import { Component, ComponentFactoryResolver, ElementRef, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';

import { ServicioPrincipalService } from '../../Services/main.services';
import { NgbModal, NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ConfirmDeleteModalComponent } from '../../utils/confirm-delete-modal/confirm-delete-modal.component';
import { InternalDataService } from '../../Services/InternalDataService';
import { Router } from '@angular/router';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';
import { FormularioProveedoresClientesComponent } from '../formulario-proveedores-clientes-creacion/formulario-proveedores-clientes.component';
import { FormularioProovedoresClienteEdicionComponent } from '../formulario-proovedores-cliente-edicion/formulario-proovedores-cliente-edicion.component';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../../auth/authservices/auth.services';
import { ResultadoListasInspektorComponent } from '../../utils/resultado-listas-inspektor/resultado-listas-inspektor.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lista-formularios',
  templateUrl: './lista-formularios.component.html',
  styleUrl: './lista-formularios.component.scss'
})
export class ListaFormulariosComponent {
  @ViewChild('modalTerminos') modalTerminos: ElementRef;
  Lang:string='es';
  private tokenKey = 'auth_token';
  dataSource: any[] = [];
  filteredDataSource:any[] = [];
  totalItems = 0; // Inicializado a 0
  currentPage = 1;
  pageSize = 10;
  isLoading = false;
  searchTerm: string = '';
  userId:number;
  NombreRol:string = '';

  constructor(private servicioautht:AuthService,private serviciocliente: ServicioPrincipalService, private paginationConfig: NgbPaginationConfig,private modalService: NgbModal,private ServicioEdit:InternalDataService,private router: Router,private renderer: Renderer2, private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,private translate: TranslateService) {
    this.paginationConfig.boundaryLinks = true;
    this.paginationConfig.rotate = true;
      this.userId=this.getUsuerId();

      this.Lang = localStorage.getItem('language') || 'es';
      this.translate.use(this.Lang);

  }

  ngOnInit() {

    this.serviciocliente.CurrentUser().pipe(
      catchError((error) => {
        this.servicioautht.logout(); 
        return of(null); 
      })
    ).subscribe((data: any) => {
    this.NombreRol=data.rol;
  });

   this.loadItems();

  }

  loadItems() {
    this.isLoading = true;
    this.serviciocliente.getFormularioslist(this.Lang).subscribe((data: any[])=> {
      this.dataSource = data; // Asigna los datos obtenidos al dataSource
      this.filteredDataSource = data;
      this.totalItems = data.length; // Establece el total de ítems
      this.isLoading = false;
    });
  }

  abrirModal() {
    const modalElement = this.modalTerminos.nativeElement;
    const modalDialog = modalElement.querySelector('.modal-dialog');

    // Asegúrate de que el scroll está al principio
    this.renderer.setProperty(modalDialog, 'scrollTop', 0);

    this.renderer.setStyle(modalElement, 'display', 'block'); // Mostrar el modal
    this.renderer.addClass(modalElement, 'show'); // Añadir clase 'show' para Bootstrap
    this.renderer.addClass(document.body, 'modal-open'); // Prevenir el desplazamiento
  }

  cerrarModal() {
    const modalElement = this.modalTerminos.nativeElement;
    this.renderer.setStyle(modalElement, 'display', 'none'); // Ocultar el modal
    this.renderer.removeClass(modalElement, 'show'); // Eliminar clase 'show' para Bootstrap
    this.renderer.removeClass(document.body, 'modal-open'); // Permitir el desplazamiento
  }

  edit(element: any) {

    const FormDespacho = {
      id : element.id,
      idUsuario:element.idUsuario,
      nombreUsuario:element.nombreUsuario,
      idEstado:element.idEstado,
      estado:element.estado,
      fechaFormulario:element.fechaFormulario,
    }

    this.ServicioEdit.setNuevoFormulario(FormDespacho);


if (this.NombreRol==='Proveedor/Cliente')
{
  this.router.navigate(['/pages/dash/CrearFormulario']);

}else{
  this.router.navigate(['/pages/dash/ValidarFormulario']);

}   

  }

  openConfirmDeleteModal(item: any): void {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
    modalRef.componentInstance.itemName = item.id;

    modalRef.result.then((result) => {
      if (result) {
        this.deleteRegistro(item.id);
      }
    }).catch((error) => {
      console.log('Modal dismissed with error:', error);
    });
  }
  
  deleteRegistro(id: number): void {

    
  
  }

  applyFilter() {
    this.filteredDataSource = this.dataSource.filter(element =>
      element.id.toString().includes(this.searchTerm) ||
      element.nombreUsuario.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.estado.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      element.fechaFormulario.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
    this.totalItems = this.filteredDataSource.length;
    this.currentPage = 1;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
  getPagedData() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = this.currentPage * this.pageSize;
    return this.filteredDataSource.slice(startIndex, endIndex);
  }

  CrearFormulario(){
    this.isLoading = true;
   
      this.serviciocliente.CrearNuevoFormulario().subscribe(data => {
        this.ServicioEdit.setNuevoFormulario(data);
        this.isLoading = false;

        this.router.navigate(['/pages/dash/CrearFormulario']);
      });  

   
}

  exportToExcel(): void {
    const dataToExport = this.dataSource.map(item => ({
      Id: item.id,
      Nombre: item.nombre,
      Valor: item.valor
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
  
    // Formato para los encabezados (títulos)
    const headerStyle: XLSX.Sheet = {
      font: { bold: true, color: { rgb: 'FFFF0000' } }, // Color rojo (formato ARGB)
      alignment: { horizontal: 'center' }
    };
  
    // Aplicar el formato al rango de encabezados (A1:C1)
    const range: XLSX.Range = {
      s: { r: 0, c: 0 }, // Comienza en la fila 0, columna 0
      e: { r: 0, c: 2 }  // Termina en la fila 0, columna 2 (A1:C1)
    };
    ws['!cols'] = [{ width: 15 }, { width: 20 }, { width: 15 }]; // Ajustar el ancho de las columnas
  
    // Aplicar estilo al rango de encabezados
    ws['A1'].s = headerStyle;
    ws['B1'].s = headerStyle;
    ws['C1'].s = headerStyle;
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Exportados');
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, 'export');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  exportExcel(): void {
    const dataToExport = this.dataSource.map(item => ({
      Id: item.id,
      Nombre: item.nombreUsuario,
      NombreArea: item.nombreArea,
      NombreActividad: item.nombreActividad,
      NombreCliente: item.nombreCliente,
      NombreServicio: item.nombreServicio,
      NumeroHoras: item.numeroHoras,
    }));
  
    const fecha = new Date();
    const fechatotal =
      fecha.getDate() +
      '-' +
      (fecha.getMonth() + 1) +
      '-' +
      fecha.getFullYear() +
      '_' +
      fecha.getHours() +
      '-' +
      fecha.getMinutes() +
      '-' +
      fecha.getSeconds();
  
    // Crear libro de trabajo y hoja de trabajo
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  
    // Definir estilo para los encabezados (títulos)
    const headerStyle = {
      fill: { fgColor: { rgb: '#00BFFF' } }, // Fondo azul claro
      font: { color: { rgb: '#FFFFFF' }, bold: true }, // Texto en negrita y color blanco
    };
  
    // Definir nombres de columnas y aplicar estilo
    const colNames = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1'];
    colNames.forEach(col => {
      if (worksheet[col]) {
        const cell = worksheet[col];
        cell.s = headerStyle;
      }
    });
  
    // Agregar la hoja al libro de trabajo
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hoja1');
  
    // Generar el nombre de archivo
    const nombreArchivo = `unificado-${fechatotal}.xlsx`;
  
    // Guardar el archivo
    const rutaArchivo = `api_operaciones/files/unificados/${nombreArchivo}`;
    XLSX.writeFile(workbook, rutaArchivo);
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
      Id: item.id,
      Nombre: item.nombreUsuario,
      Estado: item.estado,
      FechaFormulario: item.fechaFormulario,

    }));
  
  
    // Agregar encabezados a la hoja de trabajo
    worksheet.addRow(['ID', 'Nombre', 'Estado','FechaFormulario']);
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
      worksheet.addRow([item.Id, item.Nombre, item.Estado,item.FechaFormulario]);
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

  getUsuerId(): number {
    const tokenString = localStorage.getItem(this.tokenKey);
  if (!tokenString) {
    return 0;  // No hay token almacenado
  }  
  try {
    const localestorage = JSON.parse(tokenString);
    const userid = localestorage.token.userId;
    return userid;
  } catch (e) {
    console.error('Error parsing token from localStorage', e);
    return 0;
  }
}

GenerarPdf(element: any)
{
  const FormDespacho = {
    id : element.id,
    idUsuario:element.idUsuario,
    nombreUsuario:element.nombreUsuario,
    idEstado:element.idEstado,
    estado:element.estado,
    fechaFormulario:element.fechaFormulario,
  }


  this.serviciocliente.descargarArchivo('PDFEnviado', FormDespacho.id).subscribe(blob => {
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

abrirlistas(element:any)
{
  const modalRef = this.modalService.open(ResultadoListasInspektorComponent, { centered: true, 
    windowClass: 'custom-modal-width2' 
  });

  modalRef.componentInstance.formularioId = element.id;
  modalRef.result.then((result) => {
    if (result) {

      console.log('Formulario Rechazado:', result.formularioId, 'Motivo:', result.motivo);
      // Lógica para manejar el rechazo del formulario
    }
  }, (reason) => {
    // Lógica para manejar el cierre del modal sin rechazo
    console.log('Modal cerrado sin rechazar:', reason);
  });

}

esRolValido(): boolean {
  return this.NombreRol ==="Control Interno"  || this.NombreRol === "Oficial de Cumplimiento";
}


}
