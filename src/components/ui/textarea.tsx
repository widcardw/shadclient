import { cn } from "@/libs/cn";
import type { PolymorphicProps } from "@kobalte/core/polymorphic";
import * as TextFieldPrimitive from "@kobalte/core/text-field";
import type { ValidComponent, VoidProps } from "solid-js";
import { splitProps } from "solid-js";

type TextAreaProps = VoidProps<
  TextFieldPrimitive.TextFieldTextAreaProps & {
    class?: string;
  }
>;

export const TextArea = <T extends ValidComponent = "textarea">(
  props: PolymorphicProps<T, TextAreaProps>
) => {
  const [local, rest] = splitProps(props as TextAreaProps, ["class"]);

  return (
    <TextFieldPrimitive.TextArea
      class={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-inherit px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:(outline-none ring-1.5 ring-ring) disabled:(cursor-not-allowed opacity-50) transition-shadow",
        local.class
      )}
      {...rest}
    />
  );
};
