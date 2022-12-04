import create from "zustand";

interface BearState {
  bears: Set<number>;
  increase: (by: number) => void;
  remove: (val: number) => void;
}

const useBearStore = create<BearState>()((set) => ({
  bears: new Set(),
  increase: (val) => set((state) => ({ bears: new Set(state.bears).add(val) })),
  remove: (val) =>
    set((state) => {
      const bearsCopy = new Set(state.bears);
      bearsCopy.delete(val);
      return {
        bears: bearsCopy,
      };
    }),
}));

export { useBearStore };
