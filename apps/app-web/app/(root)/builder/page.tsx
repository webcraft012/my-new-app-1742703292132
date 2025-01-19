'use client';

import { Editor, Element, Frame } from "@craftjs/core";
import { Button, Container, Workplace, WorkplaceHolder } from "../../../builder-components";
import { Container as ContainerStatic } from "../../../builder-components/Container/static";
import { SideBar } from "../../../components/SideBar";
import { Container as ContainerComponent } from "../../../components/Container";
import { ContainerRow } from "../../../builder-components/Container/builder/ContainerRow";
import { ContainerColumn } from "../../../builder-components/Container/builder/ContainerColumn";
import { ContainerC } from "../../../builder-components/Container/static/Column";
import { ContainerRowHolder } from "../../../builder-components/Container/builder/container-row-holder";
export default function Page() {
  return (
    <Editor
      indicator={{
        error: "#e74c3c",
        success: "#2ecc71",
        thickness: 8,
        transition: "all 0.4s ease",
      }}
      resolver={{
        Button,
        Container,
        ContainerRow,
        ContainerColumn,
        Workplace,
        WorkplaceHolder,
        ContainerStatic,
        ContainerC,
        ContainerRowHolder
      }}
    >
      <ContainerComponent>
        <Frame>
          <Workplace />
        </Frame>
      </ContainerComponent>
      <SideBar />
    </Editor >
  );
}
