import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { ReviewsCarousel, type ReviewCardData } from "./reviews-carousel";
import { GalleryGrid, type GalleryPhoto } from "./gallery-grid";
import { ScrollReveal } from "./scroll-reveal";

const NAV_LINKS = [
  { label: "HOME", href: "#home" },
  { label: "SERVICES", href: "#services" },
  { label: "ABOUT", href: "#about" },
  { label: "REVIEWS", href: "#reviews" },
  { label: "GALLERY", href: "#gallery" },
  { label: "CONTACT", href: "#contact" },
] as const;

const GOOGLE_REVIEWS_URL = "https://share.google/CeY0Agpjwy2y9gSRy";

type GoogleReview = {
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string };
  googleMapsUri?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
};

type GooglePlace = {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: GoogleReview[];
};

const SERVICES = [
  {
    title: "Foot Reflexology",
    image: "/images/service-foot.jpg",
    alt: "Foot reflexology treatment at New Vigor Foot Spa",
  },
  {
    title: "Body Massage",
    image: "/images/service-massage.jpg",
    alt: "Relaxing body massage at New Vigor Foot Spa",
  },
  {
    title: "Hot Stone Therapy",
    image: "/images/service-stones.jpg",
    alt: "Hot stone therapy at New Vigor Foot Spa",
  },
] as const;

const SOCIAL_LINKS = [
  {
    label: "Yelp",
    href: "https://www.yelp.com/biz/vigor-foot-spa-smithtown",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
        <path d="M12.271 16.051c.516.172 1.706.586 2.213.758.508.172 1.02.344 1.414.602.387.258.645.688.645 1.117v2.355c0 .602-.387 1.117-.902 1.289a9.18 9.18 0 0 1-2.512.387c-.73 0-1.453-.086-2.168-.301a1.812 1.812 0 0 1-1.203-1.719v-2.262c0-.387.215-.73.516-.945.301-.215.645-.344.989-.387.473-.043.902-.086 1.29-.172.387-.086.602-.172.718-.222zm-1.406-4.498c-.473.473-1.203 1.203-1.633 1.633-.43.43-.945.793-1.543.945-.602.172-1.289.086-1.805-.258l-1.977-1.289c-.516-.344-.731-.945-.602-1.547.215-.859.602-1.633 1.117-2.32a9.3 9.3 0 0 1 1.633-1.891c.473-.387 1.074-.602 1.719-.473.602.129 1.074.516 1.375 1.031l1.633 2.512c.258.387.344.859.215 1.375-.129.516-.387.989-.732 1.332zm2.512-1.418c.301-.473.602-.989.86-1.375.258-.387.516-.73.86-.945.301-.215.687-.344 1.074-.387l2.426-.344c.602-.086 1.203.215 1.461.774.43.816.731 1.719.86 2.684.129.988.086 1.977-.172 2.891-.172.598-.645 1.074-1.246 1.203a1.57 1.57 0 0 1-1.547-.387l-2.598-2.426c-.344-.344-.559-.774-.645-1.247-.086-.472-.043-1.002.215-1.461.031-.043.063-.096.094-.139zm-1.16-3.39c.387-.559.731-1.031 1.031-1.461.301-.43.688-.731 1.16-.86.473-.129.988-.086 1.418.172l2.082 1.461c.473.344.688.989.559 1.633-.086.473-.301.902-.602 1.246-.301.344-.645.602-1.031.774-.387.172-.774.258-1.161.344l-2.598.559c-.387.086-.774.086-1.117-.043-.345-.129-.645-.387-.86-.688-.207-.301-.345-.645-.387-1.031-.044-.387 0-.73.129-1.074.086-.215.172-.473.301-.732.086-.171.172-.332.249-.493zm2.619 5.924c.301.387.559.73.86.989.302.258.645.387 1.032.387.387 0 .773-.129 1.117-.344l2.082-1.461c.516-.387.73-1.117.473-1.762-.387-.989-.945-1.891-1.633-2.598-.473-.473-1.074-.86-1.762-1.074a1.54 1.54 0 0 0-1.547.387l-2.082 2.598c-.258.344-.387.73-.387 1.161 0 .43.172.816.473 1.117.086.086.172.172.258.301.086.128.172.257.248.386z" />
      </svg>
    ),
  },
  {
    label: "Google",
    href: "https://share.google/CeY0Agpjwy2y9gSRy",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Vigor-Foot-Spa/100064836738289/",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/new_vigor_foot_spa/",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
] as const;

