import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent
} from '@po-ui/ng-components';

import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit, OnDestroy {

  private readonly url: string = environment.apiUrl + '/api/samples/v1/people';

  private customerRemoveSub: Subscription;
  private customersRemoveSub: Subscription;
  private customersSub: Subscription;
  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any = { };

  public readonly cityService: string = environment.apiUrl + '/api/samples/v1/cities';

  public readonly actions: Array<PoPageAction> = [
    { action: this.onNewCustomer.bind(this), label: 'Cadastrar', icon: 'po-icon-user-add' },
    { action: this.onRemoveCustomers.bind(this), label: 'Remover clientes' }
  ];

  public readonly filters: Array<any> = [
    { property: 'name', label: 'Nome', gridColumns: 6 },
    { property: 'city', label: 'Cidade', optionsService: this.cityService, gridColumns: 6, params: { transform: true } },
    { property: 'genre', label: 'Gênero', gridColumns: 7, options: [
      { value: 'female', label: 'Feminino' },
      { value: 'male', label: 'Masculino' },
      { value: 'other', label: 'Outros' },
    ]},
    { property: 'status', type: 'Status', gridColumns: 5, optionsMulti: true, options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' }
    ]}
  ];

  public readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'nickname', label: 'Apelido' },
    { property: 'email', label: 'E-mail', type: 'link', action: this.sendMail.bind(this) },
    { property: 'birthdate', label: 'Nascimento', type: 'date', format: 'dd/MM/yyyy', width: '100px' },
    { property: 'genre', label: 'Gênero', type: 'subtitle', width: '80px', subtitles: [
      { value: 'female', color: 'color-05', content: 'F', label: 'Feminino' },
      { value: 'male', color: 'color-02', content: 'M', label: 'Masculino' },
      { value: 'other', color: 'color-08', content: 'O', label: 'Outros' },
    ]},
    { property: 'city', label: 'Cidade' },
    { property: 'status', type: 'label', labels: [
      { value: 'active', color: 'color-10', label: 'Ativo' },
      { value: 'inactive', color: 'color-07', label: 'Inativo' }
    ]}
  ];

  public readonly tableActions: Array<PoTableAction> = [
    { action: this.onViewCustomer.bind(this), label: 'Visualizar' },
    { action: this.onEditCustomer.bind(this), disabled: this.canEditCustomer.bind(this), label: 'Editar' },
    { action: this.onRemoveCustomer.bind(this), label: 'Remover', type: 'danger', separator: true }
  ];

  public customers: Array<any> = [];
  public hasNext: boolean = false;
  public loading: boolean = true;

  @ViewChild('table', { static: true }) table: PoTableComponent;

  constructor(private httpClient: HttpClient, private router: Router, private poNotification: PoNotificationService) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.customersSub.unsubscribe();

    if (this.customerRemoveSub) {
      this.customerRemoveSub.unsubscribe();
    }

    if (this.customersRemoveSub) {
      this.customersRemoveSub.unsubscribe();
    }
  }

  changeDisclaimers(event) {
    this.searchTerm = '';
    this.searchFilters = {};

    this.page = 1;

    event.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData(this.searchFilters);
  }

  sortBy(event) {
    let params: any = {};

    this.page = 1;

    if (event) {
      params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }

    this.loadData(params);
  }

  showMore(event) {
    let params: any = {
      page: ++this.page,
    };

    if (event) {
      params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }

    this.loadData(params);
  }

  private canEditCustomer(customer) {
    return customer.status !== 'active';
  }

  private loadData(params: { page?: number, search?: string } = { }) {
    this.loading = true;

    this.customersSub = this.httpClient.get(this.url, { params: <any>params })
      .subscribe((response: { hasNext: boolean, items: Array<any>}) => {
        this.customers = !params.page || params.page === 1
          ? response.items
          : [...this.customers, ...response.items];
        this.hasNext = response.hasNext;
        this.loading = false;
      });
  }

  public quickSearch(event) {
    this.page = 1;

    this.searchTerm = event;
    this.searchFilters = {};

    this.loadData(event ? { search: event } : {});
  }

  public advancedSearch(event) {
    this.page = 1;

    this.searchTerm = '';
    this.searchFilters = event;

    this.loadData(event);
  }

  private onEditCustomer(customer) {
    this.router.navigateByUrl(`/dynamic-customers/edit/${customer.id}`);
  }

  private onNewCustomer() {
    this.router.navigateByUrl('/dynamic-customers/new');
  }

  private onRemoveCustomer(customer) {
    this.customerRemoveSub = this.httpClient.delete(`${this.url}/${customer.id}`)
      .subscribe(() => {
        this.poNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.customers.splice(this.customers.indexOf(customer), 1);
      });
  }

  private onRemoveCustomers() {
    const selectedCustomers = this.table.getSelectedRows();
    const customersWithId = selectedCustomers.map(customer => ({ id: customer.id}));

    this.customersRemoveSub = this.httpClient.request('delete', this.url, { body: customersWithId } )
      .subscribe(() => {
        this.poNotification.warning('Clientes apagados em lote com sucesso.');

        selectedCustomers.forEach(customer => {
          this.customers.splice(this.customers.indexOf(customer), 1);
        });
      });
  }

  private onViewCustomer(customer) {
    this.router.navigateByUrl(`/dynamic-customers/view/${customer.id}`);
  }

  private sendMail(email, customer) {
    const body = `Olá ${customer.name}, gostariamos de agradecer seu contato.`;
    const subject = 'Contato';

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

}
