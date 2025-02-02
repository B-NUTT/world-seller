import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { sortBy, uniq } from 'lodash';
import { Observable } from 'rxjs';
import { IGameItem, IGameMercantileStockpile } from '../../../../../../interfaces';
import { CharSelectState, MercantileState } from '../../../../../../stores';
import {
  QuickSellAllFromStockpile, QuickSellItemFromStockpile,
  SellItem, SendToInventory, UpgradeStockpileSize
} from '../../../../../../stores/mercantile/mercantile.actions';
import { maxStockpileLevel, maxStockpileSizeUpgradeCost } from '../../../../../../stores/mercantile/mercantile.functions';

@Component({
  selector: 'app-stockpile',
  templateUrl: './stockpile.page.html',
  styleUrls: ['./stockpile.page.scss'],
})
export class StockpilePage implements OnInit {

  @Select(MercantileState.stockpile) stockpile$!: Observable<IGameMercantileStockpile>;
  @Select(CharSelectState.activeCharacterCoins) coins$!: Observable<number>;
  @Select(MercantileState.stockpileInfo) stockpileInfo$!: Observable<{ current: number; max: number }>;

  constructor(private store: Store) { }

  ngOnInit() {
  }

  hasNoItems(items: IGameItem[]): boolean {
    return items.length === 0;
  }

  itemCategories(items: IGameItem[]): string[] {
    return sortBy(uniq(items.filter(x => (x?.quantity ?? 0) > 0).map(x => x.category)));
  }

  itemsInCategory(items: IGameItem[], category: string): IGameItem[] {
    return sortBy(items.filter(x => (x?.quantity ?? 0) > 0).filter(item => item.category === category), 'name');
  }

  canUpgradeStorage(currentCoins: number, currentLevel: number): boolean {
    if(this.isStockpileStorageMaxLevel(currentLevel)) {
      return false;
    }

    return currentCoins >= this.stockpileStorageUpgradeCost(currentLevel);
  }

  isStockpileStorageMaxLevel(currentLevel: number): boolean {
    return currentLevel >= maxStockpileLevel();
  }

  stockpileStorageUpgradeCost(currentLevel: number) {
    return maxStockpileSizeUpgradeCost(currentLevel);
  }

  quickSell(item: IGameItem) {
    this.store.dispatch(new QuickSellItemFromStockpile(item));
  }

  quickSellAll() {
    this.store.dispatch(new QuickSellAllFromStockpile());
  }

  sell(item: IGameItem) {
    this.store.dispatch(new SellItem(item));
  }

  sendToInventory(item: IGameItem) {
    this.store.dispatch(new SendToInventory(item));
  }

  upgradeStorage() {
    this.store.dispatch(new UpgradeStockpileSize());
  }

}
