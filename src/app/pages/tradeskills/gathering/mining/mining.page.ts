import { Component, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IGameGatherLocation, IGameWorkersGathering } from '../../../../../interfaces';
import { MiningState, WorkersState } from '../../../../../stores';
import { CancelMining, SetMiningLocation } from '../../../../../stores/mining/mining.actions';
import { AssignGatheringWorker, UnassignGatheringWorker } from '../../../../../stores/workers/workers.actions';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.page.html',
  styleUrls: ['./mining.page.scss'],
})
export class MiningPage implements OnInit {

  public get locationData() {
    return this.contentService.mining;
  }

  @Select(MiningState.level) level$!: Observable<number>;
  @Select(MiningState.cooldowns) cooldowns$!: Observable<Record<string, number>>;
  @Select(MiningState.currentLocation) currentLocation$!: Observable<{ location: IGameGatherLocation; duration: number } | undefined>;
  @Select(WorkersState.gatheringWorkers) gatheringWorkers$!: Observable<{
    workerAllocations: IGameWorkersGathering[];
    canAssignWorker: boolean;
    hasWorkers: boolean;
  }>;

  constructor(private store: Store, private contentService: ContentService) { }

  ngOnInit() {
  }

  visibleLocations(locations: IGameGatherLocation[], currentLevel = 0) {
    return locations.filter(location => currentLevel >= location.level.min);
  }

  gather(location: IGameGatherLocation) {
    this.store.dispatch(new SetMiningLocation(location));
  }

  cancelGather() {
    this.store.dispatch(new CancelMining());
  }

  workersAllocatedToLocation(allWorkers: IGameWorkersGathering[], location: IGameGatherLocation): number {
    return allWorkers.filter(w => w.location.name === location.name && w.tradeskill === 'mining').length;
  }

  allocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new AssignGatheringWorker('mining', location));
  }

  unallocateWorker(location: IGameGatherLocation) {
    this.store.dispatch(new UnassignGatheringWorker('mining', location));
  }

}
