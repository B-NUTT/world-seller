import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameRecipe, IGameRefiningRecipe } from '../../../../../interfaces';
import { CharSelectState, JewelcraftingState } from '../../../../../stores';

import { sortBy } from 'lodash';
import { CancelJewelcraftingJob, StartJewelcraftingJob } from '../../../../../stores/jewelcrafting/jewelcrafting.actions';
import { ContentService } from '../../../../services/content.service';
import { ItemCreatorService } from '../../../../services/item-creator.service';

@Component({
  selector: 'app-jewelcrafting',
  templateUrl: './jewelcrafting.page.html',
  styleUrls: ['./jewelcrafting.page.scss'],
})
export class JewelcraftingPage implements OnInit {

  public get locationData() {
    return this.contentService.jewelcrafting;
  }

  public amounts: Record<string, number> = {};

  @Select(JewelcraftingState.level) level$!: Observable<number>;
  @Select(JewelcraftingState.currentQueue) currentQueue$!: Observable<{ queue: IGameRefiningRecipe[]; size: number }>;

  @Select(CharSelectState.activeCharacterResources) resources$!: Observable<Record<string, number>>;

  constructor(private store: Store, private itemCreatorService: ItemCreatorService, private contentService: ContentService) { }

  ngOnInit() {
  }

  isQueueFull(queueInfo: { queue: IGameRefiningRecipe[]; size: number } | null): boolean {
    if(!queueInfo) {
      return false;
    }

    const { queue, size } = queueInfo;
    return queue.length >= size;
  }

  trackBy(index: number) {
    return index;
  }

  iconForRecipe(recipe: IGameRecipe) {
    return this.itemCreatorService.iconFor(recipe.result);
  }

  modifyAmount(recipe: IGameRecipe, amount: number) {
    this.amounts[recipe.result] = (this.amounts[recipe.result] || 1) + amount;
  }

  visibleRecipes(resources: Record<string, number>, recipes: IGameRecipe[]): IGameRecipe[] {
    const validRecipes = recipes.filter((recipe: IGameRecipe) => {
      const required = recipe.require || [];
      return required.every((req) => resources[req] > 0);
    });

    return sortBy(validRecipes, 'result');
  }

  canCraftRecipe(resources: Record<string, number>, recipe: IGameRecipe, amount = 1): boolean {
    return Object.keys(recipe.ingredients)
      .every(ingredient => recipe.preserve?.includes(ingredient)
        ? resources[ingredient] >= recipe.ingredients[ingredient]
        : resources[ingredient] >= (recipe.ingredients[ingredient] * amount)
      );
  }

  craft(recipe: IGameRecipe, amount = 1) {
    this.amounts[recipe.result] = 1;

    this.store.dispatch(new StartJewelcraftingJob(recipe, amount));
  }

  cancel(jobIndex: number) {
    this.store.dispatch(new CancelJewelcraftingJob(jobIndex));
  }

}
