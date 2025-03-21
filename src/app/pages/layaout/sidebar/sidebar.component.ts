import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input() menuItems: any[] = [];

  constructor() {}

  ngOnInit(): void {
  }

 /* toggle(item: any): void {
    item.isOpen = !item.isOpen;
  }*/

  toggle(item: any, event: MouseEvent) {
    event.preventDefault(); // Evita que el enlace recargue la página
    item.isOpen = !item.isOpen; // Cambia el estado de apertura del menú
}
}