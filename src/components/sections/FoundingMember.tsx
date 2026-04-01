import ScrollReveal from "@/components/ui/ScrollReveal";
import Button from "@/components/ui/Button";
import { FOUNDING_MEMBER } from "@/lib/constants";

export default function FoundingMember() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-[600px] mx-auto px-4 text-center">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-[1.7rem] font-bold text-firefly mb-8">
            {FOUNDING_MEMBER.title}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <ul className="space-y-3 mb-10 text-left max-w-sm mx-auto">
            {FOUNDING_MEMBER.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3 text-gray-700">
                <span className="text-casablanca font-bold">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <Button href="#final-cta" size="large">
            {FOUNDING_MEMBER.cta}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
