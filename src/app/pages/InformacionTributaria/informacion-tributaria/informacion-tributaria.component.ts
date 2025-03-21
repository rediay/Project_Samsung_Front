import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ServicioPrincipalService } from '../../Services/main.services';
import { InternalDataService } from '../../Services/InternalDataService';
import { noSeleccionadoValidator } from '../../utils/validcliente/validacionOpcionales';

@Component({
  selector: 'app-informacion-tributaria',
  templateUrl: './informacion-tributaria.component.html',
  styleUrl: './informacion-tributaria.component.scss'
})
export class InformacionTributariaComponent implements OnInit {

  @Input() IdEstadoFormulario: number;
  @Input() IdFormulario: number;
  @Input() FechaFormulario:string;
  @Input() Lang: string;
  @Input() ListaSino: any[];
  @Input() editable:boolean;
  formulario: FormGroup;

  private originalValidators: { [key: string]: any } = {};

  constructor(private fb: FormBuilder, private translate: TranslateService,private serviciocliente : ServicioPrincipalService,private cdr: ChangeDetectorRef,private internalservicet:InternalDataService) {}

  ngOnInit(): void {
    this.initializeForm();

    Object.keys(this.formulario.controls).forEach(key => {
      const control = this.formulario.get(key);
      this.originalValidators[key] = control?.validator;
    });

    this.setupValueChanges();
    if(this.IdFormulario !== 0 && this.IdFormulario !== undefined)
      {
        this.ConsultaInformacionTriburaria();    
        if (!this.editable) {
          this.deshabilitarFormulario(this.formulario);
        }
      }
  }


  ConsultaInformacionTriburaria (){
    
    if(this.IdFormulario !== 0)
    {
    this.serviciocliente.ConsultaInformacionTributaria(this.IdFormulario).subscribe(data => {     
      if (data)
        {
        this.inicilizarinfogurdada(data)
        }
});

    }


  }

  inicilizarinfogurdada(data:any)
  {
    let retencionesArray: any[] = [];
    if (data.retenciones) {
      try {
        retencionesArray = JSON.parse(data.retenciones);
      } catch (error) {
        retencionesArray = [];
      }
    }
    this.formulario.patchValue({
      Id:data.id,
      IdFormulario:this.IdFormulario,
      granContribuyente: data.granContribuyente,
      numResolucionGranContribuyente: data.numResolucionGranContribuyente,
      fechaResolucionGranContribuyente: data.fechaResolucionGranContribuyente,
      autorretenedor: data.autorretenedor,
      numResolucionAutorretenedor: data.numResolucionAutorretenedor,
      fechaResolucionAutorretenedor: data.fechaResolucionAutorretenedor,
      responsableICA: data.responsableICA,
      municipioRetener: data.municipioRetener,
      tarifa: data.tarifa,
      responsableIVA: data.responsableIVA,
      agenteRetenedorIVA: data.agenteRetenedorIVA,
      regimenTributario: data.regimenTributario,
      Sucursal:data.sucursal
    });

    const retArr = this.getRetenciones();
    retArr.clear();
    retencionesArray.forEach(ret => {
      retArr.push(this.fb.group({
        concepto: [ret.concepto, Validators.required],
        porcentaje: [ret.porcentaje, Validators.required]
      }));
    });
    
    // Actualizar validadores según los valores recibidos
    this.updateGranContribuyenteValidators(data.granContribuyente.toString());
    this.updateAutorretenedorValidators(data.autorretenedor.toString());
    this.updateResponsableICAValidators(data.responsableICA.toString());

  }



  private initializeForm(): void {
    this.formulario = this.fb.group({
      Id:[0],
      IdFormulario:[],
      granContribuyente: ['-1', [Validators.required,noSeleccionadoValidator()]],
      numResolucionGranContribuyente: ['', Validators.required],
      fechaResolucionGranContribuyente: ['', Validators.required],
      autorretenedor: ['-1', [Validators.required,noSeleccionadoValidator()]],
      numResolucionAutorretenedor: ['', Validators.required],
      fechaResolucionAutorretenedor: ['', Validators.required],
      responsableICA: ['-1', [Validators.required,noSeleccionadoValidator()]],
      municipioRetener: ['', Validators.required],
      tarifa: ['', Validators.required],
      responsableIVA: ['-1', [Validators.required,noSeleccionadoValidator()]],
      agenteRetenedorIVA: ['-1', [Validators.required,noSeleccionadoValidator()]],
      regimenTributario: ['-1', Validators.required],
      Sucursal: ['', [Validators.required]],
      retenciones: this.fb.array([])
    });
  }

