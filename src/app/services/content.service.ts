import { Injectable } from '@angular/core';
import * as seedrandom from 'seedrandom';

import * as alchemy from '../../assets/content/alchemy.json';
import * as blacksmithing from '../../assets/content/blacksmithing.json';
import * as cooking from '../../assets/content/cooking.json';
import * as farming from '../../assets/content/farming.json';
import * as fishing from '../../assets/content/fishing.json';
import * as foraging from '../../assets/content/foraging.json';
import * as hunting from '../../assets/content/hunting.json';
import * as items from '../../assets/content/items.json';
import * as jewelcrafting from '../../assets/content/jewelcrafting.json';
import * as logging from '../../assets/content/logging.json';
import * as mining from '../../assets/content/mining.json';
import * as prospecting from '../../assets/content/prospecting.json';
import * as resources from '../../assets/content/resources.json';
import * as weaving from '../../assets/content/weaving.json';

import * as characterNames from '../../assets/content/character-names.json';

@Injectable({
  providedIn: 'root'
})
export class ContentService {

  // core things
  public get resources() {
    return (resources as any).default || resources;
  }

  public get items() {
    return (items as any).default || items;
  }

  // other skills
  public get alchemy() {
    return (alchemy as any).default || alchemy;
  }

  public get blacksmithing() {
    return (blacksmithing as any).default || blacksmithing;
  }

  public get cooking() {
    return (cooking as any).default || cooking;
  }

  public get farming() {
    return (farming as any).default || farming;
  }

  public get fishing() {
    return (fishing as any).default || fishing;
  }

  public get foraging() {
    return (foraging as any).default || foraging;
  }

  public get hunting() {
    return (hunting as any).default || hunting;
  }

  public get jewelcrafting() {
    return (jewelcrafting as any).default || jewelcrafting;
  }

  public get logging() {
    return (logging as any).default || logging;
  }

  public get mining() {
    return (mining as any).default || mining;
  }

  public get prospecting() {
    return (prospecting as any).default || prospecting;
  }

  public get weaving() {
    return (weaving as any).default || weaving;
  }

  // misc
  public get characterNames() {
    return (characterNames as any).default || characterNames;
  }

  // aggregates
  public readonly locationHashes = {
    fishing: {},
    foraging: {},
    hunting: {},
    logging: {},
    mining: {}
  };

  public readonly recipeHashes = {
    alchemy: {},
    blacksmithing: {},
    cooking: {},
    jewelcrafting: {},
    weaving: {}
  };

  constructor() {
    this.init();
  }

  private init() {
    this.locationHashes.fishing = this.toHash(this.fishing.locations, 'name');
    this.locationHashes.foraging = this.toHash(this.foraging.locations, 'name');
    this.locationHashes.hunting = this.toHash(this.hunting.locations, 'name');
    this.locationHashes.logging = this.toHash(this.logging.locations, 'name');
    this.locationHashes.mining = this.toHash(this.mining.locations, 'name');

    this.recipeHashes.alchemy = this.toHash(this.alchemy.recipes, 'result');
    this.recipeHashes.blacksmithing = this.toHash(this.blacksmithing.recipes, 'result');
    this.recipeHashes.cooking = this.toHash(this.cooking.recipes, 'result');
    this.recipeHashes.jewelcrafting = this.toHash(this.jewelcrafting.recipes, 'result');
    this.recipeHashes.weaving = this.toHash(this.weaving.recipes, 'result');
  }

  private toHash(arr: any[], key: string) {
    return arr.reduce((hash, item) => {
      hash[item[key]] = item;
      return hash;
    }, {});
  }

  private getRandom<T>(rng: any, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
  }

  public getCharacterNameFromSeed(seed: number) {
    const rng = seedrandom('character' + seed.toString());

    const firstKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);
    const secondKey = this.getRandom(rng, ['one', 'two', 'three', 'more']);

    const firstName = this.getRandom(rng, this.characterNames.human[firstKey]);
    const secondName = this.getRandom(rng, this.characterNames.human[secondKey]);

    return `${firstName} ${secondName}`;
  }

  public getLocationsForSkill(skill: keyof typeof this.locationHashes) {
    return this.locationHashes[skill];
  }

  public getRecipesForSkill(skill: keyof typeof this.recipeHashes) {
    return this.recipeHashes[skill];
  }

}
