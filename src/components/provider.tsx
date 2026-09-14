import { ThemeProvider } from './theme-provider';
import { SparklesBackground } from './ui/sparkles';
import Navbar from './navbar/Navbar';
import Footer from './footer/Footer';

export const Provider = ({
  children,
  ...props
}: React.ComponentProps<'div'>) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SparklesBackground
        {...props}
        className="min-h-screen w-full overflow-x-clip"
      >
        <Navbar />
        <main className="w-full px-4 pt-16 sm:pt-20 pb-16 max-w-5xl mx-auto">
          {children}
        </main>
        <Footer />
      </SparklesBackground>
    </ThemeProvider>
  );
};
