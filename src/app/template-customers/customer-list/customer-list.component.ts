import { Component } from '@angular/core';

import {
  PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent
} from '@portinari/portinari-ui';
import { PoPageDynamicTableActions } from '@portinari/portinari-templates';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent {

  public readonly serviceApi: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  public readonly cityService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/cities';

  public readonly actions: PoPageDynamicTableActions = {
    detail: 'template-customers/view/:id',
    duplicate: 'template-customers/new',
    edit: 'template-customers/edit/:id',
    new: 'template-customers/new',
    remove: true,
    removeAll: true
  };

  public readonly fields: Array<any> = [
    { property: 'id', visible: false, key: true },
    { property: 'name', label: 'Nome', filter: true, gridColumns: 6 },
    { property: 'nickname', label: 'Apelido' },
    { property: 'email', label: 'E-mail', type: 'link', action: this.sendMail.bind(this) },
    { property: 'birthdate', label: 'Nascimento', type: 'date', format: 'dd/MM/yyyy', width: '100px' },
    { property: 'city', label: 'Cidade', filter: true, gridColumns: 6,
      optionsService: this.cityService, params: { transform: true } },
    { property: 'genre', label: 'Gênero', type: 'subtitle', width: '80px', filter: true, gridColumns: 7,
      options: [
        { value: 'female', label: 'Feminino' },
        { value: 'male', label: 'Masculino' },
        { value: 'other', label: 'Outros' },
      ],
      subtitles: [
        { value: 'female', color: 'color-05', content: 'F', label: 'Feminino' },
        { value: 'male', color: 'color-02', content: 'M', label: 'Masculino' },
        { value: 'other', color: 'color-08', content: 'O', label: 'Outros' },
      ]
    },
    { property: 'status', type: 'label', optionsMulti: true, filter: true, gridColumns: 5,
      options: [
        { value: 'active', label: 'Ativo' },
        { value: 'inactive', label: 'Inativo' }
      ],
      labels: [
        { value: 'active', color: 'color-10', label: 'Ativo' },
        { value: 'inactive', color: 'color-07', label: 'Inativo' }
      ]
    }
  ];

  private sendMail(email, customer) {
    const body = `Olá ${customer.name}, gostariamos de agradecer seu contato.`;
    const subject = 'Contato';

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

}
