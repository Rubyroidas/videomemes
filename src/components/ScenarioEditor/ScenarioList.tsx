import {useCallback} from 'react';
import {DragDropContext, Droppable, Draggable, OnDragEndResponder} from 'react-beautiful-dnd';

import {useStore} from '../../store';
import {ScenarioItem} from './ScenarioItem';
import {observer} from 'mobx-react';

const moveItem = <T extends object>(array: T[], fromIndex: number, toIndex: number) => {
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);

    const arrayParts = [
        array.slice(0, minIndex),
        array.slice(minIndex + 1, maxIndex),
        array.slice(maxIndex + 1),
    ];

    const oldMinItem = array[minIndex];
    const oldMaxItem = array[maxIndex];

    return [
        ...arrayParts[0],
        oldMaxItem,
        ...arrayParts[1],
        oldMinItem,
        ...arrayParts[2],
    ];
};

export const ScenarioList = observer(() => {
    const store = useStore();
    if (!store.scenario || !store.collections) {
        return null;
    }

    const phrases = store.scenario.phrases;
    if (!store.scenario || !store.collections) {
        return null;
    }
    const handleDelete = useCallback((index: number) => {
        console.log('delete', index);
        store.scenario!.phrases = [
            ...store.scenario!.phrases.slice(0, index),
            ...store.scenario!.phrases.slice(index + 1),
        ];
    }, []);
    const onDragEnd: OnDragEndResponder = useCallback((result) => {
        // dropped outside the list
        if (!result.destination || !store.scenario) {
            return;
        }

        console.log('onDragEnd', result);
        store.scenario.phrases = moveItem(store.scenario.phrases, result.source.index, result.destination.index);
    }, []);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                            background: snapshot.isDraggingOver
                                ? ''
                                : ''
                        }}
                    >
                        {phrases.map((phrase, index) => (
                            <Draggable
                                key={phrase.id}
                                draggableId={phrase.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <ScenarioItem
                                            isDragging={snapshot.isDragging}
                                            index={index + 1}
                                            phrase={phrase}
                                            disabled={false}
                                            onDelete={() => handleDelete(index)}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});
