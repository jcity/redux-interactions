import { Interactions, reducer } from '../../src';

describe(`reducer`, () => {

  it(`registers an interaction reducer`, () => {
    class Counter extends Interactions {
      @reducer
      add(scopedState:number, amount:number = 1):number {
        return scopedState + amount;
      }
    }
    const instance = new Counter;
    const add:Function = instance.add;

    expect(instance.reducer(1, add())).to.eql(2);
    expect(instance.reducer(1, add(5))).to.eql(6);
  });

  it(`complains if the decorated value isn't a simple method`, () => {
    expect(() => {
      class Counter extends Interactions {
        @reducer
        get add():number { return 123; }
      }
    }).to.throw(/@reducer/);

    expect(() => {
      class Counter extends Interactions {
        val:number;
        @reducer
        set add(val:number) { this.val = val; }
      }
    }).to.throw(/@reducer/);
  });

  it(`Allows you to specify the action type`, () => {
    class Counter extends Interactions {
      @reducer('FOO_BAR')
      add(scopedState:number, amount:number = 1):number {
        return scopedState + amount;
      }
    }
    const instance = new Counter;
    const add:Function = instance.add;

    expect(add().type).to.eql('Counter:FOO_BAR');
    expect(instance.reducer(1, add())).to.eql(2);
    expect(instance.reducer(1, add(5))).to.eql(6);
  });

  it(`Enables inheritance of interactions`, () => {
    class Counter extends Interactions {
      @reducer
      add(scopedState:number, amount:number = 1):number {
        return scopedState + amount;
      }
    }

    class SpecificCounter extends Counter {
      @reducer
      subtract(scopedState:number, amount:number = 1):number {
        return scopedState - amount;
      }
    }
    const instance = new SpecificCounter;
    const add:Function = instance.add.bind(instance);
    const subtract:Function = instance.subtract.bind(instance);

    expect(add().type).to.eql((<any>instance).ADD);
    expect(subtract().type).to.eql((<any>instance).SUBTRACT);
    expect(instance.reducer(1, add())).to.eql(2);
    expect(instance.reducer(1, add(5))).to.eql(6);
    expect(instance.reducer(1, subtract())).to.eql(0);
    expect(instance.reducer(1, subtract(5))).to.eql(-4);
  });

});
