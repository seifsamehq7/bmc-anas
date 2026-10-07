import type { StaticImageData } from "next/image";
import type { Locale } from "@/lib/i18n";

import mri from "@/assets/machines/mri.jpg";
import ct from "@/assets/machines/ct.jpg";
import dexa from "@/assets/machines/dexa.jpg";
import pet from "@/assets/machines/pet.jpg";
import nuclear from "@/assets/machines/nuclear.jpg";
import xray from "@/assets/machines/xray.jpg";
import mammography from "@/assets/machines/mammography.jpg";
import ultrasound from "@/assets/machines/ultrasound.jpg";

type Copy = {
  name: string;
  tagline: string;
  description: string;
  uses: string[];
  duration: string;
  radiation: string;
  prep: string;
  before: string[];
  during: string[];
};

type MachineSource = {
  slug: string;
  abbr: string;
  /** One of the four brand colors; drives the glow and the lens ring. */
  tone: "blue" | "cyan" | "mint" | "navy";
  image: StaticImageData;
  /** Product family pictured (photo source: GE HealthCare). */
  pictured: string;
  copy: Record<Locale, Copy>;
};

const sources: MachineSource[] = [
  {
    slug: "mri",
    abbr: "MRI",
    tone: "blue",
    image: mri,
    pictured: "SIGNA Champion 1.5T",
    copy: {
      ar: {
        name: "الرنين المغناطيسي",
        tagline: "صور دقيقة للأنسجة الرخوة، بدون أي إشعاع.",
        description:
          "يستخدم مجالاً مغناطيسياً وموجات راديو لتكوين صور مفصلة للمخ والعمود الفقري والمفاصل والأعضاء الداخلية. جهازنا 1.5 تسلا بفتحة واسعة تجعل الفحص أكثر راحة.",
        uses: ["المخ والأعصاب", "العمود الفقري", "المفاصل والإصابات الرياضية", "البطن والحوض"],
        duration: "من 20 إلى 45 دقيقة",
        radiation: "لا يوجد إشعاع",
        prep: "انزع أي معادن قبل الفحص",
        before: [
          "أخبرنا إن كان لديك منظم لضربات القلب أو أي زرعات أو شظايا معدنية.",
          "اترك المجوهرات والساعة والبطاقات البنكية خارج غرفة الفحص.",
          "إذا كنت تشعر بالقلق من الأماكن المغلقة، أخبرنا مسبقاً لنرتب لك.",
        ],
        during: [
          "تستلقي على سرير مريح يتحرك ببطء داخل الجهاز.",
          "ستسمع أصواتاً متكررة، وهذا طبيعي، وسنعطيك سماعات للأذن.",
          "الثبات التام هو سر الصورة الواضحة، ويمكنك التحدث معنا في أي وقت.",
        ],
      },
      en: {
        name: "Magnetic Resonance Imaging",
        tagline: "Detailed soft-tissue images, with zero radiation.",
        description:
          "A magnetic field and radio waves build detailed images of the brain, spine, joints and organs. Our 1.5T system has a wide bore, which makes the scan more comfortable.",
        uses: ["Brain and nerves", "Spine", "Joints and sports injuries", "Abdomen and pelvis"],
        duration: "20 to 45 minutes",
        radiation: "No radiation",
        prep: "Remove all metal",
        before: [
          "Tell us if you have a pacemaker, any implant, or metal fragments.",
          "Leave jewelry, your watch and bank cards outside the scan room.",
          "If closed spaces make you anxious, tell us ahead so we can plan with you.",
        ],
        during: [
          "You lie on a comfortable table that slides slowly into the scanner.",
          "You will hear repeating knocking sounds. That is normal, and we give you ear protection.",
          "Staying still is the secret to a clear image, and you can talk to us at any time.",
        ],
      },
    },
  },
  {
    slug: "ct",
    abbr: "CT",
    tone: "cyan",
    image: ct,
    pictured: "Revolution Maxima",
    copy: {
      ar: {
        name: "الأشعة المقطعية",
        tagline: "صور مقطعية واضحة للجسم في دقائق.",
        description:
          "جهاز 128 شريحة يلتقط صوراً مقطعية متتالية ويجمعها الكمبيوتر في صورة ثلاثية الأبعاد، بجرعة إشعاع أقل. مثالي للصدر والبطن والأوعية الدموية والحالات العاجلة.",
        uses: ["الصدر والرئتان", "البطن والحوض", "الكسور المعقدة", "الأوعية الدموية"],
        duration: "من 5 إلى 15 دقيقة",
        radiation: "جرعة منخفضة ومضبوطة",
        prep: "صيام بضع ساعات إذا كان بالصبغة",
        before: [
          "إذا كان الفحص بالصبغة، قد نطلب منك الصيام لبضع ساعات.",
          "أخبرنا بأي حساسية سابقة من الصبغة أو أي مشكلة في الكلى.",
          "أخبرينا إن كان هناك أي احتمال للحمل.",
        ],
        during: [
          "تستلقي على سرير يمر عبر فتحة دائرية مفتوحة.",
          "قد نطلب منك حبس النفس لثوانٍ قليلة.",
          "إذا استُخدمت الصبغة قد تشعر بدفء خفيف يزول سريعاً.",
        ],
      },
      en: {
        name: "Computed Tomography",
        tagline: "Clear cross-section images of the body, in minutes.",
        description:
          "A 128-slice scanner takes a fast series of X-ray slices and builds them into a 3D view, at a lower dose. Ideal for the chest, abdomen, blood vessels and urgent cases.",
        uses: ["Chest and lungs", "Abdomen and pelvis", "Complex fractures", "Blood vessels"],
        duration: "5 to 15 minutes",
        radiation: "Low, controlled dose",
        prep: "Fast a few hours if contrast is used",
        before: [
          "If your scan uses contrast dye, we may ask you to fast for a few hours.",
          "Tell us about any past reaction to contrast dye or any kidney problem.",
          "Tell us if there is any chance you are pregnant.",
        ],
        during: [
          "You lie on a table that passes through a wide, open ring.",
          "We may ask you to hold your breath for a few seconds.",
          "If contrast is used, you may feel a brief warm feeling that passes quickly.",
        ],
      },
    },
  },
  {
    slug: "xray",
    abbr: "X-RAY",
    tone: "navy",
    image: xray,
    pictured: "Definium Pace Select",
    copy: {
      ar: {
        name: "الأشعة السينية الرقمية",
        tagline: "الخطوة الأولى في التشخيص، سريعة وواضحة.",
        description:
          "أشعة رقمية بجرعة منخفضة تعطي صوراً واضحة للعظام والصدر خلال ثوانٍ، وتظهر الصورة على الشاشة فوراً.",
        uses: ["الكسور والعظام", "الصدر", "المفاصل", "الجيوب الأنفية"],
        duration: "أقل من 10 دقائق",
        radiation: "جرعة منخفضة",
        prep: "لا يحتاج تحضيراً",
        before: [
          "لا يحتاج الفحص أي تحضير خاص.",
          "انزع الإكسسوارات المعدنية من منطقة الفحص.",
          "أخبرينا إن كان هناك أي احتمال للحمل.",
        ],
        during: [
          "تقف أو تستلقي حسب المنطقة المطلوب تصويرها.",
          "نطلب منك الثبات لثانية واحدة أثناء التقاط الصورة.",
          "تنتهي غالباً في دقائق قليلة.",
        ],
      },
      en: {
        name: "Digital X-Ray",
        tagline: "The first step of diagnosis, fast and clear.",
        description:
          "Low-dose digital X-ray gives clear images of bones and the chest in seconds, and the image appears on screen right away.",
        uses: ["Fractures and bones", "Chest", "Joints", "Sinuses"],
        duration: "Under 10 minutes",
        radiation: "Low dose",
        prep: "No preparation needed",
        before: [
          "No special preparation is needed.",
          "Remove metal accessories from the area being imaged.",
          "Tell us if there is any chance you are pregnant.",
        ],
        during: [
          "You stand or lie down, depending on the area.",
          "We ask you to stay still for one second while the image is taken.",
          "It is usually over in a few minutes.",
        ],
      },
    },
  },
  {
    slug: "ultrasound",
    abbr: "SONO",
    tone: "mint",
    image: ultrasound,
    pictured: "LOGIQ E10",
    copy: {
      ar: {
        name: "السونار التخصصي",
        tagline: "صور حية بالموجات الصوتية، بدون أي إشعاع.",
        description:
          "يستخدم موجات صوتية عالية التردد ليرى الأعضاء والأنسجة والأوعية الدموية لحظة بلحظة. مناسب للبطن والغدة الدرقية والثدي، ويشمل الدوبلر لتقييم سريان الدم.",
        uses: ["البطن والكبد والكلى", "الغدة الدرقية والرقبة", "الثدي", "الدوبلر والأوعية الدموية"],
        duration: "من 15 إلى 30 دقيقة",
        radiation: "لا يوجد إشعاع",
        prep: "صيام لسونار البطن فقط",
        before: [
          "لسونار البطن: صيام من 6 إلى 8 ساعات.",
          "لسونار الحوض: اشرب الماء ولا تفرغ المثانة قبل الفحص.",
          "ارتدِ ملابس مريحة يسهل معها كشف منطقة الفحص.",
        ],
        during: [
          "تستلقي على سرير مريح ويوضع جل دافئ على الجلد.",
          "يحرك الطبيب المسبار برفق ويرى الصور على الشاشة مباشرة.",
          "الفحص بدون ألم، وينتهي غالباً في دقائق.",
        ],
      },
      en: {
        name: "Specialized Ultrasound",
        tagline: "Live images with sound waves, and zero radiation.",
        description:
          "High-frequency sound waves show organs, tissue and blood vessels in real time. Suited to the abdomen, thyroid and breast, with Doppler to assess blood flow.",
        uses: ["Abdomen, liver and kidneys", "Thyroid and neck", "Breast", "Doppler and blood vessels"],
        duration: "15 to 30 minutes",
        radiation: "No radiation",
        prep: "Fasting for abdominal scans only",
        before: [
          "For an abdominal scan: fast for 6 to 8 hours.",
          "For a pelvic scan: drink water and keep your bladder full.",
          "Wear comfortable clothes that make the area easy to reach.",
        ],
        during: [
          "You lie on a comfortable table and warm gel goes on the skin.",
          "The doctor moves the probe gently and sees the images live on screen.",
          "It is painless and usually over in minutes.",
        ],
      },
    },
  },
  {
    slug: "mammography",
    abbr: "3D MAMMO",
    tone: "blue",
    image: mammography,
    pictured: "Senographe Pristina 3D",
    copy: {
      ar: {
        name: "تصوير الثدي ثلاثي الأبعاد",
        tagline: "كشف مبكر أوضح، بخطوات هادئة.",
        description:
          "ماموجرام ثلاثي الأبعاد يلتقط الثدي من زوايا متعددة ويعرضه كشرائح رقيقة، فتظهر التفاصيل الصغيرة بوضوح أكبر خاصة في الأنسجة الكثيفة، بجرعة منخفضة.",
        uses: ["الكشف الدوري المبكر", "تقييم الكتل", "المتابعة بعد العلاج", "الحالات العائلية"],
        duration: "نحو 15 دقيقة",
        radiation: "جرعة منخفضة",
        prep: "بدون مزيل عرق يوم الفحص",
        before: [
          "تجنبي مزيل العرق والبودرة والكريمات يوم الفحص.",
          "أفضل وقت للفحص غالباً بعد انتهاء الدورة بأسبوع.",
          "أحضري صور الماموجرام السابقة إن وُجدت للمقارنة.",
        ],
        during: [
          "نضع الثدي على لوح الجهاز ونضغطه برفق لثوانٍ للحصول على صورة أوضح.",
          "قد تشعرين بضغط مؤقت يزول فور التقاط الصورة.",
          "نشرح لكِ كل خطوة، ونحرص على خصوصيتك وراحتك.",
        ],
      },
      en: {
        name: "3D Mammography",
        tagline: "Clearer early detection, one calm step at a time.",
        description:
          "3D mammography (tomosynthesis) images the breast from several angles and shows it as thin slices, so small details stand out, especially in dense tissue, at a low dose.",
        uses: ["Early screening", "Lump assessment", "Follow-up after treatment", "Family history"],
        duration: "About 15 minutes",
        radiation: "Low dose",
        prep: "No deodorant on the day",
        before: [
          "Avoid deodorant, powder and lotion on the day of the exam.",
          "The best time is often about a week after your period ends.",
          "Bring previous mammogram images, if you have them, for comparison.",
        ],
        during: [
          "The breast rests on the plate and is gently pressed for a few seconds for a clearer image.",
          "You may feel brief pressure that ends as soon as the image is taken.",
          "We explain every step, and your privacy and comfort come first.",
        ],
      },
    },
  },
  {
    slug: "dexa",
    abbr: "DEXA",
    tone: "cyan",
    image: dexa,
    pictured: "Lunar DXA",
    copy: {
      ar: {
        name: "قياس كثافة العظام",
        tagline: "قياس دقيق لصحة عظامك، في دقائق.",
        description:
          "يستخدم جرعة منخفضة جداً من الأشعة السينية لقياس كثافة العظام في العمود الفقري والفخذ، للكشف المبكر عن هشاشة العظام ومتابعة العلاج. ويمكنه أيضاً قياس نسب الدهون والعضلات في الجسم.",
        uses: ["الكشف عن هشاشة العظام", "متابعة العلاج", "تقييم خطر الكسور", "تكوين الجسم"],
        duration: "من 10 إلى 20 دقيقة",
        radiation: "جرعة منخفضة جداً",
        prep: "لا مكملات كالسيوم قبلها بيوم",
        before: [
          "توقف عن مكملات الكالسيوم قبل الفحص بـ 24 ساعة.",
          "ارتدِ ملابس مريحة بدون أزرار أو سحّابات معدنية.",
          "أخبرنا إن أجريت فحصاً بالصبغة أو بالباريوم خلال الأيام الأخيرة.",
        ],
        during: [
          "تستلقي على ظهرك على سرير مفتوح بالكامل.",
          "تمر ذراع الجهاز فوقك ببطء دون أن تلمسك.",
          "الفحص هادئ وبدون أي ألم.",
        ],
      },
      en: {
        name: "Bone Densitometry",
        tagline: "A precise reading of your bone health, in minutes.",
        description:
          "A very low dose of X-ray measures bone density in the spine and hip, to catch osteoporosis early and follow up on treatment. It can also measure body fat and muscle.",
        uses: ["Osteoporosis screening", "Treatment follow-up", "Fracture risk", "Body composition"],
        duration: "10 to 20 minutes",
        radiation: "Very low dose",
        prep: "No calcium supplements the day before",
        before: [
          "Stop calcium supplements 24 hours before the scan.",
          "Wear comfortable clothes with no metal buttons or zippers.",
          "Tell us if you had a contrast or barium exam in the last few days.",
        ],
        during: [
          "You lie on your back on a fully open table.",
          "The scanner arm passes slowly above you without touching you.",
          "The exam is quiet and painless.",
        ],
      },
    },
  },
  {
    slug: "pet",
    abbr: "PET/CT",
    tone: "navy",
    image: pet,
    pictured: "Discovery IQ Gen 2",
    copy: {
      ar: {
        name: "التصوير المقطعي البوزيتروني",
        tagline: "يرى نشاط الخلايا، لا شكلها فقط.",
        description:
          "يجمع في فحص واحد بين صور PET التي تُظهر النشاط الحيوي للخلايا وصور CT التشريحية الدقيقة. أداة أساسية في تشخيص الأورام وتحديد مراحلها ومتابعة الاستجابة للعلاج.",
        uses: ["تشخيص الأورام", "تحديد مرحلة المرض", "متابعة الاستجابة للعلاج", "بعض حالات القلب والمخ"],
        duration: "الزيارة نحو ساعتين",
        radiation: "مادة مشعة بجرعة محسوبة",
        prep: "صيام من 4 إلى 6 ساعات",
        before: [
          "صيام من 4 إلى 6 ساعات، ويُسمح بالماء فقط.",
          "تجنب المجهود البدني الشديد قبل الفحص بيوم.",
          "إذا كنت مريض سكر، أخبرنا مسبقاً لنعطيك تعليمات خاصة.",
        ],
        during: [
          "نحقن مادة مشعة بجرعة صغيرة، ثم ترتاح في هدوء نحو ساعة.",
          "الفحص نفسه يستغرق من 20 إلى 30 دقيقة وأنت مستلقٍ.",
          "اشرب الكثير من الماء بعد الفحص لتخرج المادة من جسمك أسرع.",
        ],
      },
      en: {
        name: "PET/CT Imaging",
        tagline: "It sees how cells behave, not only how they look.",
        description:
          "One exam combines PET, which shows the activity of cells, with precise CT anatomy. It is a key tool for diagnosing cancer, staging it, and tracking how treatment is working.",
        uses: ["Cancer diagnosis", "Disease staging", "Treatment response", "Some heart and brain cases"],
        duration: "About 2 hours in total",
        radiation: "Measured tracer dose",
        prep: "Fast for 4 to 6 hours",
        before: [
          "Fast for 4 to 6 hours. Water is allowed.",
          "Avoid hard exercise the day before your scan.",
          "If you have diabetes, tell us ahead so we can give you specific instructions.",
        ],
        during: [
          "We inject a small tracer dose, then you rest quietly for about an hour.",
          "The scan itself takes 20 to 30 minutes while you lie down.",
          "Drink plenty of water afterwards to clear the tracer faster.",
        ],
      },
    },
  },
  {
    slug: "nuclear",
    abbr: "NM",
    tone: "mint",
    image: nuclear,
    pictured: "NM 830",
    copy: {
      ar: {
        name: "الطب النووي",
        tagline: "صور توضح كيف تعمل أعضاؤك، لا شكلها فقط.",
        description:
          "تُعطى جرعة صغيرة من مادة مشعة تتجه إلى العضو المطلوب، ثم تلتقط كاميرا خاصة صوراً توضح وظيفته. يُستخدم لفحص العظام والغدة الدرقية والقلب والكلى.",
        uses: ["مسح العظام", "الغدة الدرقية", "تروية عضلة القلب", "وظائف الكلى"],
        duration: "حسب نوع الفحص",
        radiation: "جرعة صغيرة محسوبة",
        prep: "تعليمات خاصة لكل فحص",
        before: [
          "يختلف التحضير حسب نوع الفحص، وسنرسل لك التعليمات عند الحجز.",
          "أحضر قائمة بأدويتك الحالية.",
          "أخبرينا إن كنتِ حاملاً أو مرضعة.",
        ],
        during: [
          "نعطيك المادة بالحقن أو بالفم حسب الفحص.",
          "قد يكون هناك وقت انتظار قبل التصوير حتى تصل المادة للعضو المطلوب.",
          "تستلقي بهدوء بينما تقترب الكاميرا منك دون أن تسبب أي ألم.",
        ],
      },
      en: {
        name: "Nuclear Medicine",
        tagline: "Images that show how your organs work, not only how they look.",
        description:
          "A small dose of tracer travels to the organ in question, and a special camera captures how it functions. Used for bone scans, the thyroid, the heart and the kidneys.",
        uses: ["Bone scan", "Thyroid", "Heart perfusion", "Kidney function"],
        duration: "Depends on the exam",
        radiation: "Small, measured dose",
        prep: "Specific to each exam",
        before: [
          "Preparation depends on the exam, and we send your instructions when you book.",
          "Bring a list of the medicines you take.",
          "Tell us if you are pregnant or breastfeeding.",
        ],
        during: [
          "You receive the tracer by injection or by mouth, depending on the exam.",
          "There may be a waiting time while the tracer reaches the organ.",
          "You lie still while the camera moves close to you, with no pain.",
        ],
      },
    },
  },
];

export type Machine = Omit<MachineSource, "copy"> & Copy & { index: number };

export const machineSlugs = sources.map((m) => m.slug);

export function getMachines(lang: Locale): Machine[] {
  return sources.map(({ copy, ...rest }, index) => ({ ...rest, ...copy[lang], index }));
}

export function getMachine(lang: Locale, slug: string) {
  return getMachines(lang).find((m) => m.slug === slug);
}
