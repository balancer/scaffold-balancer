import { InfoCircleOutlined } from '@ant-design/icons';
import { Input, Modal, Space, Tooltip, Typography } from 'antd';
import React from 'react';

const { Title, Text, Paragraph } = Typography;

interface Props {
  isOpen: boolean;
  close: () => void;
}

export function SorConfigModal({ isOpen, close }: Props) {
  return (
    <Modal
      title="SOR Graph Traversal Config"
      open={isOpen}
      onOk={close}
      onCancel={close}
      cancelButtonProps={{ hidden: true }}>
      <Space style={{ width: '100%' }} direction="vertical" size={12}>
        <div>
          <Space direction="horizontal" align="center">
            <Text strong>Max depth</Text>
            <Tooltip title="The maximum number of tokens that can appear in a single path, including token in and token out.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
          <Input type="number" min={0} max={15} defaultValue={7} />
        </div>
        <div>
          <Space direction="horizontal" align="center">
            <Text strong>Max non-booted path depth</Text>
            <Tooltip title="The maximum number of tokens that can appear in a single path when no phantom BPT are present, including token in and token out.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
          <Input type="number" min={0} max={5} defaultValue={3} />
        </div>
        <div>
          <Space direction="horizontal" align="center">
            <Text strong>Max non-booted tokens in boosted path</Text>
            <Tooltip title="The maximum number of non phantom BPT tokens that can appear in a boosted path.">
              <InfoCircleOutlined />
            </Tooltip>
          </Space>
          <Input type="number" min={0} max={5} defaultValue={1} />
        </div>
      </Space>
    </Modal>
  );
}
