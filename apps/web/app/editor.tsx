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

export const PageEditor: React.FC = () => {
  const [json, setJson] = useState<string | undefined>();
  const [key, setKey] = useState<string | undefined>();

  // Load save state from server on page load
  useEffect(() => {
    // const state = localStorage.getItem("craftjs");
    // if (state) {
    //   setJson(state);
    //   setKey("loaded-json");
    //   console.log({
    //     state,
    //   });
    // }
  }, []);

  return (
    <Editor
      indicator={{
        error: "#e74c3c",
        success: "#2ecc71",
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
          <Frame data={json ? JSON.parse(json) : undefined} key={key}>
            <Workspace />
          </Frame>
          <Sidebar />
        </div>
      </div>
    </Editor>
  );
};
