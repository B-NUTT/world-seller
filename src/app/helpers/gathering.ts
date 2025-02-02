import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { random } from 'lodash';
import { IGameGatherLocation, IGameGathering } from '../../interfaces';
import { GainResources } from '../../stores/charselect/charselect.actions';
import { isLocationOnCooldown, lowerGatheringCooldowns, putLocationOnCooldown } from './cooldowns';
import { pickResourcesWithWeights } from './pick-weight';

export function getResourceRewardsForLocation(location: IGameGatherLocation) {
  const numResources = random(location.perGather.min, location.perGather.max);
  const gainedResources = pickResourcesWithWeights(location.resources, numResources);

  return gainedResources;
}

export function decreaseGatherTimer(ctx: StateContext<IGameGathering>, ticks: number, cdrValue: number, cancelProto: any) {
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

    const gainedResources = getResourceRewardsForLocation(location);

    putLocationOnCooldown(ctx, location, cdrValue);

    if(location.level.max > state.level) {
      ctx.setState(patch<IGameGathering>({
        level: state.level + 1
      }));
    }

    ctx.dispatch(new cancelProto()).subscribe(() => {
      ctx.dispatch(new GainResources(gainedResources));
    });
  }
}

export function cancelGathering(ctx: StateContext<IGameGathering>) {
  ctx.setState(patch<IGameGathering>({
    currentLocationDurationInitial: -1,
    currentLocationDuration: -1,
    currentLocation: undefined
  }));
}

export function setGatheringLocation(ctx: StateContext<IGameGathering>, location: IGameGatherLocation, gdrValue: number) {

  if(isLocationOnCooldown(ctx, location)) {
    return;
  }

  const gatherTime = Math.max(0, location.gatherTime - gdrValue || 0);

  ctx.setState(patch<IGameGathering>({
    currentLocation: location,
    currentLocationDurationInitial: gatherTime,
    currentLocationDuration: gatherTime
  }));
}
