"use client";

import { Editor, Frame } from "@craftjs/core";
import React, { useEffect, useState } from "react";
import { Button } from "./PageBuilder/components/button";
import { Card, CardBottom, CardTop } from "./PageBuilder/components/card";
import { Container } from "./PageBuilder/components/container";
import { Spacer } from "./PageBuilder/components/spacer";
import { Text } from "./PageBuilder/components/text";
import { Navbar } from "./PageBuilder/navbar";
import { RenderNode } from "./PageBuilder/render-node";
import { Sidebar } from "./PageBuilder/sidebar";
import { WorkplaceHolder, Workspace } from "./PageBuilder/workspace";
import { ContainerHolder } from "./PageBuilder/components/container/container-holder";
import { ContainerRowHolder } from "./PageBuilder/components/container/container-row-holder";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetEditor } from "./PageBuilder/hooks/useGetEditor";

export const PageEditor: React.FC = () => {
  const { data } = useGetEditor("af9a001974655fc48685d003525a3584");

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
        ContainerRowHolder,
        Card,
        CardBottom,
        CardTop,
        Button,
        Text,
        Container,
        ContainerHolder,
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
