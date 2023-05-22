import { useState } from 'react';

import { IBalancerCopyIcon } from './IBalancerCopyIcon';

const COPY_TEXT = 'Click to copy';
const COPIED_TEXT = 'Copied!';

export const useBalancerCopyIcon = ({ textToCopy }: IBalancerCopyIcon) => {
  const [tooltipText, setTooltipText] = useState(COPY_TEXT);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(textToCopy || '');
    setTooltipText(COPIED_TEXT);
  };

  const resetTooltip = () => {
    setTimeout(() => {
      setTooltipText(COPY_TEXT);
    }, 500);
  };

  return {
    copyToClipboard,
    resetTooltip,
    tooltipText,
  };
};
