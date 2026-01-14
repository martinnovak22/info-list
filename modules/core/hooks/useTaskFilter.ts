import { useMemo, useState } from 'react';
import { Item } from '../store/store';

export type FilterStatus = 'active' | 'finished';

export function useTaskFilter(items: Item[]) {
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [showUntagged, setShowUntagged] = useState(false);
    const [status, setStatus] = useState<FilterStatus>('active');

    const filteredItems = useMemo(() => {
        const base =
            status === 'finished'
                ? items.filter((item) => item.completed)
                : items.filter((item) => !item.completed);

        if (showUntagged) {
            return base.filter((item) => item.tagIds.length === 0);
        }

        if (selectedTagId) {
            return base.filter((item) => item.tagIds.includes(selectedTagId));
        }

        return base;
    }, [items, selectedTagId, showUntagged, status]);

    const selectStatus = (next: FilterStatus) => {
        setStatus(next);
    };

    const handleSelectTag = (id: string | null) => {
        setShowUntagged(false);
        setSelectedTagId(id);
    };

    const toggleUntagged = () => {
        setSelectedTagId(null);
        setShowUntagged((prev) => !prev);
    };

    return {
        filteredItems,
        selectedTagId,
        showUntagged,
        status,
        selectStatus,
        handleSelectTag,
        toggleUntagged,
    };
}
