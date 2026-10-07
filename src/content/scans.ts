import type { Locale } from "@/lib/i18n";

/**
 * The scans patients book, grouped by imaging department. The departments and the
 * clinical uses follow barakatmc.com (neuro and spine MRI, CT angiography and cardiac CT,
 * oncology staging on PET/CT, SPECT cardiology and bone scans, vascular and liver
 * ultrasound with elastography, Voluson pregnancy scans, DXA with FRAX).
 * Each group's slug matches a machine in machines.ts, which supplies the prep notes.
 */

/** Practical flags shown as small tags on a scan card. */
export type ScanFlag = "contrast" | "fasting" | "bladder";

type TypeCopy = { name: string; use: string; duration: string };

type ScanTypeSource = {
  id: string;
  flags?: ScanFlag[];
  copy: Record<Locale, TypeCopy>;
};

type GroupCopy = { name: string; summary: string };

type ScanGroupSource = {
  slug: string;
  abbr: string;
  /** The technical label barakatmc.com gives each service (1.5T, 128-SLC, DR ...). */
  spec: string;
  tone: "blue" | "cyan" | "mint" | "navy";
  copy: Record<Locale, GroupCopy>;
  types: ScanTypeSource[];
};

const groups: ScanGroupSource[] = [
  {
    slug: "mri",
    abbr: "MRI",
    spec: "1.5T",
    tone: "blue",
    copy: {
      ar: { name: "الرنين المغناطيسي", summary: "رنين الأنسجة العميقة للمخ والأعصاب والعمود الفقري، بدون أي إشعاع." },
      en: { name: "MRI", summary: "Deep soft-tissue imaging of the brain, nerves and spine, with zero radiation." },
    },
    types: [
      {
        id: "brain",
        flags: ["contrast"],
        copy: {
          ar: { name: "رنين على المخ والأعصاب", use: "الصداع المزمن والدوخة والجلطات والتصلب المتعدد.", duration: "20 - 30 دقيقة" },
          en: { name: "Brain and nerves MRI", use: "Chronic headache, dizziness, stroke and multiple sclerosis.", duration: "20 - 30 min" },
        },
      },
      {
        id: "spine",
        copy: {
          ar: { name: "رنين على العمود الفقري", use: "الانزلاق الغضروفي وآلام الرقبة والظهر: عنقي، صدري، قطني.", duration: "20 - 30 دقيقة لكل جزء" },
          en: { name: "Spine MRI", use: "Disc herniation and neck or back pain: cervical, thoracic, lumbar.", duration: "20 - 30 min per region" },
        },
      },
      {
        id: "joints",
        copy: {
          ar: { name: "رنين على المفاصل", use: "الركبة والكتف والحوض: الأربطة والغضاريف والإصابات الرياضية.", duration: "20 - 30 دقيقة" },
          en: { name: "Joint MRI", use: "Knee, shoulder and hip: ligaments, cartilage and sports injuries.", duration: "20 - 30 min" },
        },
      },
      {
        id: "abdomen",
        flags: ["fasting", "contrast"],
        copy: {
          ar: { name: "رنين على البطن والحوض", use: "الكبد والبنكرياس والكلى والرحم والبروستاتا.", duration: "30 - 45 دقيقة" },
          en: { name: "Abdomen and pelvis MRI", use: "Liver, pancreas, kidneys, uterus and prostate.", duration: "30 - 45 min" },
        },
      },
      {
        id: "mra",
        copy: {
          ar: { name: "رنين على الأوعية الدموية MRA", use: "شرايين المخ والرقبة بوضوح، بدون إشعاع.", duration: "25 - 35 دقيقة" },
          en: { name: "MR angiography (MRA)", use: "Clear views of brain and neck arteries, without radiation.", duration: "25 - 35 min" },
        },
      },
      {
        id: "breast",
        flags: ["contrast"],
        copy: {
          ar: { name: "رنين على الثدي", use: "تقييم الحالات المعقدة والمتابعة بعد العلاج.", duration: "30 - 40 دقيقة" },
          en: { name: "Breast MRI", use: "Complex cases and follow-up after treatment.", duration: "30 - 40 min" },
        },
      },
    ],
  },
  {
    slug: "ct",
    abbr: "CT",
    spec: "128-SLC",
    tone: "cyan",
    copy: {
      ar: { name: "الأشعة المقطعية", summary: "تصوير فائق السرعة للأوعية والقلب والحالات العاجلة، بجرعة أقل حتى 82%." },
      en: { name: "CT scan", summary: "Ultra-fast imaging of vessels, the heart and urgent cases, at up to 82% less dose." },
    },
    types: [
      {
        id: "head",
        copy: {
          ar: { name: "مقطعية على المخ", use: "الإصابات والنزيف والحالات العاجلة.", duration: "5 دقائق" },
          en: { name: "Head CT", use: "Injuries, bleeding and urgent cases.", duration: "5 min" },
        },
      },
      {
        id: "chest",
        copy: {
          ar: { name: "مقطعية على الصدر", use: "الرئتان والصدر، ومنها المقطعية منخفضة الجرعة.", duration: "5 - 10 دقائق" },
          en: { name: "Chest CT", use: "Lungs and chest, including low-dose CT.", duration: "5 - 10 min" },
        },
      },
      {
        id: "abdomen",
        flags: ["fasting", "contrast"],
        copy: {
          ar: { name: "مقطعية على البطن والحوض", use: "آلام البطن والحصوات والأعضاء الداخلية.", duration: "10 - 15 دقيقة" },
          en: { name: "Abdomen and pelvis CT", use: "Abdominal pain, stones and internal organs.", duration: "10 - 15 min" },
        },
      },
      {
        id: "cta",
        flags: ["fasting", "contrast"],
        copy: {
          ar: { name: "تصوير الأوعية بالمقطعية CTA", use: "شرايين المخ والرقبة والأطراف والشريان الأورطي.", duration: "10 - 15 دقيقة" },
          en: { name: "CT angiography (CTA)", use: "Arteries of the brain, neck, limbs and the aorta.", duration: "10 - 15 min" },
        },
      },
      {
        id: "cardiac",
        flags: ["fasting", "contrast"],
        copy: {
          ar: { name: "مقطعية القلب والشرايين التاجية", use: "الشرايين التاجية وقياس نسبة الكالسيوم.", duration: "15 - 20 دقيقة" },
          en: { name: "Cardiac and coronary CT", use: "Coronary arteries and calcium score.", duration: "15 - 20 min" },
        },
      },
      {
        id: "bones",
        copy: {
          ar: { name: "مقطعية على العظام", use: "الكسور المعقدة والمفاصل قبل العمليات.", duration: "5 - 10 دقائق" },
          en: { name: "Bone CT", use: "Complex fractures and joints before surgery.", duration: "5 - 10 min" },
        },
      },
    ],
  },
  {
    slug: "xray",
    abbr: "X-RAY",
    spec: "DR",
    tone: "navy",
    copy: {
      ar: { name: "الأشعة الرقمية", summary: "أشعة رقمية بمستشعر FlashPad HD ونظام Helix™ 2.0 للعظام والإصابات." },
      en: { name: "Digital X-ray", summary: "Digital X-ray with a FlashPad HD detector and Helix™ 2.0 for bones and injuries." },
    },
    types: [
      {
        id: "chest",
        copy: {
          ar: { name: "أشعة على الصدر", use: "الرئتان والقلب، وفحوصات ما قبل العمل والسفر.", duration: "5 دقائق" },
          en: { name: "Chest X-ray", use: "Lungs and heart, plus work and travel checks.", duration: "5 min" },
        },
      },
      {
        id: "bones",
        copy: {
          ar: { name: "أشعة على العظام والمفاصل", use: "الكسور والإصابات وخشونة المفاصل.", duration: "5 - 10 دقائق" },
          en: { name: "Bones and joints X-ray", use: "Fractures, injuries and joint wear.", duration: "5 - 10 min" },
        },
      },
      {
        id: "spine",
        copy: {
          ar: { name: "أشعة على العمود الفقري", use: "استقامة الفقرات وآلام الرقبة والظهر.", duration: "5 - 10 دقائق" },
          en: { name: "Spine X-ray", use: "Spine alignment and neck or back pain.", duration: "5 - 10 min" },
        },
      },
      {
        id: "abdomen",
        copy: {
          ar: { name: "أشعة على البطن", use: "الحصوات وانسداد الأمعاء.", duration: "5 دقائق" },
          en: { name: "Abdominal X-ray", use: "Stones and bowel obstruction.", duration: "5 min" },
        },
      },
    ],
  },
  {
    slug: "ultrasound",
    abbr: "SONO",
    spec: "cSound",
    tone: "mint",
    copy: {
      ar: { name: "السونار التخصصي", summary: "سونار LOGIQ E10 و Voluson للأوعية والكبد وصحة المرأة، بدون إشعاع." },
      en: { name: "Specialized ultrasound", summary: "LOGIQ E10 and Voluson for vessels, the liver and women's health, with zero radiation." },
    },
    types: [
      {
        id: "abdomen",
        flags: ["fasting", "bladder"],
        copy: {
          ar: { name: "سونار على البطن والحوض", use: "الكبد والمرارة والكلى والمثانة.", duration: "15 - 20 دقيقة" },
          en: { name: "Abdomen and pelvis ultrasound", use: "Liver, gallbladder, kidneys and bladder.", duration: "15 - 20 min" },
        },
      },
      {
        id: "doppler",
        copy: {
          ar: { name: "دوبلر على الأوعية الدموية", use: "شرايين الرقبة والأطراف، والدوالي والجلطات.", duration: "20 - 30 دقيقة" },
          en: { name: "Vascular Doppler", use: "Neck and limb arteries, varicose veins and clots.", duration: "20 - 30 min" },
        },
      },
      {
        id: "elastography",
        flags: ["fasting"],
        copy: {
          ar: { name: "قياس مرونة الكبد", use: "قياس تليف ودهون الكبد بدون إبر (Elastography).", duration: "15 دقيقة" },
          en: { name: "Liver elastography", use: "Measures liver fibrosis and fat, with no needles.", duration: "15 min" },
        },
      },
      {
        id: "thyroid",
        copy: {
          ar: { name: "سونار الغدة الدرقية والرقبة", use: "العقد الدرقية والغدد الليمفاوية.", duration: "15 دقيقة" },
          en: { name: "Thyroid and neck ultrasound", use: "Thyroid nodules and lymph nodes.", duration: "15 min" },
        },
      },
      {
        id: "breast",
        copy: {
          ar: { name: "سونار على الثدي", use: "تقييم الكتل، ومكمل للماموجرام.", duration: "15 - 20 دقيقة" },
          en: { name: "Breast ultrasound", use: "Lump assessment, alongside mammography.", duration: "15 - 20 min" },
        },
      },
      {
        id: "pregnancy",
        copy: {
          ar: { name: "سونار الحمل ومتابعة الجنين", use: "متابعة نمو الجنين، ومنه السونار رباعي الأبعاد.", duration: "20 - 30 دقيقة" },
          en: { name: "Pregnancy and fetal scan", use: "Baby growth checks, including 4D scans.", duration: "20 - 30 min" },
        },
      },
    ],
  },
  {
    slug: "mammography",
    abbr: "3D MAMMO",
    spec: "3D DBT",
    tone: "blue",
    copy: {
      ar: { name: "تصوير الثدي ثلاثي الأبعاد", summary: "Senographe Pristina بضغط تتحكم فيه المريضة، وجرعة منخفضة." },
      en: { name: "3D mammography", summary: "Senographe Pristina, with compression the patient controls, at a low dose." },
    },
    types: [
      {
        id: "screening",
        copy: {
          ar: { name: "ماموجرام ثلاثي الأبعاد للكشف الدوري", use: "الكشف المبكر الدوري، خاصة بعد سن الأربعين.", duration: "15 دقيقة" },
          en: { name: "3D screening mammogram", use: "Regular early screening, especially after 40.", duration: "15 min" },
        },
      },
      {
        id: "diagnostic",
        copy: {
          ar: { name: "ماموجرام تشخيصي", use: "عند وجود كتلة أو ألم أو إفرازات، أو للمتابعة.", duration: "20 - 30 دقيقة" },
          en: { name: "Diagnostic mammogram", use: "For a lump, pain or discharge, or for follow-up.", duration: "20 - 30 min" },
        },
      },
    ],
  },
  {
    slug: "dexa",
    abbr: "DEXA",
    spec: "FRAX",
    tone: "cyan",
    copy: {
      ar: { name: "قياس كثافة العظام", summary: "Prodigy Pro لقياس العمود الفقري والفخذ وتقدير خطر الكسور في أقل من 5 دقائق." },
      en: { name: "Bone density (DEXA)", summary: "Prodigy Pro measures the spine and hip and estimates fracture risk in under 5 minutes." },
    },
    types: [
      {
        id: "density",
        copy: {
          ar: { name: "كثافة العظام: العمود الفقري والفخذ", use: "تشخيص هشاشة العظام وتقدير خطر الكسور بمؤشر FRAX.", duration: "10 - 15 دقيقة" },
          en: { name: "Bone density: spine and hip", use: "Osteoporosis diagnosis and FRAX fracture risk.", duration: "10 - 15 min" },
        },
      },
      {
        id: "body",
        copy: {
          ar: { name: "تحليل تكوين الجسم", use: "نسب الدهون والعضلات والعظام بدقة.", duration: "10 - 15 دقيقة" },
          en: { name: "Body composition", use: "Precise fat, muscle and bone percentages.", duration: "10 - 15 min" },
        },
      },
    ],
  },
  {
    slug: "pet",
    abbr: "PET/CT",
    spec: "4-RING",
    tone: "navy",
    copy: {
      ar: { name: "التصوير المقطعي البوزيتروني", summary: "Discovery IQ يقيس آفات بحجم 2 - 3 مم، بمادة مشعة أقل حتى 50%." },
      en: { name: "PET/CT", summary: "Discovery IQ measures lesions as small as 2 - 3 mm, with up to 50% less tracer." },
    },
    types: [
      {
        id: "staging",
        flags: ["fasting"],
        copy: {
          ar: { name: "تحديد مرحلة الأورام", use: "معرفة مدى انتشار المرض قبل بدء العلاج.", duration: "نحو ساعتين" },
          en: { name: "Cancer staging", use: "Shows how far the disease has spread before treatment.", duration: "About 2 hours" },
        },
      },
      {
        id: "response",
        flags: ["fasting"],
        copy: {
          ar: { name: "متابعة الاستجابة للعلاج", use: "تقييم أثر العلاج الكيميائي أو الإشعاعي.", duration: "نحو ساعتين" },
          en: { name: "Treatment response", use: "Shows how chemotherapy or radiotherapy is working.", duration: "About 2 hours" },
        },
      },
    ],
  },
  {
    slug: "nuclear",
    abbr: "NM",
    spec: "SPECT",
    tone: "mint",
    copy: {
      ar: { name: "الطب النووي", summary: "كاميرا NM 830 مزدوجة الرأس لفحوصات القلب والعظام، أسرع بنسبة 25%." },
      en: { name: "Nuclear medicine", summary: "A dual-head NM 830 camera for heart and bone studies, 25% faster." },
    },
    types: [
      {
        id: "bone",
        copy: {
          ar: { name: "مسح ذري على العظام", use: "انتشار الأورام في العظام والكسور الخفية والالتهابات.", duration: "3 - 4 ساعات" },
          en: { name: "Bone scan", use: "Bone spread of tumors, hidden fractures and infection.", duration: "3 - 4 hours" },
        },
      },
      {
        id: "cardiac",
        flags: ["fasting"],
        copy: {
          ar: { name: "مسح ذري على القلب", use: "تروية عضلة القلب في الراحة والمجهود.", duration: "3 - 4 ساعات" },
          en: { name: "Heart perfusion scan", use: "Heart muscle blood flow at rest and under stress.", duration: "3 - 4 hours" },
        },
      },
      {
        id: "thyroid",
        copy: {
          ar: { name: "مسح ذري على الغدة الدرقية", use: "نشاط الغدة والعقد الساخنة والباردة.", duration: "30 - 45 دقيقة" },
          en: { name: "Thyroid scan", use: "Gland activity and hot or cold nodules.", duration: "30 - 45 min" },
        },
      },
      {
        id: "renal",
        copy: {
          ar: { name: "مسح ذري على الكلى", use: "وظيفة كل كلية على حدة وتصريف البول.", duration: "45 - 60 دقيقة" },
          en: { name: "Kidney scan", use: "How each kidney works and drains.", duration: "45 - 60 min" },
        },
      },
    ],
  },
];

export type ScanType = { id: string; flags: ScanFlag[] } & TypeCopy;
export type ScanGroup = Omit<ScanGroupSource, "copy" | "types"> & GroupCopy & { types: ScanType[] };

export function getScanGroups(lang: Locale): ScanGroup[] {
  return groups.map(({ copy, types, ...rest }) => ({
    ...rest,
    ...copy[lang],
    types: types.map(({ id, flags = [], copy: c }) => ({ id, flags, ...c[lang] })),
  }));
}

export const scanCount = groups.reduce((n, g) => n + g.types.length, 0);
