export default function useActiveRow(): {
    updateActiveRow: (uniqueRowKey: string) => void;
    clearActiveRow: () => void;
    isRowActive: (uniqueRowKey: string) => boolean;
    activeRow: string | undefined;
};
