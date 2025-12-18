export type Callback = (id: string | null) => void;

export class SelectionPubSub {
  private subs = new Set<Callback>();
  private previousValue: string | null = null;

  subscribe(cb: Callback) {
    this.subs.add(cb);
    return () => this.subs.delete(cb);
  }

  reset(id: string) {
    if (id === this.previousValue) {
      this.previousValue = null;
    }
  }

  publish(newId: string | null) {
    // console.log({ newId, prev: this.previousValue });
    if (newId !== this.previousValue) {
      this.previousValue = newId;
      for (const cb of this.subs) cb(newId);
    }
  }
}

export const selectionEvents = new SelectionPubSub();
