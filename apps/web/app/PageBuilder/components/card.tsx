import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import Image from "next/image";
import React from "react";
import CardComponent from "../static-components/card";
import { Text } from "./text";

interface CardProps {
  title: string;
  text: string;
  imageUrl?: string;
  className?: string;
  width?: number;
}

interface CardTopProps {
  children?: React.ReactNode;
}

interface CardBottomProps {
  children?: React.ReactNode;
}

export const CardTop: React.FC<CardTopProps> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </div>
  );
};

export const CardBottom: React.FC<CardBottomProps> = ({ children }) => {
  const {
    connectors: { connect },
  } = useNode();
  return (
    <div
      className="w-full h-auto min-h-[20px]"
      ref={(ref) => {
        if (ref) connect(ref);
      }}
    >
      {children}
    </div>
  );
};

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
        <Text className="font-bold text-xl mb-2" text={title} />
        <Text className="text-gray-700 text-base" text={text} />
      </Element>
      <Element canvas id="buttons" is={CardBottom} />
    </CardComponent>
  );
};

Card.craft = {
  props: {
    width: 100,
    text: "Click me",
  },
};
