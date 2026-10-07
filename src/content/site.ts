import type { Locale } from "@/lib/i18n";

/**
 * Clinic contact details, in one place.
 * PLACEHOLDERS: replace phone, WhatsApp, address and hours with the real ones.
 */
export const site = {
  short: "BMC",
  name: { ar: "مركز بركات للرعاية الطبية", en: "Barakat Medcare Center" },
  phoneDisplay: "+20 100 000 0000",
  phoneHref: "tel:+201000000000",
  whatsappHref: "https://wa.me/201000000000",
  address: {
    ar: "يُضاف عنوان المركز هنا",
    en: "Clinic address goes here",
  },
  /**
   * No backend yet: bookings are kept in this browser only and the booking flow
   * shows a short demo note. Set to false once a real booking API is connected.
   */
  bookingDemo: true,
  hours: {
    ar: "تُضاف مواعيد العمل هنا",
    en: "Opening hours go here",
  },
} as const;

export const t = <T,>(value: Record<Locale, T>, lang: Locale) => value[lang];
