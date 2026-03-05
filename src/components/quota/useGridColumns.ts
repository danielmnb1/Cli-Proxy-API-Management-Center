import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para calcular el número de columnas de la cuadrícula basado en el ancho del contenedor y el ancho mínimo del elemento.
 * Devuelve [columnas, refCallback].
 */
export function useGridColumns(
    itemMinWidth: number,
    gap: number = 16
): [number, (node: HTMLDivElement | null) => void] {
    const [columns, setColumns] = useState(1);
    const [element, setElement] = useState<HTMLDivElement | null>(null);

    const refCallback = useCallback((node: HTMLDivElement | null) => {
        setElement(node);
    }, []);

    useEffect(() => {
        if (!element) return;

        const updateColumns = () => {
            const containerWidth = element.clientWidth;
            const effectiveItemWidth = itemMinWidth + gap;
            const count = Math.floor((containerWidth + gap) / effectiveItemWidth);
            setColumns(Math.max(1, count));
        };

        updateColumns();

        const observer = new ResizeObserver(() => {
            updateColumns();
        });

        observer.observe(element);

        return () => observer.disconnect();
    }, [element, itemMinWidth, gap]);

    return [columns, refCallback];
}
