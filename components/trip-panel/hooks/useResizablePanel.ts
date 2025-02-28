import { useState, useEffect } from 'react';

interface UseResizablePanelProps {
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  isMobile: boolean;
}

export const useResizablePanel = ({
  minWidth,
  maxWidth,
  defaultWidth,
  isMobile
}: UseResizablePanelProps) => {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setWidth(window.innerWidth);
    } else {
      setWidth(defaultWidth);
    }
  }, [isMobile, defaultWidth]);

  useEffect(() => {
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing) return;
        const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);

        setWidth(newWidth);
      };

      const handleMouseUp = () => setIsResizing(false);

      if (isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isMobile, minWidth, maxWidth]);

  return { width, isResizing, setIsResizing };
};
