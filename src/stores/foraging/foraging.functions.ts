import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';

import { isLocationOnCooldown, lowerGatheringCooldowns, pickWithWeights, putLocationOnCooldown } from '../../app/helpers';
import { IGameGathering } from '../../interfaces';
import { GainResources, SyncTotalLevel } from '../charselect/charselect.actions';
import { TickTimer } from '../game/game.actions';
import { CancelForaging, SetForagingLocation } from './foraging.actions';

export const defaultForaging: () => IGameGathering = () => ({
  version: 0,
  level: 0,
  currentLocationDurationInitial: -1,
  currentLocationDuration: -1,
  cooldowns: {}
});

export function resetForaging(ctx: StateContext<IGameGathering>) {
  ctx.setState(defaultForaging());
}

export function cancelForaging(ctx: StateContext<IGameGathering>) {
  ctx.setState(patch<IGameGathering>({
    currentLocationDurationInitial: -1,
    currentLocationDuration: -1,
    currentLocation: undefined
  }));
}

export function decreaseDuration(ctx: StateContext<IGameGathering>, { ticks }: TickTimer) {
  const state = ctx.getState();

  lowerGatheringCooldowns(ctx, ticks);

  if(state.currentLocationDuration < 0 || !state.currentLocation) {
    return;
  }

  const newTicks = state.currentLocationDuration - ticks;

  ctx.setState(patch<IGameGathering>({
    currentLocationDuration: newTicks
  }));

  if(newTicks <= 0) {
    const location = state.currentLocation;

    const numResources = random(location.perGather.min, location.perGather.max);
    const gainedResources = pickWithWeights(location.resources, numResources);

    ctx.dispatch(new GainResources(gainedResources));

    putLocationOnCooldown(ctx, location);

    if(location.level.max > state.level) {
      ctx.setState(patch<IGameGathering>({
        level: state.level + 1
      }));

      ctx.dispatch(new SyncTotalLevel());
    }

    ctx.dispatch(new CancelForaging());
  }
}

export function setForagingLocation(ctx: StateContext<IGameGathering>, { location }: SetForagingLocation) {

  if(isLocationOnCooldown(ctx, location)) {
    return;
  }

  ctx.setState(patch<IGameGathering>({
    currentLocation: location,
    currentLocationDurationInitial: location.gatherTime,
    currentLocationDuration: location.gatherTime
  }));
};
