import { useEffect, useState, useCallback } from 'react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from '@design/ui/button';
import { ExecutionList } from './ExecutionList';
import { set } from 'zod';

export const ExecutionBar = () => {
    const [isAsideVisible, setIsAsideVisible] = useState(true);
    const [isTitleVisible, setIsTitleVisible] = useState(true);
    const [isFinalClose, setIsFinalClose] = useState(false);

    useEffect(() => {
        const bc = new BroadcastChannel('title_change');

        const checkUpdate = (instanceId: number, newTitle: string) => {
            const $draftLi = document.querySelectorAll('.draft-cell');

            $draftLi.forEach((li) => {
                const id = li.getAttribute('data-id');

                if (id === null || parseInt(id) !== instanceId) {
                    return;
                }

                const $title = li.querySelector('a');

                if ($title === null) {
                    console.error('Title anchor not found');
                    return;
                }

                $title.textContent = newTitle;
            });
        };

        bc.onmessage = (event) => {
            const { instanceId, newTitle } = event.data;
            checkUpdate(instanceId, newTitle);
        };

        return () => {
            bc.close();
        };
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if(!isTitleVisible)
                setIsFinalClose(true);
        }, 300)

        return () => {
            clearTimeout(timeout);
        }
    }, [isTitleVisible]);

    return (
        <aside className="bg-card bg-opacity-70 rounded-r-3xl pr-3 py-3 sm:flex flex-col overflow-y-auto">
            <div className="flex flex-row justify-start space-x-6 items-center">
                <h2
                    id="draft-title"
                    className={`font-bold text-lg ml-8 opacity-100 transition-all duration-300 ${!isTitleVisible ? 'md:opacity-0' : 'md:opacity-100'} ${isFinalClose ? 'md:hidden' : ''}`}
                >
                    Executions
                </h2>

                <Button id="toggle" variant="secondary" size="icon" className="size-8"
                    onClick={() => {
                        setIsFinalClose(false);
                        setIsAsideVisible((prev) => !prev);
                        setIsTitleVisible((prev) => !prev);
                    }}
                >
                    <ChevronLeftIcon id="toggle-off-md" className={`size-5 hidden ${isAsideVisible ? 'md:block' : ''}`} />
                    <ChevronRightIcon id="toggle-on-md" className={`size-5 hidden ${isAsideVisible ? '' : 'md:block'}`} />
                    <ChevronUpIcon id="toggle-off" className={`size-5 md:hidden ${isAsideVisible ? '' : 'hidden'}`} />
                    <ChevronDownIcon id="toggle-on" className={`size-5 md:hidden ${isAsideVisible ? 'hidden' : ''}`} />
                </Button>
            </div>
            <ul
                id="list"
                className={`m-3 md:max-h-fit overflow-x-auto overflow-y-hidden grid opacity-100 gap-3 transition-all duration-200 ${!isAsideVisible ? 'hidden opacity-0' : 'opacity-100'}`}
            >
                <ExecutionList />
            </ul>
        </aside>
    );
};