import { PlusIcon } from '@heroicons/react/24/outline';
import { useComponentIdRouter } from '@/lib/context';
import { useCreateTodo, useFindUniqueList } from '@/zmodel/lib/hooks';
import TodoComponent from 'components/Todo';
import { ChangeEvent, KeyboardEvent, useState } from 'react';

export function ListDetails() {
    const componentId = useComponentIdRouter();
    const { data: list } = useFindUniqueList(
        {
            where: {
                id: componentId,
            },
            include: {
                todos: {
                    include: {
                        owner: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        },
        {
            enabled: !!componentId,
        }
    );

    const [title, setTitle] = useState('');
    const createTodo = useCreateTodo({ optimisticUpdate: true });

    if (!list) {
        return <></>;
    }

    const onCreateTodo = async () => {
        if (!title) {
            return;
        }
        setTitle('');
        await createTodo.mutateAsync({
            data: {
                title,
                listId: list.id,
            },
        });
    };

    return (
        <>
            <h1 className="mb-4 text-2xl font-semibold">{list.name}</h1>
            <div className="flex space-x-2">
                <input
                    type="text"
                    placeholder="Type a title and press enter"
                    className="input input-bordered mt-2 w-72 max-w-xs"
                    value={title}
                    onKeyUp={(e: KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') {
                            onCreateTodo();
                        }
                    }}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.currentTarget.value);
                    }}
                />
                <button onClick={() => onCreateTodo()}>
                    <PlusIcon className="size-6 text-gray-500" />
                </button>
            </div>
            <ul className="flex w-11/12 flex-col space-y-4 py-8 md:w-auto">
                {list.todos?.map((todo) => (
                    <TodoComponent key={todo.id} value={todo} />
                ))}
            </ul>
        </>
    );
}
