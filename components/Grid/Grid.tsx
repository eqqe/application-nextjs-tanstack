import { useCurrentGrid } from '@/hooks/useCurrentGrid';
import { GridCard } from './Card/GridCard';
import { GridTabs } from './Tabs/GridTabs';
import { gridCols, colSpans, rowStarts, rowEnds, colStarts, colEnds } from './utils';
import { FallbackError } from '../layout/FallbackError';
import { ErrorBoundary } from 'react-error-boundary';

export const Grid = () => {
    const grid = useCurrentGrid();

    if (!grid?.elements.length) {
        return <></>;
    }

    return (
        <div className={`grid sm:grid-cols-2  ${gridCols[grid.columns]} gap-4`}>
            {grid.elements.map((element) => {
                function getComponentRender() {
                    switch (element.type) {
                        case 'Card': {
                            return element.card ? <GridCard key={element.id} card={element.card} /> : <></>;
                        }
                        case 'Tabs': {
                            return element.tabs ? <GridTabs key={element.id} tabs={element.tabs} /> : <></>;
                        }
                        default:
                            throw 'Unsupport element type';
                    }
                }

                return (
                    <div
                        key={element.id}
                        className={`
                            ${element.colSpan ? colSpans[element.colSpan] : ''}
                            ${element.rowStart ? rowStarts[element.rowStart] : ''}
                            ${element.rowEnd ? rowEnds[element.rowEnd] : ''}
                            ${element.colStart ? colStarts[element.colStart] : ''}
                            ${element.colEnd ? colEnds[element.colEnd] : ''}
                            `}
                    >
                        <ErrorBoundary fallback={<FallbackError />}>{getComponentRender()}</ErrorBoundary>
                    </div>
                );
            })}
        </div>
    );
};
