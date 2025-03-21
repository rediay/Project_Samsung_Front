import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ServicioPrincipalService } from '../../Services/main.services';
import { AlertModalComponent } from '../../utils/alert-modal/alert-modal.component';
import { Router } from '@angular/router';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.scss']
})
export class CrearUsuariosComponent {
  isLoading = false;
  registroForm: FormGroup;
  compradorVendedor: any[] = [];
  tipoUsuarios: { id: number, nombre: string }[] = [];

  private modalService = inject(NgbModal);

  constructor(
    private serviciocliente: ServicioPrincipalService,
    private fb: FormBuilder,
    private router: Router
  ) {

    // Lista
    const todosLosTipos = [
      { id: 1, nombre: 'Comprador' },
      { id: 2, nombre: 'Vendedor' },
      { id: 3, nombre: 'Contabilidad' },
      { id: 4, nombre: 'Control Interno' },
      { id: 5, nombre: 'Oficial de Cumplimiento' },
      { id: 6, nombre: 'Logística' },
      { id: 7, nombre: 'Proveedor/Cliente' },
      { id: 9, nombre: 'Usuario OEA' }
    ];

   
    this.tipoUsuarios = todosLosTipos.filter(tipo => [3, 4, 7].includes(tipo.id));

   
    this.registroForm = this.fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      identificacion: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      idTipoUsuario: ['-1', [Validators.required, noSeleccionadoValidator()]],
   
      idCompreadorVendedor: ['-1']
    });
  }

  ngOnInit(): void {
    this.loadcompradorVendedor();
    this.validacambios();
  }

  
  loadcompradorVendedor(): void {
    this.serviciocliente.getCompradorVendedor().subscribe(data => {
      this.compradorVendedor = data;
    });
  }

  
  validacambios(): void {
    this.registroForm.get('idTipoUsuario')?.valueChanges.subscribe(valor => {
      if (valor !== '7') {
    
        this.registroForm.get('idCompreadorVendedor')?.clearValidators();
        this.registroForm.patchValue({ idCompreadorVendedor: '-1' });
      } else {
       
        this.registroForm.get('idCompreadorVendedor')?.setValidators([
          Validators.required,
          noSeleccionadoValidator()
        ]);
      }
      this.registroForm.get('idCompreadorVendedor')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      this.isLoading = true;

      const nuwuser: newUser = {
        id: 0,
        nombres: this.registroForm.value.nombres,
        apellidos: this.registroForm.value.apellidos,
        identificacion: this.registroForm.value.identificacion,
        email: this.registroForm.value.email,
        idTipoUsuario: Number(this.registroForm.value.idTipoUsuario),
        idCompradorVendedor: Number(this.registroForm.value.idCompreadorVendedor),
        activo: true,
        password: ""
      };

      this.serviciocliente.createnewUser(nuwuser).subscribe({
        next: (response) => {
          this.isLoading = false;
        
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = 'Usuario creado correctamente';
          modalRef.componentInstance.title = '';

          this.resetForm();
          this.router.navigate(['/pages/dash/ListaUsuarios']);
        },
        error: (error) => {
          this.isLoading = false;
          const modalRef = this.modalService.open(AlertModalComponent);
          modalRef.componentInstance.name = error.error;
          modalRef.componentInstance.title = 'Error';

          this.resetForm();
        }
      });
    }
  }

  resetForm(): void {
    this.registroForm.reset();
    Object.keys(this.registroForm.controls).forEach(key => {
      const control = this.registroForm.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
      }
    });
  }

  Cancelar(): void {
    this.router.navigate(['/pages/dash/ListaUsuarios']);
  }
}


interface newUser {
  id: number;
  nombres: string;
  apellidos: string;
  identificacion: string;
  email: string;
  idTipoUsuario: number;
  idCompradorVendedor: number;
  activo: boolean;
  password: string;
}
