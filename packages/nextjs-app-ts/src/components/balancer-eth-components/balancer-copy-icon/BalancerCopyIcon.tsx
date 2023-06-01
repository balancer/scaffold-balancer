import { CopyOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { FC } from 'react';

import { IBalancerCopyIcon } from './IBalancerCopyIcon';

import { useBalancerCopyIcon } from '~~/components/balancer-eth-components/balancer-copy-icon/BalancerCopyIcon.hook';

export const BalancerCopyIcon: FC<IBalancerCopyIcon> = ({ textToCopy }) => {
  const { copyToClipboard, resetTooltip, tooltipText } = useBalancerCopyIcon({ textToCopy });

  return (
    <Tooltip title={tooltipText} showArrow={false}>
      <CopyOutlined className={'balancer-copy-icon'} onClick={copyToClipboard} onMouseLeave={resetTooltip} />
    </Tooltip>
  );
};
