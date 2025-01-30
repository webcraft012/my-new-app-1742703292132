import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import Image from "next/image";
import React from "react";
import CardComponent from "../../static-components/Card";
import { Text } from "../text";
import { CardTop } from "./CardTop";
import { CardBottom } from "./CardBottom";
import { FormatTypes, TextTypes } from "../../settings-components";
import { CardComponentProps } from "@webcraft/types";
interface CardProps extends CardComponentProps {
  title: string;
  text: string;
}

export const Card: UserComponent<CardProps> = ({
  title,
  text,
  imageUrl,
  className,
  width,
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <CardComponent
      className={className}
      ref={(ref) => ref && connect(ref)}
      width={width}
    >
      {imageUrl ? (
        <Image alt="Image" className="w-full" src={imageUrl} />
      ) : null}
      <Element canvas id="content" is={CardTop}>
        <Text
          textFormats={[FormatTypes.Bold]}
          textType={TextTypes.Heading3}
          text={title}
        />
        <Text
          className="text-gray-700"
          textType={TextTypes.Parahraph}
          text={text}
        />
      </Element>
      <Element canvas id="buttons" is={CardBottom} />
    </CardComponent>
  );
};
