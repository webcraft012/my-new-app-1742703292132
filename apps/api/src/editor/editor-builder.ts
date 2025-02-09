import { Injectable } from '@nestjs/common';
import {
  UIElement,
  EditorState,
  uiElementMapWithComponentName,
} from '@webcraft/types';

@Injectable()
export class EditorBuilder {
  private editorState: EditorState = {};
  constructor() {
    this.editorState = {
      ROOT: {
        type: {
          resolvedName: 'Workspace',
        },
        isCanvas: false,
        props: {},
        displayName: 'Workspace',
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
      },
    };
  }

  buildEditor(generatedUIElements: UIElement) {
    this.buildRecursivelyEditorStateFromUIElement(generatedUIElements);
    return this.editorState;
  }

  buildRecursivelyEditorStateFromUIElement(
    uiElement: UIElement,
    parentId = 'ROOT',
  ): string {
    console.log(uiElement);

    const generatedId = this.generateId();

    console.log('uiElement');

    const elementConfig = uiElementMapWithComponentName[uiElement.type];

    console.log('elementConfig');

    if (!elementConfig) {
      console.log('Element config not found', uiElement.type);
      return '';
    }

    if (elementConfig.isMain) {
      this.editorState.ROOT.linkedNodes['main'] = generatedId;
    }

    const children =
      !elementConfig.hasLinkedNodes && uiElement.children
        ? uiElement.children.map((child) =>
            this.buildRecursivelyEditorStateFromUIElement(child, generatedId),
          )
        : [];

    const linkedNode = elementConfig.hasLinkedNodes
      ? this.buildRecursivelyEditorStateFromUIElement(
          {
            ...uiElement,
            type: elementConfig.directChild,
          },
          generatedId,
        )
      : undefined;

    this.editorState[generatedId] = {
      type: {
        resolvedName: elementConfig.name,
      },
      isCanvas: elementConfig.isCanvas,
      props: uiElement.props
        ? { ...uiElement.props, textContent: uiElement.textContent }
        : {},
      displayName: elementConfig.name,
      custom: {},
      parent: elementConfig.isMain ? 'ROOT' : parentId,
      hidden: false,
      nodes: children,
      linkedNodes: linkedNode
        ? {
            [elementConfig.linkedNodeName]: linkedNode,
          }
        : {},
    };

    return generatedId;
  }

  generateId(length = 10) {
    const allowedChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
    let id = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length);
      id += allowedChars[randomIndex];
    }
    return id;
  }
}