const GALLERY_IMAGES = [
  {
    src: "/images/gallery-reception-full.webp",
    alt: "Welcoming reception desk and plants at New Vigor Foot Spa",
    caption: "A warm welcome",
    width: 1280,
    height: 853,
  },
  {
    src: "/images/gallery-foot-reflexology-full.webp",
    alt: "Therapist massaging a guest's feet with coconut oil",
    caption: "Foot reflexology",
    width: 853,
    height: 1280,
  },
  {
    src: "/images/gallery-storefront-full.webp",
    alt: "New Vigor Foot Spa storefront on West Main Street in Smithtown",
    caption: "Find us in Smithtown",
    width: 1280,
    height: 853,
  },
  {
    src: "/images/gallery-treatment-room-full.webp",
    alt: "Massage beds with red covers, fresh linens and softly lit screen dividers",
    caption: "Room to unwind",
    width: 1280,
    height: 853,
  },
  {
    src: "/images/gallery-hot-stones-full.webp",
    alt: "Therapist using smooth hot stones during a back massage",
    caption: "Hot stone therapy",
    width: 1280,
    height: 854,
  },
  {
    src: "/images/gallery-private-room-full.webp",
    alt: "A cozy massage bed beside a warm lamp and a flower arrangement",
    caption: "A moment of calm",
    width: 853,
    height: 1280,
  },
  {
    src: "/images/gallery-reflexology-lounge-full.webp",
    alt: "Reclining foot massage chairs with fresh towels and screen dividers",
    caption: "Foot reflexology lounge",
    width: 1280,
    height: 854,
  },
  {
    src: "/images/gallery-massage-room-full.webp",
    alt: "Massage beds prepared with fresh linens and screen dividers",
    caption: "Your peaceful escape",
    width: 1280,
    height: 854,
  },
  {
    src: "/images/gallery-neck-shoulder-full.webp",
    alt: "Therapist applying pressure to a guest's neck and shoulders",
    caption: "Neck & shoulder care",
    width: 853,
    height: 1280,
  },
  {
    src: "/images/gallery-deep-tissue-full.webp",
    alt: "Therapist applying firm pressure to a guest's back during a massage",
    caption: "Deep tissue massage",
    width: 1280,
    height: 854,
  },
  {
    src: "/images/gallery-cupping-full.webp",
    alt: "Clear glass cupping jars neatly arranged on a tray",
    caption: "Traditional cupping",
    width: 1280,
    height: 853,
  },
  {
    src: "/images/gallery-gift-certificates-full.webp",
    alt: "New Vigor Foot Spa gift certificates with pink envelopes",
    caption: "Give the gift of relaxation",
    width: 1280,
    height: 853,
  },
] as const satisfies readonly GalleryPhoto[];

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#home" className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            alt="New Vigor Foot Spa"
            className="h-20 w-auto"
          />
          <span className="font-serif text-xl tracking-wide text-white">
            New Vigor Foot Spa
          </span>
        </a>
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm tracking-widest text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section
      id="home"
      className="relative flex h-screen items-center justify-center overflow-hidden"
    >
      <img
        src="/images/hero-bg.jpg"
        alt="New Vigor Foot Spa relaxing environment"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h1 className="mb-6 font-serif text-5xl leading-tight text-white md:text-7xl">
          Your Escape from Stress
        </h1>
        <p className="mb-10 text-lg text-gray-300 md:text-xl">
          A peaceful place to relax and recharge.
        </p>
        <a
          href="tel:+16316568887"
          className="inline-block rounded-full bg-accent px-10 py-4 text-sm font-semibold tracking-widest text-white transition-colors hover:bg-accent-hover"
        >
          CALL (631) 656-8887
        </a>
        <a
          href="https://go.bychronos.com/l/smithtown-11787-new-vigor-foot-spa-806098/a/services?p=g&rwg_token=AFd1xnGD5z7fjU2uLNFUlpWQ-3BnBBo4JxBWCC8iUHvgt7wuh4KD2NWTkHG_7yabDFB4L8jaFkZqkyXXOMAUv53GRnLFPfjloQ%3D%3D"
          className="mt-3 inline-block text-sm text-gray-400 underline underline-offset-2 transition-colors hover:text-accent"
        >
          Book Online
        </a>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="services" className="bg-bg-cream py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="mb-16 text-center font-serif text-4xl text-brown-deep md:text-5xl">
            Our Services
          </h2>
        </ScrollReveal>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {SERVICES.map((service, index) => (
            <ScrollReveal key={service.title} delay={index * 80} className="flex flex-col items-center">
              <div className="mb-6 size-48 overflow-hidden rounded-full shadow-lg">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="size-full object-cover"
                />
              </div>
              <h3 className="font-serif text-xl text-brown-deep">
                {service.title}
              </h3>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Prices() {
  return (
    <section id="prices" className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <ScrollReveal>
          <h2 className="mb-12 font-serif text-4xl text-brown-deep md:text-5xl">
            Services &amp; Pricing
          </h2>
        </ScrollReveal>
        <ScrollReveal className="overflow-hidden rounded-xl shadow-lg">
          <img
            src="/images/price.jpg"
            alt="New Vigor Foot Spa price list"
            className="w-full"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="bg-white py-24">
      <ScrollReveal className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-8 font-serif text-4xl text-brown-deep md:text-5xl">
          About Us
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600">
          At New Vigor Foot Spa, we believe in the healing power of touch. Our
          skilled therapists combine traditional techniques with modern wellness
          practices to provide you with an unparalleled relaxation experience.
          Step into our tranquil sanctuary and let your journey to wellness
          begin.
        </p>
      </ScrollReveal>
    </section>
  );
}

type GooglePlaceResult = {
  place: GooglePlace | null;
  status: string;
};

async function getGooglePlace(): Promise<GooglePlaceResult> {
  await connection();

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    return { place: null, status: "missing-key" };
  }

  try {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": [
            "places.displayName",
            "places.rating",
            "places.userRatingCount",
            "places.googleMapsUri",
            "places.reviews.rating",
            "places.reviews.text",
            "places.reviews.relativePublishTimeDescription",
            "places.reviews.authorAttribution",
            "places.reviews.googleMapsUri",
          ].join(","),
        },
        body: JSON.stringify({
          textQuery: "New Vigor Foot Spa, 27 W Main St, Smithtown, NY 11787",
          pageSize: 1,
          languageCode: "en",
          regionCode: "US",
        }),
      },
    );

    if (!response.ok) {
      return { place: null, status: `google-${response.status}` };
    }

    const data = (await response.json()) as { places?: GooglePlace[] };
    const place = data.places?.[0];

    if (place?.displayName?.text !== "New Vigor Foot Spa") {
      return { place: null, status: place ? "place-mismatch" : "no-place" };
    }

    return { place, status: "ready" };
  } catch {
    return { place: null, status: "request-error" };
  }
}

