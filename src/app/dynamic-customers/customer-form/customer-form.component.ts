import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService, PoSelectOption } from '@portinari/portinari-ui';

const actionInsert = 'insert';
const actionUpdate = 'update';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent implements OnDestroy, OnInit {

  private readonly url: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  private action: string = actionInsert;
  private customerSub: Subscription;
  private paramsSub: Subscription;

  public readonly cityService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/cities';
  public readonly stateService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/states';

  fields = [
    { property: 'name', label: 'Nome completo', divider: 'Dados pessoais', required: true, gridColumns: 5 },
    { property: 'email', label: 'E-mail', required: true, gridColumns: 5 },
    { property: 'status', type: 'boolean', booleanFalse: 'Inativo', booleanTrue: 'Ativo', required: true, gridColumns: 2 },
    { property: 'nickname', label: 'Apelido', optional: true, gridColumns: 3 },
    { property: 'birthdate', label: 'Nascimento', type: 'date', optional: true, gridColumns: 2 },
    { property: 'genre', label: 'Gênero', optional: true, gridColumns: 4, options: [
      { value: 'female', label: 'Feminino' },
      { value: 'male', label: 'Masculino' },
      { value: 'other', label: 'Outros' },
    ] },
    { property: 'nationality', label: 'Nacionalidade', optional: true, gridColumns: 3 },
    { property: 'street', label: 'Rua', divider: 'Endereço', required: true, gridColumns: 4 },
    { property: 'state', label: 'Estado', gridColumns: 2, optionsService: this.stateService, params: { transform: true } },
    { property: 'city', label: 'Cidade', required: true, gridColumns: 3, disabled: true },
    { property: 'country', label: 'País', optional: true, gridColumns: 3 },
    { property: 'mother', label: 'Nome da mãe', optional: true, divider: 'Filiação', gridColumns: 5 },
    { property: 'father', label: 'Nome do pai', optional: true, gridColumns: 5 },
  ];

  public customer: any = { status: false };
  public state: string = '';

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient) { }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();

    if (this.customerSub) {
      this.customerSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadData(params['id']);
        this.action = actionUpdate;
      }
    });
  }

  validate(changeValue) {
    if (changeValue.property === 'state') {
      return {
        value: { city: undefined },
        fields: [
          {
            property: 'city',
            optionsService: changeValue.value.state === undefined ? undefined : this.cityService,
            params: { transform: true, uf: changeValue.value.state },
            disabled: changeValue.value.state === undefined
          }
        ],
        focus: 'city'
      };
    }
  }

  cancel() {
    this.router.navigateByUrl('/dynamic-customers');
  }

  save() {
    const customer = {...this.customer};

    customer.status = customer.status ? 'active' : 'inactive';

    this.customerSub = this.isUpdateOperation
      ? this.httpClient.put(`${this.url}/${customer.id}`, customer)
        .subscribe(() => this.navigateToList('Cliente atualizado com sucesso'))
      : this.httpClient.post(this.url, customer)
        .subscribe(() => this.navigateToList('Cliente cadastrado com sucesso'));
  }

  get isUpdateOperation() {
    return this.action === actionUpdate;
  }

  get title() {
    return this.isUpdateOperation ? '(D) Atualizando cliente' : '(D) Novo cliente';
  }

  private loadData(id) {
    this.customerSub = this.httpClient.get(`${this.url}/${id}`)
      .pipe(
        map((customer: any) => {
          customer.status = customer.status === 'active';
          this.state = customer.uf;

          return customer;
        })
      )
      .subscribe(response => this.customer = response);
  }

  private navigateToList(msg: string) {
    this.poNotification.success(msg);

    this.router.navigateByUrl('/dynamic-customers');
  }

}
