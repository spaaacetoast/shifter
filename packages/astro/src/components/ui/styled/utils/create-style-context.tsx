import { type JSX, createContext, useContext } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cx } from "styled-system/css/cx";
import { isCssProperty, panda } from "styled-system/jsx";
import type { ElementType, PandaComponent } from "styled-system/types";

type Props = Record<string, unknown>;
type Recipe = {
  (props?: Props): Props;
  splitVariantProps: (props: Props) => [Props, Props];
};

type Slot<R extends Recipe> = keyof ReturnType<R>;
type Options = { forwardProps?: string[] };

const shouldForwardProp = (
  prop: string,
  variantKeys: string[],
  options: Options = {},
) =>
  options.forwardProps?.includes(prop) ||
  (!variantKeys.includes(prop) && !isCssProperty(prop));

export const createStyleContext = <R extends Recipe>(recipe: R) => {
  const StyleContext = createContext<Record<Slot<R>, string> | null>(null);

  const withRootProvider = <P extends {}>(
    Component: ElementType,
  ): ((props: P) => JSX.Element) => {
    const PandaComponent = (props: P) => {
      const [variantProps, localProps] = recipe.splitVariantProps(props);
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>;

      return (
        <StyleContext.Provider value={slotStyles}>
          <Component {...localProps} />
        </StyleContext.Provider>
      );
    };
    return PandaComponent;
  };

  const withProvider = <P extends { class?: string }>(
    Component: ElementType,
    slot: Slot<R>,
    options?: Options,
  ): ((props: P) => JSX.Element) => {
    const PandaComponent = panda(
      Component,
      {},
      {
        shouldForwardProp: (prop, variantKeys) =>
          shouldForwardProp(prop, variantKeys, options),
      },
    ) as PandaComponent<ElementType>;

    return (props: P) => {
      const [variantProps, localProps] = recipe.splitVariantProps(props);
      const slotStyles = recipe(variantProps) as Record<Slot<R>, string>;

      return (
        <StyleContext.Provider value={slotStyles}>
          <Dynamic
            component={PandaComponent}
            {...localProps}
            class={cx(slotStyles?.[slot], props.class)}
          />
        </StyleContext.Provider>
      );
    };
  };

  const withContext = <P extends { class?: string }>(
    Component: ElementType,
    slot: Slot<R>,
  ): ((props: P) => JSX.Element) => {
    const PandaComponent = panda(Component);

    const Foo = (props: P) => {
      const slotStyles = useContext(StyleContext);
      return (
        <Dynamic
          component={PandaComponent}
          {...props}
          class={cx(slotStyles?.[slot], props.class)}
        />
      );
    };
    return Foo;
  };

  return {
    withRootProvider,
    withProvider,
    withContext,
  };
};
