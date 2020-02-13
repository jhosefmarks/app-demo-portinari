import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService } from '@portinari/portinari-ui';

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
    this.router.navigateByUrl('customers');
  }

  edit() {
    this.router.navigateByUrl(`customers/edit/${this.customer.id}`);
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
      .pipe(
        map((customer: any) => {
          const status = { active: 'Ativo', inactive: 'Inativo' };

          const genre = { female: 'Feminino', male: 'Masculino', other: 'Outros' };

          customer.statusDescription = status[customer.status];
          customer.genreDescription = genre[customer.genre];

          return customer;
        })
      )
      .subscribe(response => this.customer = response);
  }

}
