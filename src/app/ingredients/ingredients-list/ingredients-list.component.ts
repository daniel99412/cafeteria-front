import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { tap } from 'rxjs';
import { IngredientService } from '../services/ingredient.service';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.scss']
})
export class IngredientsListComponent implements OnInit {

  ingredients!: [];

  first = 0;
  rows = 10;
  addIngredient!: boolean;
  editIngredient!: boolean;
  disabled = true;
  nextIngredient = 0;

  id = new FormControl({value: '', disabled: true}, [Validators.required]);
  name = new FormControl(null, [Validators.required, Validators.minLength(3)]);
  amountAvailable = new FormControl(null, [Validators.required, Validators.min(0)]);

  constructor(
    private ingredientService: IngredientService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.ingredientService.findAll().pipe(
      tap(resp => {
        this.ingredients = resp;
        this.nextIngredient = resp[resp.length-1].id + 1;
        this.id.setValue(this.nextIngredient.toString());
      })
    ).subscribe();
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  next() {
    this.first = this.first + this.rows;
  }

  isFirstPage() {
    return this.ingredients ? this.first === (this.ingredients.length - this.rows) : true;
  }

  isLastPage() {
    return this.ingredients ? this.first === 0 : true;
  }

  formValid(): boolean {
    let isValid = false;

    if (this.name.valid && this.amountAvailable.valid) {
      isValid = true;
    }

    return isValid;
  }

  openUpdate(id: number) {
    this.ingredientService.findById(id).pipe(
      tap(resp => {
        this.id.setValue(resp.id);
        this.name.setValue(resp.name);
        this.amountAvailable.setValue(resp.amountAvailable);

        this.editIngredient = true;
      })
    ).subscribe();
  }

  save() {
    let ingredientToSend = {
      'name': this.name.value,
      'amountAvailable': this.amountAvailable.value
    }

    this.ingredientService.save(ingredientToSend).pipe(
      tap(resp => {
        if (resp.status === 200) {
          this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });
          this.loadData();
          this.cancel();
        }
      })
    ).subscribe();
  }

  update() {
    let ingredientToSend = {
      'id': this.id.value,
      'name': this.name.value,
      'amountAvailable': this.amountAvailable.value
    }

    this.ingredientService.update(ingredientToSend).pipe(
      tap(resp => {
        this.messageService.add({ severity: 'success', summary: '¡Éxito!', detail: resp.message });
        this.loadData();
        this.cancel();
      })
    ).subscribe();
  }

  cancel() {
    this.id.reset(null);
    this.id.setValue(this.nextIngredient.toString());
    this.name.reset(null);
    this.amountAvailable.reset(null);

    this.addIngredient = false;
    this.editIngredient = false;
  }
}
