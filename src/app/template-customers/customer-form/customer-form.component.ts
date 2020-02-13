import { Component } from '@angular/core';

import { PoPageDynamicEditActions } from '@portinari/portinari-templates';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html'
})
export class CustomerFormComponent {

  public readonly serviceApi: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  public readonly cityService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/cities';

  public readonly actions: PoPageDynamicEditActions = {
    save: 'template-customers',
    saveNew: 'template-customers/new',
    cancel: 'template-customers'
  };

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
    { property: 'city', label: 'Cidade', required: true, gridColumns: 3, optionsService: this.cityService, params: { transform: true } },
    // { property: 'city', label: 'Cidade', required: true, gridColumns: 3, searchService: this.cityService, fieldLabel: 'name', fieldValue: 'ibge' },
    { property: 'country', label: 'País', optional: true, gridColumns: 3 },
    { property: 'mother', label: 'Nome da mãe', optional: true, divider: 'Filiação', gridColumns: 5 },
    { property: 'father', label: 'Nome do pai', optional: true, gridColumns: 5 },
  ];
}
