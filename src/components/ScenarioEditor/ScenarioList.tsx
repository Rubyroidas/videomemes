import {useCallback} from 'react';
import {DragDropContext, Droppable, Draggable, OnDragEndResponder} from 'react-beautiful-dnd';
import {observer} from 'mobx-react';

import {useStore} from '../../store';
import {ScenarioItem} from './ScenarioItem';
import {ListDescription} from '../App.styles';

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

    const fragments = store.scenario.fragments;
    const handleDelete = useCallback((index: number) => {
        store.scenario!.fragments = [
            ...store.scenario!.fragments.slice(0, index),
            ...store.scenario!.fragments.slice(index + 1),
        ];
    }, []);
    const onDragEnd: OnDragEndResponder = useCallback((result) => {
        // dropped outside the list
        if (!result.destination || !store.scenario || result.source.index === result.destination.index) {
            return;
        }

        store.scenario.fragments = moveItem(store.scenario.fragments, result.source.index, result.destination.index);
    }, []);

    if (fragments.length === 0) {
        return (
            <ListDescription>
                There are no fragments here yet. Use "plus" icon to add them to your scenario.
            </ListDescription>
        );
    }

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
                        {fragments.map((fragment, index) => (
                            <Draggable
                                key={fragment.id}
                                draggableId={fragment.id}
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
                                            phrase={fragment}
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
