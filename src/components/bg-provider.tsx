import { SparklesBackground } from './ui/sparkles';

/** @internal Unused — reserved for future use. Replaced by direct SparklesBackground usage in provider.tsx. */
export const BGProvider = ({
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <SparklesBackground
      className="min-h-screen w-full overflow-x-clip"
      {...props}
    >
      {children}
    </SparklesBackground>
  );
};
