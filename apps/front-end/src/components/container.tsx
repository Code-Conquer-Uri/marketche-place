import { tv } from "tailwind-variants";

interface ContainerProps {
  children: React.ReactNode;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}
const root = tv({
  base: "mx-auto flex w-full max-w-7xl flex-col px-5 py-10 lg:py-16 2xl:px-0",
});

export function Container({ children, className }: ContainerProps) {
  return <section className={root({ className })}>{children}</section>;
}
