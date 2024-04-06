import { Dropdown } from "antd";
import { useMemo, useState } from "react";
import styled from "styled-components";

import type { ButtonProps, MenuProps } from "antd";
import type { ReactNode } from "react";

import { RippleButton } from "@/components/Button";

import { DownArrowIcon, UpArrowIcon } from "@/assets/icons/arrow";

interface SelectProps extends MenuProps {
  title?: string;
  items: { label: string; key: string }[] | undefined;
  loading?: ButtonProps["loading"];
  icon?: ButtonProps["icon"];
  children?: ReactNode;
}

const TitleWrapper = styled.div`
  font-weight: 700;
  max-width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default function Select({
  title,
  items,
  loading,
  icon,
  onSelect,
  onDeselect,
  selectedKeys,
  children,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () =>
      selectedKeys?.length && selectedKeys.length > 0
        ? selectedKeys
            .map((key) => items?.find((item) => key === item.key)?.label)
            .join(", ")
        : undefined,
    [items, selectedKeys]
  );

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys,
        onClick: () => setOpen(false),
        onSelect,
        onDeselect,
      }}
      onOpenChange={(status) => setOpen(status)}
      trigger={["click"]}
      disabled={!items?.length}
    >
      {children ?? (
        <RippleButton
          icon={icon}
          loading={loading}
          category={selected ? "solid" : "outlined"}
          palette="sub"
          onClick={(e) => e.preventDefault()}
          style={{ columnGap: "8px" }}
        >
          <TitleWrapper>{selected ?? title}</TitleWrapper>
          {open ? (
            <UpArrowIcon style={{ fontSize: "0.5em" }} />
          ) : (
            <DownArrowIcon style={{ fontSize: "0.5em" }} />
          )}
        </RippleButton>
      )}
    </Dropdown>
  );
}
