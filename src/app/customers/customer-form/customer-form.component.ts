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

  public readonly genreOptions: Array<PoSelectOption> = [
    { label: 'Feminino', value: 'female' },
    { label: 'Masculino', value: 'male' },
    { label: 'Outros', value: 'other' }
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

  cancel() {
    this.router.navigateByUrl('/customers');
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
    return this.isUpdateOperation ? 'Atualizando cliente' : 'Novo cliente';
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

    this.router.navigateByUrl('/customers');
  }

}
