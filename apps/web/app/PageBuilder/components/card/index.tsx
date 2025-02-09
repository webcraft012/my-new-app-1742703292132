import type { UserComponent } from "@craftjs/core";
import { Element, useNode } from "@craftjs/core";
import Image from "next/image";
import CardComponent from "../../static-components/Card";
import { Text } from "../text";
import { CardTop } from "./CardTop";
import { CardBottom } from "./CardBottom";
import { CardComponentProps } from "@webcraft/types";
interface CardProps extends CardComponentProps {
  title: string;
  text: string;
}

export const Card: UserComponent<CardProps> = ({
  title,
  text,
  imageUrl,
  w,
  ...props
}) => {
  const {
    connectors: { connect },
  } = useNode();

  return (
    <CardComponent ref={(ref) => ref && connect(ref)} {...props}>
      {imageUrl ? (
        <Image alt="Image" className="w-full" src={imageUrl} />
      ) : null}
      <Element canvas id="content" is={CardTop}>
        <Text
          // textFormats={[FormatTypes.Bold]}
          fontSize="text-2xl"
          textContent={title}
        />
        <Text
          fontSize={"text-base"}
          textColor={"text-gray-500"}
          textContent={text}
        />
      </Element>
      <Element canvas id="buttons" is={CardBottom} />
    </CardComponent>
  );
};

Card.craft = {
  props: {
    px: "px-6",
    py: "py-4",
  },
};
