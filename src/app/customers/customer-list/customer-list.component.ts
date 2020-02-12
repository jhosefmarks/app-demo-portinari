import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  PoCheckboxGroupOption, PoComboOption, PoRadioGroupOption, PoDisclaimer, PoDisclaimerGroup,
  PoModalComponent, PoModalAction, PoNotificationService, PoPageFilter, PoPageAction,
  PoTableAction, PoTableColumn, PoTableComponent
} from '@portinari/portinari-ui';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit, OnDestroy {

  private readonly url: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';
  private customerRemoveSub: Subscription;
  private customersRemoveSub: Subscription;
  private customersSub: Subscription;
  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any;

  public readonly actions: Array<PoPageAction> = [
    { action: this.onNewCustomer.bind(this), label: 'Cadastrar', icon: 'thf-icon-user-add' },
    { action: this.onRemoveCustomers.bind(this), label: 'Remover clientes' }
  ];

  public readonly advancedFilterPrimaryAction: PoModalAction = {
    action: this.onConfirmAdvancedFilter.bind(this),
    label: 'Pesquisar'
  };

  public readonly advancedFilterSecondaryAction: PoModalAction = {
    action: () => this.advancedFilter.close(),
    label: 'Cancelar'
  };

  public readonly cityOptions: Array<PoComboOption> = [
    { label: 'Araquari', value: 'Araquari' },
    { label: 'Belém', value: 'Belém' },
    { label: 'Campinas', value: 'Campinas' },
    { label: 'Curitiba', value: 'Curitiba' },
    { label: 'Joinville', value: 'Joinville' },
    { label: 'Osasco', value: 'Osasco' },
    { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
    { label: 'São Bento', value: 'São Bento' },
    { label: 'São Francisco', value: 'São Francisco' },
    { label: 'São Paulo', value: 'São Paulo' }
  ];

  public readonly columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'nickname', label: 'Apelido' },
    { property: 'email', label: 'E-mail', type: 'link', action: this.sendMail.bind(this) },
    { property: 'birthdate', label: 'Nascimento', type: 'date', format: 'dd/MM/yyyy', width: '100px' },
    { property: 'genre', label: 'Gênero', type: 'subtitle', width: '80px', subtitles: [
      { value: 'Female', color: 'color-05', content: 'F', label: 'Feminino' },
      { value: 'Male', color: 'color-02', content: 'M', label: 'Masculino' },
      { value: 'Other', color: 'color-08', content: 'O', label: 'Outros' },
    ]},
    { property: 'city', label: 'Cidade' },
    { property: 'status', type: 'label', labels: [
      { value: 'Active', color: 'success', label: 'Ativo' },
      { value: 'Inactive', color: 'danger', label: 'Inativo' }
    ]}
  ];

  public readonly disclaimerGroup: PoDisclaimerGroup = {
    change: this.onChangeDisclaimerGroup.bind(this),
    disclaimers: [ ],
    title: 'Filtros aplicados em nossa pesquisa'
  };

  public readonly filter: PoPageFilter = {
    action: this.onActionSearch.bind(this),
    advancedAction: this.openAdvancedFilter.bind(this),
    ngModel: 'searchTerm',
    placeholder: 'Pesquisar por ...'
  };

  public readonly genreOptions: Array<PoRadioGroupOption> = [
    { label: 'Feminino', value: 'Female' },
    { label: 'Masculino', value: 'Male' },
    { label: 'Outros', value: 'Other' }
  ];

  public readonly statusOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Ativo', value: 'Active' },
    { label: 'Inativo', value: 'Inactive' }
  ];

  public readonly tableActions: Array<PoTableAction> = [
    { action: this.onViewCustomer.bind(this), label: 'Visualizar' },
    { action: this.onEditCustomer.bind(this), disabled: this.canEditCustomer.bind(this), label: 'Editar' },
    { action: this.onRemoveCustomer.bind(this), label: 'Remover', type: 'danger', separator: true }
  ];

  public city: string;
  public customers: Array<any> = [];
  public genre: string;
  public hasNext: boolean = false;
  public loading: boolean = true;
  public name: string;
  public status: Array<string> = [];

  @ViewChild('advancedFilter', { static: true }) advancedFilter: PoModalComponent;
  @ViewChild('table', { static: true }) table: PoTableComponent;

  constructor(private httpClient: HttpClient, private router: Router, private thfNotification: PoNotificationService) { }

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

  openAdvancedFilter() {
    this.advancedFilter.open();
  }

  showMore() {
    let params: any = {
      page: ++this.page
    };

    if (this.searchTerm) {
      params.search = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }

    this.loadData(params);
  }

  private canEditCustomer(customer) {
    return customer.status !== 'Active';
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

  private onActionSearch() {
    this.disclaimerGroup.disclaimers = [{
      label: `Pesquisa rápida: ${this.searchTerm}`,
      property: 'search',
      value: this.searchTerm
    }];
  }

  private onChangeDisclaimerGroup(disclaimers: Array<PoDisclaimer>) {
    this.searchFilters = {};

    this.page = 1;

    disclaimers.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    if (!this.searchFilters.search) {
      this.searchTerm = undefined;
    }

    this.loadData(this.searchFilters);
  }

  private onConfirmAdvancedFilter() {
    const addDisclaimers = (property: string, value: string, label: string) =>
      value && this.disclaimerGroup.disclaimers.push({property, value, label: `${label}: ${value}`});

    this.disclaimerGroup.disclaimers = [];

    addDisclaimers('city', this.city, 'Cidade');
    addDisclaimers('genre', this.genre, 'Gênero');
    addDisclaimers('name', this.name, 'Nome');
    addDisclaimers('status', this.status ? this.status.join(',') : '', 'Status');

    this.advancedFilter.close();
  }

  private onEditCustomer(customer) {
    this.router.navigateByUrl(`/customers/edit/${customer.id}`);
  }

  private onNewCustomer() {
    this.router.navigateByUrl('/customers/new');
  }

  private onRemoveCustomer(customer) {
    this.customerRemoveSub = this.httpClient.delete(`${this.url}/${customer.id}`)
      .subscribe(() => {
        this.thfNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.customers.splice(this.customers.indexOf(customer), 1);
      });
  }

  private onRemoveCustomers() {
    const selectedCustomers = this.table.getSelectedRows();
    const customersWithId = selectedCustomers.map(customer => ({ id: customer.id}));

    this.customersRemoveSub = this.httpClient.request('delete', this.url, { body: customersWithId } )
      .subscribe(() => {
        this.thfNotification.warning('Clientes apagados em lote com sucesso.');

        selectedCustomers.forEach(customer => {
          this.customers.splice(this.customers.indexOf(customer), 1);
        });
      });
  }

  private onViewCustomer(customer) {
    this.router.navigateByUrl(`/customers/view/${customer.id}`);
  }

  private sendMail(email, customer) {
    const body = `Olá ${customer.name}, gostariamos de agradecer seu contato.`;
    const subject = 'Contato';

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

}