function GoogleMapsAttribution() {
  return (
    <span className="text-sm text-[#5e5e5e]">
      Reviews from <span className="font-semibold">Google Maps</span>
    </span>
  );
}

function ReviewsFallback({ status = "loading" }: { status?: string }) {
  return (
    <section id="reviews" className="bg-bg-cream py-16 md:py-20" data-review-status={status}>
      <ScrollReveal className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-accent uppercase">
          Guest Experiences
        </p>
        <h2 className="font-serif text-4xl text-brown-deep md:text-5xl">
          What Our Guests Say
        </h2>
        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
          <GoogleMapsAttribution />
          <p className="mt-3 leading-relaxed text-gray-600">
            See recent guest experiences and ratings for New Vigor Foot Spa on
            Google Maps.
          </p>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-full bg-accent px-7 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-accent-hover"
          >
            Read Our Google Reviews
            <span className="ml-2" aria-hidden="true">↗</span>
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}

async function GoogleReviews() {
  const { place, status } = await getGooglePlace();
  const reviews = (place?.reviews ?? [])
    .filter((review) => review.text?.text)
    .slice(0, 5);

  if (!place || reviews.length === 0) {
    return <ReviewsFallback status={place ? "no-reviews" : status} />;
  }

  const reviewsUrl = place.googleMapsUri ?? GOOGLE_REVIEWS_URL;
  const rating = place.rating ?? 5;
  const reviewCards: ReviewCardData[] = reviews.map((review) => ({
    authorName: review.authorAttribution?.displayName ?? "Google reviewer",
    authorUri: review.authorAttribution?.uri,
    photoUri: review.authorAttribution?.photoUri,
    rating: review.rating ?? 5,
    relativeTime:
      review.relativePublishTimeDescription ?? "Google review",
    text: review.text?.text ?? "",
    reviewUrl: review.googleMapsUri ?? reviewsUrl,
  }));

  return (
    <section id="reviews" className="bg-bg-cream py-16 md:py-20" data-review-status="ready">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-8 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-accent uppercase">
              Guest Experiences
            </p>
            <h2 className="font-serif text-4xl text-brown-deep md:text-5xl">
              What Our Guests Say
            </h2>
          </div>
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white px-5 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="font-serif text-3xl text-brown-deep">
              {rating.toFixed(1)}
            </span>
            <span className="text-left">
              <span
                className="block tracking-[0.08em] text-amber-400"
                aria-label={`${rating} out of 5 stars`}
              >
                ★★★★★
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                {place.userRatingCount
                  ? `Based on ${place.userRatingCount} reviews`
                  : "Guest rating"}
              </span>
            </span>
            <span
              className="text-accent transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              ↗
            </span>
          </a>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <ReviewsCarousel reviews={reviewCards} />
        </ScrollReveal>

        <div className="mt-5 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
          <GoogleMapsAttribution />
          <p className="text-xs text-gray-500">
            Showing up to five reviews selected and ordered by Google based on relevance.
          </p>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="bg-bg-warm py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="mb-16 text-center font-serif text-4xl text-brown-deep md:text-5xl">
            Gallery
          </h2>
        </ScrollReveal>
        <GalleryGrid photos={GALLERY_IMAGES} />
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-brown-deep py-24">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <h2 className="mb-4 text-center font-serif text-4xl text-white md:text-5xl">
            Get in Touch
          </h2>
          <p className="mb-12 text-center text-gray-400">
            Follow us on social media or give us a call
          </p>
        </ScrollReveal>
        <ScrollReveal delay={70} className="mb-16 flex flex-wrap justify-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold tracking-wider text-white transition-colors hover:bg-white/20"
            >
              {link.icon}
              {link.label}
            </a>
          ))}
        </ScrollReveal>
        <ScrollReveal className="mx-auto max-w-[600px] overflow-hidden rounded-xl shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3017.76892869825!2d-73.19827942310026!3d40.854996771372434!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e83a17a066dead%3A0xd5e22159224b7c6a!2sNew%20Vigor%20Foot%20Spa!5e0!3m2!1sen!2sus!4v1780090880266!5m2!1sen!2sus"
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="New Vigor Foot Spa location"
          />
        </ScrollReveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-black py-8">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <p className="mb-2 font-serif text-lg text-white/80">
          New Vigor Foot Spa
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} New Vigor Foot Spa. All rights
          reserved.
        </p>
        <div className="mt-4 flex items-center justify-center gap-5 text-xs text-gray-500">
          <Link
            href="/privacy"
            className="transition-colors hover:text-white/80"
          >
            Privacy Policy
          </Link>
          <Link href="/terms" className="transition-colors hover:text-white/80">
            Terms of Use
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Prices />
      <About />
      <Suspense fallback={<ReviewsFallback />}>
        <GoogleReviews />
      </Suspense>
      <Gallery />
      <Contact />
      <Footer />
    </>
  );
}
