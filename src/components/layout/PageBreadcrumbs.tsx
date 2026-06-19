"use client";

import { memo } from "react";
import { Breadcrumbs, Link as JoyLink, Typography } from "@mui/joy";
import NextLink from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

function PageBreadcrumbsComponent({ items }: PageBreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <Breadcrumbs size="sm" sx={{ mb: 0.5 }}>
      {items.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        if (isLast) {
          return (
            <Typography
              key={item.label}
              level="body-sm"
              textColor="text.secondary"
              sx={{ fontWeight: 500 }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <JoyLink
            key={item.label}
            component={NextLink}
            href={item.href ?? "#"}
            level="body-sm"
            color={isFirst ? "primary" : "neutral"}
            underline="hover"
          >
            {item.label}
          </JoyLink>
        );
      })}
    </Breadcrumbs>
  );
}

export const PageBreadcrumbs = memo(PageBreadcrumbsComponent);
