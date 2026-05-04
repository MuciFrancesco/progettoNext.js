import { Injectable } from '@nestjs/common';

@Injectable()
export class BulkStatusStore {
  // TODO: replace this in-memory flag with a shared Redis/DB implementation for multi-instance deploys.
  private bulkBusy = false;

  isBusy(): boolean {
    return this.bulkBusy;
  }

  setBusy(value: boolean) {
    this.bulkBusy = value;
  }
}
