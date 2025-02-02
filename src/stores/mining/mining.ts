

import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { calculateStat, decreaseGatherTimer, setGatheringLocation } from '../../app/helpers';
import { IGameGathering, ItemType, Stat } from '../../interfaces';
import { CharSelectState } from '../charselect/charselect';
import { DecreaseDurability } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelMining, SetMiningLocation } from './mining.actions';
import { attachments } from './mining.attachments';
import { defaultMining } from './mining.functions';

@State<IGameGathering>({
  name: 'mining',
  defaults: defaultMining()
})
@Injectable()
export class MiningState {

  constructor(private store: Store) {
    attachments.forEach(({ action, handler }) => {
      attachAction(MiningState, action, handler);
    });
  }

  @Selector()
  static level(state: IGameGathering) {
    return state.level;
  }

  @Selector()
  static currentLocation(state: IGameGathering) {
    if(!state.currentLocation) {
      return undefined;
    }

    return { location: state.currentLocation, duration: state.currentLocationDuration };
  }

  @Selector()
  static cooldowns(state: IGameGathering) {
    return state.cooldowns;
  }

  @Action(TickTimer)
  decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const cdrValue = calculateStat(equipment, Stat.PickaxeSpeed);
    decreaseGatherTimer(ctx, ticks, cdrValue, CancelMining);
  }

  @Action(SetMiningLocation)
  setLocation(ctx: StateContext<IGameGathering>, { location }: SetMiningLocation) {
    const equipment = this.store.selectSnapshot(CharSelectState.activeCharacterEquipment);
    const gdrValue = calculateStat(equipment, Stat.PickaxePower);
    setGatheringLocation(ctx, location, gdrValue);
    ctx.dispatch(new DecreaseDurability(ItemType.Pickaxe));
  };

}
