import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService, PoDynamicViewField } from '@portinari/portinari-ui';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html'
})
export class CustomerViewComponent implements OnDestroy, OnInit {

  private readonly url: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  private customerRemoveSub: Subscription;
  private customerSub: Subscription;
  private paramsSub: Subscription;

  customer: any = {};

  readonly fieldStatus = { property: 'statusDescription', label: 'Status', tag: true, gridColumns: 2, color: 'color-10' };

  readonly fields: Array<PoDynamicViewField> = [
    { property: 'name', label: 'Nome', divider: 'Dados pessoais', gridColumns: 5 },
    { property: 'email', label: 'E-mail', gridColumns: 5 },
    this.fieldStatus,
    { property: 'nickname', label: 'Apelido', gridColumns: 3 },
    { property: 'birthdate', label: 'Nascimento', type: 'date', format: 'dd/MM/yyyy', gridColumns: 3 },
    { property: 'genreDescription', label: 'Gênero', gridColumns: 3 },
    { property: 'nationality', label: 'Nacionalidade', gridColumns: 3 },
    { property: 'street', label: 'Rua', divider: 'Endereço', gridColumns: 6 },
    { property: 'cityName', label: 'Cidade', gridColumns: 3 },
    { property: 'country', label: 'País', gridColumns: 3 },
    { property: 'mother', label: 'Nome da mãe', divider: 'Filiação', gridColumns: 5 },
    { property: 'father', label: 'Nome do pai', gridColumns: 5 },
  ];

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => this.loadData(params['id']));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.customerSub.unsubscribe();

    if (this.customerRemoveSub) {
      this.customerRemoveSub.unsubscribe();
    }
  }

  back() {
    this.router.navigateByUrl('dynamic-customers');
  }

  edit() {
    this.router.navigateByUrl(`dynamic-customers/edit/${this.customer.id}`);
  }

  remove() {
    this.customerRemoveSub = this.httpClient.delete(`${this.url}/${this.customer.id}`)
      .subscribe(() => {
        this.poNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.back();
      });
  }

  private loadData(id) {
    this.customerSub = this.httpClient.get(`${this.url}/${id}`)
      .subscribe(response => {
        this.customer = response;

        this.fieldStatus.color = this.customer.status === 'active' ? 'color-10' : 'color-07';
      });
  }

}
