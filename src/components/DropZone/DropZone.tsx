import {useState, DragEventHandler, MouseEventHandler, TouchEventHandler, useRef, useEffect, useCallback} from 'react';

type Options = {
    onDrop: (f: File) => void;
}

const extractFilesFromDropEvent = (e: DragEvent): File[] => {
    if (e.dataTransfer?.items) {
        return [...e.dataTransfer.items]
            .filter(item => item?.kind === 'file')
            .map(item => item.getAsFile()!);
    } else {
        return [...e.dataTransfer?.files ?? []];
    }
}

export const useDropZone = (options: Options) => {
    const userOnDrop = options.onDrop;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isManualSelecting, setIsManualSelecting] = useState(false);
    const onDragEnter: DragEventHandler = useCallback((_) => {
        setIsDraggingOver(true);
    }, []);
    const onDragLeave: DragEventHandler = useCallback((_) => {
        setIsDraggingOver(false);
    }, []);
    const onDragOver: DragEventHandler = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    const onDrop: DragEventHandler = useCallback((e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const files = extractFilesFromDropEvent(e.nativeEvent);
        if (files.length === 0) {
            return;
        }

        userOnDrop(files[0]);
    }, []);

    const handleManualSelect = useCallback(async () => {
        if (isManualSelecting || !inputRef.current) {
            return true;
        }
        setIsManualSelecting(true);
        inputRef.current.click();
    }, []);
    const onClick: MouseEventHandler = useCallback((_) => {
        handleManualSelect();
    }, []);
    const onTouchStart: TouchEventHandler = useCallback((_) => {
        handleManualSelect();
    }, []);

    useEffect(() => {
        if (!inputRef.current) {
            const input = document.createElement('input')!;
            input.type = 'file';
            inputRef.current = input;
            input.addEventListener('change', _ => {
                // you can use this method to get file and perform respective operations
                let files = [...input.files ?? []];
                if (files.length > 0) {
                    userOnDrop(files[0]);
                }
                setIsManualSelecting(false);
            });
            input.addEventListener('cancel', _ => {
                setIsManualSelecting(false);
            });
        }
    }, []);

    return {
        isDraggingOver,
        onDragOver,
        onDragEnter,
        onDragLeave,
        onDrop,
        onClick,
        onTouchStart,
    };
};
