import { LinkPreview } from '../ui/link-preview';
import { InteractiveLiquidGlassBubble } from '../about/LiquidGlassAvatar';
import Image from 'next/image';

interface Company {
  name: string;
  role?: string;
  logo: string;
  url?: string;
  description?: string;
}

const defaultCompanies: Company[] = [
  {
    name: 'InAmigos Foundation',
    role: 'Web Development Intern',
    logo: '/images/inamigossq.jpg',
    url: 'https://drive.google.com/file/d/1SQrXxg3viKmNpgP_BHYK1gy1h07X_2Y6/view?usp=sharing',
    description:
      'Web development internship delivering user-facing volunteer portals and backend service routes (Feb 2026 – May 2026).',
  },
  {
    name: 'Cheating Daddy',
    role: 'Open Source Contributor',
    logo: '/images/cheatingdaddysq.png',
    url: 'https://github.com/sohzm/cheating-daddy/pull/370',
    description:
      'Authored Pull Request #370 resolving multi-model migrations and dynamic storage key limits (May 2026 – July 2026).',
  },
];

export const Experience = ({
  companies = defaultCompanies,
}: {
  companies?: Company[];
  children?: React.ReactNode;
}) => {
  return (
    <div className="p-2 pb-4 flow-root">
      {/* Heading */}
      <h2 className="text-foreground mb-3 sm:mb-4">
        <span className="font-light text-md md:text-lg ">
          Companies I&apos;ve
        </span>{' '}
        <span className="text-foreground/50 text-sm">worked</span>{' '}
        <span className="italic text-base font-light">with</span>
      </h2>
      <div className="w-full flex flex-col gap-5">
        {companies.map((company) => (
          <div key={company.name} className="flex gap-4">
            <InteractiveLiquidGlassBubble
              background={
                <div className="w-full h-full transition-transform duration-300 ease-out">
                  <Image
                    width={200}
                    height={200}
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-cover m-auto"
                    priority
                  />
                </div>
              }
              className="w-10 h-10 aspect-square rounded-full transition-shadow duration-300 shadow-md hover:shadow-xl"
              contentClassName="w-full h-full rounded-full overflow-hidden"
              overlayClassName="z-20 pointer-events-none border-0 ring-1 ring-inset ring-black/10 dark:ring-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_6px_rgba(0,0,0,0.2),0_8px_24px_-4px_rgba(0,0,0,0.18)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-3px_8px_rgba(0,0,0,0.5),0_10px_28px_-4px_rgba(0,0,0,0.4)]"
            />
            <div className="flex flex-col">
              <div className="text-foreground">
                <span className="text-xs font-medium">
                  {company.url ? (
                    <LinkPreview
                      url={company.url}
                      target="_blank"
                      title={company.name}
                      dotGap={6}
                      dotOffset={-1}
                    >
                      {company.name}
                    </LinkPreview>
                  ) : (
                    company.name
                  )}
                </span>
                {company.role && (
                  <span className="text-[0.6rem] italic text-foreground/50">
                    {' - ' + company.role}
                  </span>
                )}
              </div>
              {company.description && (
                <p className="text-[0.6rem] text-justify text-foreground/90">
                  {company.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
