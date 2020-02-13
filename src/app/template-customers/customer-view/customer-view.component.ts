import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { PoNotificationService, PoDynamicViewField } from '@portinari/portinari-ui';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html'
})
export class CustomerViewComponent {

  public readonly serviceApi = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  public readonly actions = {
    back: 'template-customers',
    edit: 'template-customers/edit/:id',
    remove: 'template-customers'
  };

  readonly fields: Array<PoDynamicViewField> = [
    { property: 'id', visible: false, key: true },
    { property: 'name', label: 'Nome', divider: 'Dados pessoais', gridColumns: 5 },
    { property: 'email', label: 'E-mail', gridColumns: 5 },
    { property: 'statusDescription', label: 'Status', tag: true, gridColumns: 2, color: 'color-10' },
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

}
