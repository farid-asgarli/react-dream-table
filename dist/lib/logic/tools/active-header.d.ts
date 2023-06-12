export default function useActiveHeaders(): {
    updateActiveHeader: (key: string | undefined) => void;
    isHeaderIsActive: (key: string) => boolean;
};
