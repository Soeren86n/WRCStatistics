import { Rally } from './rally.model';

export class Stage {
  constructor(public name: string,
              public day: number,
              public date: string,
              public cancelled: boolean,
              public stagenumber: number,
              public meter: number,
              public rally: string,
              public StageID?: string,
              public RallyObj?: Rally) {
  }
}
