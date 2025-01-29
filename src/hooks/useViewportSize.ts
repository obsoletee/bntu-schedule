import { useState, useEffect } from 'react';

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

export const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState(getWindowDimensions());

  useEffect(() => {
    const handleResize = () => {
      setViewportSize(getWindowDimensions());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return viewportSize;
};