  getRetenciones(): FormArray {
    return this.formulario.get('retenciones') as FormArray;
  }
  

  crearRetencion(): FormGroup {
    return this.fb.group({
      concepto: ['', Validators.required],
      porcentaje: ['', Validators.required]
    });
  }

  addRetencion(): void {
    this.getRetenciones().push(this.crearRetencion());
  }
  

  deleteRetencion(index: number): void {
    this.getRetenciones().removeAt(index);
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      console.log('Formulario válido:', this.formulario.value);
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  private setupValueChanges(): void {
    this.formulario.get('granContribuyente')?.valueChanges.subscribe(value => {
      this.updateGranContribuyenteValidators(value);
    });

    this.formulario.get('autorretenedor')?.valueChanges.subscribe(value => {
      this.updateAutorretenedorValidators(value);
    });

    this.formulario.get('responsableICA')?.valueChanges.subscribe(value => {
      this.updateResponsableICAValidators(value);
    });
  }

  private updateGranContribuyenteValidators(value: string): void {
    const numResolucionGranContribuyente = this.formulario.get('numResolucionGranContribuyente');
    const fechaResolucionGranContribuyente = this.formulario.get('fechaResolucionGranContribuyente');
    if (value === '0') { // 'No'
      numResolucionGranContribuyente?.clearValidators();
      fechaResolucionGranContribuyente?.clearValidators();
    } else {
      numResolucionGranContribuyente?.setValidators([Validators.required]);
      fechaResolucionGranContribuyente?.setValidators([Validators.required]);
    }
    numResolucionGranContribuyente?.updateValueAndValidity();
    fechaResolucionGranContribuyente?.updateValueAndValidity();
  }

  private updateAutorretenedorValidators(value: string): void {
    const numResolucionAutorretenedor = this.formulario.get('numResolucionAutorretenedor');
    const fechaResolucionAutorretenedor = this.formulario.get('fechaResolucionAutorretenedor');
    if (value === '0') { // 'No'
      numResolucionAutorretenedor?.clearValidators();
      fechaResolucionAutorretenedor?.clearValidators();
    } else {
      numResolucionAutorretenedor?.setValidators([Validators.required]);
      fechaResolucionAutorretenedor?.setValidators([Validators.required]);
    }
    numResolucionAutorretenedor?.updateValueAndValidity();
    fechaResolucionAutorretenedor?.updateValueAndValidity();
  }

  private updateResponsableICAValidators(value: string): void {
    const municipioRetener = this.formulario.get('municipioRetener');
    const tarifa = this.formulario.get('tarifa');
    if (value === '0') { // 'No'
      municipioRetener?.clearValidators();
      tarifa?.clearValidators();
    } else {
      municipioRetener?.setValidators([Validators.required]);
      tarifa?.setValidators([Validators.required]);
    }
    municipioRetener?.updateValueAndValidity();
    tarifa?.updateValueAndValidity();
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

  obtenerDatosFormulario(isValid: boolean): any {
    if (isValid) {
      return this.formulario.markAllAsTouched();
    } else {
      return this.formulario.value;
    }
  }

  esFormularioValido()
  {
    return this.formulario.valid;
  }

  marcarFormularioComoTocado()
{
  Object.values(this.formulario.controls).forEach(control => {
    control.markAsTouched();
  });
}

ObtenerDivFormulario()
{
  const DATA: any = document.getElementById('informacionTriburaria');

  return DATA;
}



Desabilitacamposdespuesdeenvio()
{

  this.editable=false;
  this.formulario.disable();
 // this.deshabilitarFormulario(this.formulario);
}

}
