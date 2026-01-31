import { useEffect, useState } from "react";

type Options = {
  fadeDuration?: number;   // ms
  holdDuration?: number;   // ms
};

export function useHeroTextCycle(texts: string[], options: Options = {}) {
  const {
    fadeDuration = 1000,
    holdDuration = 1100,
  } = options;

  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const lastIndex = texts.length - 1;

    if (index >= lastIndex) {
      if (!visible) {
        setVisible(true);
      }
      return;
    }
    let timeout1: number;
    let timeout2: number;

    timeout1 = window.setTimeout(() => {
      setVisible(false);

      timeout2 = window.setTimeout(() => {
        setIndex(i => i + 1);
        setVisible(true);
      }, fadeDuration);

    }, holdDuration);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [index, texts.length, fadeDuration, holdDuration]);

  return {
    text: texts[index],
    visible,
  };
}
