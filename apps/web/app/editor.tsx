"use client";

import { Editor, Frame } from "@craftjs/core";
import React from "react";
import { Button } from "./PageBuilder/components/button";
import { Card } from "./PageBuilder/components/card";
import { CardBottom } from "./PageBuilder/components/card/CardBottom";
import { CardTop } from "./PageBuilder/components/card/CardTop";
import { Container } from "./PageBuilder/components/container";
import { ContainerRowWorkplace } from "./PageBuilder/components/container/container-row-workplace";
import { ContainerWorkplace } from "./PageBuilder/components/container/container-workplace";
import { Spacer } from "./PageBuilder/components/spacer";
import { Text } from "./PageBuilder/components/text";
import { useGetEditor } from "./PageBuilder/hooks/useGetEditor";
import { Navbar } from "./PageBuilder/navbar";
import { RenderNode } from "./PageBuilder/render-node";
import { Sidebar } from "./PageBuilder/sidebar";
import { WorkplaceHolder, Workspace } from "./PageBuilder/workspace";

export const PageEditor: React.FC = () => {
  const { data } = useGetEditor("af9a0019s74655fc48685d003525a3584");

  return (
    <Editor
      indicator={{
        error: "#e74c3c",
        success: "#74b9ff",
        thickness: 8,
        transition: "all 0.4s ease",
      }}
      onRender={RenderNode}
      resolver={{
        Workspace,
        WorkplaceHolder,
        Card,
        CardBottom,
        CardTop,
        Button,
        Text,
        Container,
        ContainerRowWorkplace,
        ContainerWorkplace,
        Spacer,
      }}
    >
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="page-container flex-1 flex flex-grow">
          <Frame
            data={data?.state ? JSON.parse(data.state) : undefined}
            key={data?.id}
          >
            <Workspace />
          </Frame>
          <Sidebar />
        </div>
      </div>
    </Editor>
  );
};
