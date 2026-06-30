import type { Locale } from "./i18n";
import type { Project } from "./projects";
import type { FaqItem, Testimonial } from "./site-config";

/**
 * Content translations. The source data (data/*.json) stays Turkish; these
 * overrides are applied per-locale at read time with a Turkish fallback.
 * AR/KU çevirileri anadili olan biri tarafından gözden geçirilmelidir.
 *
 * Düzenleme: bir projenin açıklamasını TR'de değiştirirsen, buradaki ilgili
 * dildeki karşılığını da güncellemen gerekir (otomatik bağlı değil).
 */

type ProjectContent = {
  shortSummary?: string;
  description?: string;
  longDescription?: string;
  rooms?: string;
  construction?: string[]; // constructionProgress sırasına göre aşama adları
  captions?: string[]; // gallery sırasına göre
};

const PROJECT_CONTENT: Record<string, Partial<Record<Locale, ProjectContent>>> = {
  "sadebal-citylife": {
    en: {
      shortSummary:
        "A mixed-use residential project close to the city centre, with commercial units on the ground floor.",
      description:
        "A residential project close to the city centre, with commercial units on the ground floor. Construction is ongoing.",
      longDescription:
        "Sadebal Citylife is a mixed-use project that brings together floors suited to both residential and commercial use. While the ground and first floors are reserved for commercial units, the upper floors are designed with apartment layouts suited to family living. The project is being built with a modern facade design and durable material choices, aiming for a long-lasting structure.",
      rooms: "2+1, 3+1 + Commercial Units",
      construction: [
        "Structural Construction",
        "Fine Workmanship",
        "Facade Cladding",
        "Landscaping & Surroundings",
      ],
      captions: [
        "Facade — daytime view",
        "Facade — corner perspective",
        "Facade — evening view",
        "Roof and signage detail",
        "Living room — interior design",
        "Bathroom — interior design",
      ],
    },
    ar: {
      shortSummary:
        "مشروع سكني متعدد الاستخدامات قريب من مركز المدينة، مع وحدات تجارية في الطابق الأرضي.",
      description:
        "مشروع سكني قريب من مركز المدينة، مع وحدات تجارية في الطابق الأرضي. العمل في المشروع جارٍ.",
      longDescription:
        "صدبال سيتي لايف مشروع متعدد الاستخدامات يجمع بين طوابق مناسبة للاستخدام السكني والتجاري. فبينما يُخصَّص الطابقان الأرضي والأول للوحدات التجارية، صُمِّمت الطوابق العليا بمخططات شقق ملائمة للحياة العائلية. يُبنى المشروع بتصميم واجهة عصري وخيارات مواد متينة، بهدف الحصول على مبنى طويل العمر.",
      rooms: "2+1, 3+1 + وحدات تجارية",
      construction: [
        "البناء الإنشائي",
        "الأعمال الدقيقة",
        "كسوة الواجهة",
        "التنسيق والمحيط",
      ],
      captions: [
        "الواجهة — منظر نهاري",
        "الواجهة — منظور الزاوية",
        "الواجهة — منظر مسائي",
        "تفاصيل السطح واللافتة",
        "غرفة المعيشة — تصميم داخلي",
        "الحمام — تصميم داخلي",
      ],
    },
    ku: {
      shortSummary:
        "Projeyeke niştecî ya pir-bikaranînê li nêzî navenda bajêr, bi yekîneyên bazirganî li qata jêrîn.",
      description:
        "Projeyeke niştecî li nêzî navenda bajêr, bi yekîneyên bazirganî li qata jêrîn. Avahîsazî didome.",
      longDescription:
        "Sadebal Citylife projeyeke pir-bikaranînê ye ku qatên ji bo bikaranîna niştecî û bazirganî bi hev re tîne. Dema ku qatên jêrîn û yekem ji bo yekîneyên bazirganî têne veqetandin, qatên jorîn bi planên xaniyan ên ji bo jiyana malbatî hatine sêwirandin. Proje bi sêwiraneke rûyê nûjen û hilbijartinên materyalên xurt tê avakirin, bi armanca avahiyeke demdirêj.",
      rooms: "2+1, 3+1 + Yekîneyên Bazirganî",
      construction: [
        "Avahîsaziya Xav",
        "Xebata Hûrgilî",
        "Rûkêşa Rû",
        "Peyzaj & Dorhêl",
      ],
      captions: [
        "Rû — dîmena rojê",
        "Rû — perspektîfa quncikê",
        "Rû — dîmena êvarê",
        "Hûrgiliya banî û tabelayê",
        "Odeya rûniştinê — sêwirana hundir",
        "Serşok — sêwirana hundir",
      ],
    },
  },

  "loca-life": {
    en: {
      shortSummary:
        "A boutique residential project that blends modern architecture with resort comfort, featuring a pool and social amenities.",
      description:
        "Loca Life: Modern Living in Holiday Comfort Awaits You. Loca Life turns the life you dream of into reality, blending modern architecture with the comfort of a holiday resort. Designed for a life away from the city's stress, intertwined with nature and full of enjoyment, this special project unites aesthetics and function under one roof.",
      longDescription:
        "Harmony of Aesthetics and Comfort in Architecture. With its dynamic facade design and modern lines, Loca Life is a candidate to become one of the most prestigious buildings in its region. Its sharp, iconic balcony designs not only add visual elegance but also provide every apartment with a spacious outdoor area.\n\nPanoramic Design: Maximum daylight thanks to large glass surfaces.\nIconic Balconies: Enriched with geometric forms — one of the finest examples of modern architecture.\nLuxurious Social Areas: A holiday atmosphere 365 days a year, with a large pool and the social amenities arranged around it.\nSocial Amenities: A Holiday Town Within Your Home. The spacious pool at the heart of the project, the sunbathing areas and private lounges offer residents a distinguished social life. Palm trees and carefully prepared landscaping crown the modern structure with natural aesthetics.\n\nOutdoor Pool: A wide, modern pool area for enjoyable time.\nPrivate Lounge Areas: Comfortable, stylish seating designed with wooden details.\nGreen Areas and Landscaping: Walking paths intertwined with nature, enriched with palms and ornamental plants.\nWhy Loca Life? Loca Life is not just a residential project but a lifestyle. With quality materials, advanced construction techniques and architectural solutions where every detail is considered, it offers an opportunity not to be missed — both for living and investment.",
      captions: [
        "Facade and balcony design",
        "Pool and social area",
        "Landscaping and walking paths",
        "Facade perspective",
        "Social amenity areas",
        "General site view",
      ],
    },
    ar: {
      shortSummary:
        "مشروع سكني بوتيكي يمزج العمارة الحديثة براحة المنتجعات، مع مسبح ومرافق اجتماعية.",
      description:
        "لوكا لايف: حياة عصرية بِراحة العطلات بانتظارك. يحوّل لوكا لايف الحياة التي تحلم بها إلى واقع، إذ يمزج العمارة الحديثة براحة قرية سياحية. صُمِّم هذا المشروع المميّز لحياة بعيدة عن ضغط المدينة، متداخلة مع الطبيعة ومفعمة بالمتعة، فجمع بين الجمال والوظيفة تحت سقف واحد.",
      longDescription:
        "تناغم الجمال والراحة في العمارة. بتصميم واجهته الديناميكي وخطوطه الحديثة، يُعدّ لوكا لايف مرشحًا ليكون أحد أعرق المباني في منطقته. وتصاميم شرفاته الأيقونية الحادّة لا تضيف أناقة بصرية فحسب، بل توفّر لكل شقة مساحة خارجية رحبة.\n\nتصميم بانورامي: أقصى استفادة من ضوء النهار بفضل الأسطح الزجاجية الواسعة.\nشرفات أيقونية: غنية بالأشكال الهندسية — من أرقى أمثلة العمارة الحديثة.\nمساحات اجتماعية فاخرة: أجواء عطلة على مدار العام بفضل مسبح كبير والمرافق الاجتماعية المحيطة به.\nالمرافق الاجتماعية: بلدة عطلات داخل منزلك. يقدّم المسبح الواسع في قلب المشروع ومناطق الاستلقاء والاستراحات الخاصة حياةً اجتماعية مميّزة للسكان. وتُتوّج أشجار النخيل والتنسيق المعدّ بعناية البنيةَ الحديثة بجمالٍ طبيعي.\n\nمسبح مكشوف: منطقة مسبح واسعة وعصرية لقضاء وقت ممتع.\nمناطق استراحة خاصة: جلسات مريحة وأنيقة بتفاصيل خشبية.\nمساحات خضراء وتنسيق: ممرات مشي متداخلة مع الطبيعة، غنية بالنخيل ونباتات الزينة.\nلماذا لوكا لايف؟ لوكا لايف ليس مجرد مشروع سكني بل أسلوب حياة. فبمواد عالية الجودة وتقنيات بناء متقدمة وحلول معمارية رُوعي فيها كل تفصيل، يقدّم فرصة لا تُفوَّت — للسكن والاستثمار معًا.",
      captions: [
        "تصميم الواجهة والشرفة",
        "المسبح والمنطقة الاجتماعية",
        "التنسيق وممرات المشي",
        "منظور الواجهة",
        "مناطق المرافق الاجتماعية",
        "منظر عام للموقع",
      ],
    },
    ku: {
      shortSummary:
        "Projeyeke niştecî ya butîk ku mîmariya nûjen bi rehetiya tatîlê re tevlihev dike, bi hewz û hêmanên civakî.",
      description:
        "Loca Life: Jiyaneke Nûjen bi Rehetiya Tatîlê li benda te ye. Loca Life jiyana ku tu xewna wê dibînî dike rastî, mîmariya nûjen bi rehetiya gundê tatîlê re tevlihev dike. Ji bo jiyaneke dûrî stresa bajêr, hev re bi xwezayê û tijî kêf, ev projeya taybet estetîk û fonksiyonelîteyê di bin yek banî de dicivîne.",
      longDescription:
        "Aheng a Estetîk û Rehetiyê di Mîmariyê de. Bi sêwirana rûyê dînamîk û xetên nûjen, Loca Life namzed e ku bibe yek ji avahiyên herî prestîjî yên herêma xwe. Sêwiranên balkonan ên îkonîk ne tenê şiklîneke dîtbarî zêde dikin, di heman demê de ji her xaniyek re cîhek derve ya fireh peyda dikin.\n\nSêwirana Panoramîk: Ji ronahiya rojê herî zêde sûd werdigire bi rûyên camî yên fireh.\nBalkonên Îkonîk: Bi formên geometrîk dewlemend — yek ji mînakên herî baş ên mîmariya nûjen.\nQadên Civakî yên Luks: Atmosfera tatîlê 365 roj, bi hewzeke mezin û hêmanên civakî yên li dora wê.\nHêmanên Civakî: Bajarokek Tatîlê di Mala Te de. Hewza fireh a li dilê projeyê, qadên tavhildanê û cihên rûniştinê yên taybet ji niştecîhan re jiyaneke civakî ya bijare pêşkêş dikin. Dareyên xurmê û peyzaja bi baldarî amadekirî avahiya nûjen bi estetîkeke xwezayî dixemilîne.\n\nHewza Vekirî: Qada hewzê ya fireh û nûjen ji bo derbaskirina demeke xweş.\nQadên Rûniştinê yên Taybet: Cihên rûniştinê yên rehet û şîk bi hûrgiliyên dar.\nQada Kesk û Peyzaj: Rêyên meşê yên bi xwezayê re, dewlemend bi xurme û nebatên xemilandinê.\nÇima Loca Life? Loca Life ne tenê projeyeke niştecî ye, şêwazek jiyanê ye. Bi materyalên bi kalîte, teknîkên avahîsaziyê yên pêşketî û çareseriyên mîmarî yên ku her hûrgilî tê de hatiye hizirîn, derfetek ku winda nabe pêşkêş dike — hem ji bo rûniştinê hem ji bo veberhênanê.",
      captions: [
        "Sêwirana rû û balkonê",
        "Hewz û qada civakî",
        "Peyzaj û rêyên meşê",
        "Perspektîfa rû",
        "Qadên hêmanên civakî",
        "Dîmena giştî ya cihê",
      ],
    },
  },

  "zirve-house": {
    en: {
      shortSummary:
        "A building suited to prestigious residential and office use, with minimalist lines and wide glass facades.",
      description:
        "Zirve Houses — Sadebal Yapı: Where Modern Architecture Meets Aesthetics. Bringing the city's dynamism together with modern lines, this is a new-generation building project that combines aesthetic design with high living standards. With its minimalist facade, large glass surfaces and quality material selection, it offers an ideal building for both residential and prestigious office use.",
      longDescription:
        "Prominent Architectural Features. Modern Facade Design: Dominated by grey and anthracite tones, the facade gains a modern identity through horizontal and vertical lines.\nWide Glass Balconies and Facades: Large windows and panoramic glass balconies designed for maximum natural light create a bright, airy interior atmosphere.\nFunctional Entrance and Security: A modern entrance canopy enriched with wooden details and an integrated security point create a safe living space without compromising aesthetics.\nNight Lighting: Elegant lighting fixtures on the surrounding walls and illuminated signage details keep the building prestigious in its night-time appearance too.\nLandscaping and Surroundings: Surrounded by modern wrought-iron railings and tidy green areas, the building offers a peaceful oasis in the city centre.\nWhy Sadebal Yapı? More than just a building, it is a living space where durability, comfort and elegance meet. With raft foundation systems compliant with earthquake regulations, facade cladding providing high thermal and acoustic insulation, and smart architectural solutions, it brings the building standards of the future to today.",
      captions: [
        "Facade — modern lines",
        "Glass balcony details",
        "Facade perspective",
        "Entrance and security point",
        "Night lighting",
        "Landscaping and surroundings",
        "General building view",
        "Facade close-up detail",
        "Site perspective",
      ],
    },
    ar: {
      shortSummary:
        "مبنى مناسب للاستخدام السكني والمكتبي الراقي، بخطوط بسيطة وواجهات زجاجية واسعة.",
      description:
        "زيرفة هاوس — صدبال يapı: حيث تلتقي العمارة الحديثة بالجمال. يجمع هذا المشروع ديناميكية المدينة بخطوط حديثة، وهو مشروع بناء من جيل جديد يمزج التصميم الجمالي بمعايير معيشة عالية. وبواجهته البسيطة وأسطحه الزجاجية الواسعة واختيار المواد عالية الجودة، يقدّم مبنى مثاليًا للاستخدام السكني والمكتبي الراقي.",
      longDescription:
        "أبرز السمات المعمارية. تصميم الواجهة الحديث: تهيمن عليه درجات الرمادي والأنثراسيت، وتكتسب الواجهة هويةً حديثة عبر الخطوط الأفقية والعمودية.\nشرفات وواجهات زجاجية واسعة: نوافذ كبيرة وشرفات زجاجية بانورامية مصمَّمة لأقصى قدر من الضوء الطبيعي تخلق أجواءً داخلية مشرقة ورحبة.\nمدخل وظيفي وأمان: مظلّة مدخل حديثة مزيّنة بتفاصيل خشبية ونقطة أمن متكاملة تخلقان مساحة معيشة آمنة دون التنازل عن الجمال.\nإضاءة ليلية: وحدات إضاءة أنيقة على الجدران المحيطة وتفاصيل لافتة مضيئة تُبقي المبنى راقيًا في مظهره الليلي أيضًا.\nالتنسيق والمحيط: محاطًا بدرابزينات حديدية حديثة ومساحات خضراء منظَّمة، يقدّم المبنى واحةً هادئة في مركز المدينة.\nلماذا صدبال يapı؟ أكثر من مجرد مبنى، إنه مساحة معيشة تلتقي فيها المتانة والراحة والأناقة. بأنظمة أساسات لبشة متوافقة مع لوائح الزلازل، وكسوة واجهات توفّر عزلًا حراريًا وصوتيًا عاليًا، وحلول معمارية ذكية، يجلب معايير بناء المستقبل إلى اليوم.",
      captions: [
        "الواجهة — خطوط حديثة",
        "تفاصيل الشرفة الزجاجية",
        "منظور الواجهة",
        "المدخل ونقطة الأمن",
        "الإضاءة الليلية",
        "التنسيق والمحيط",
        "منظر عام للمبنى",
        "تفصيل قريب للواجهة",
        "منظور الموقع",
      ],
    },
    ku: {
      shortSummary:
        "Avahiyek guncan ji bo bikaranîna niştecî û nivîsgehê ya prestîjî, bi xetên mînîmalîst û rûyên camî yên fireh.",
      description:
        "Zirve House — Sadebal Yapî: Cihê ku Mîmariya Nûjen bi Estetîkê re Dicive. Dînamîzma bajêr bi xetên nûjen re tîne, ev projeyeke avahîsaziyê ya nifşê nû ye ku sêwirana estetîk bi standardên jiyanê yên bilind re tevlihev dike. Bi rûyê mînîmalîst, rûyên camî yên fireh û hilbijartina materyalên bi kalîte, ji bo bikaranîna niştecî û nivîsgehê ya prestîjî avahiyeke îdeal pêşkêş dike.",
      longDescription:
        "Taybetiyên Mîmarî yên Berbiçav. Sêwirana Rûyê Nûjen: Bi tonên gewr û antrasîtê serdest, rû bi xetên berwarî û tîk nasnameyeke nûjen bi dest dixe.\nBalkon û Rûyên Camî yên Fireh: Pencereyên mezin û balkonên camî yên panoramîk ji bo herî zêde ronahiya xwezayî atmosfereke hundir a ronî û fireh çêdikin.\nDergehê Fonksiyonel û Ewlehî: Kanopiyeke dergehê ya nûjen a bi hûrgiliyên dar û xaleke ewlehiyê ya yekgirtî cîhek jiyanê ya ewledar çêdikin bêyî ku ji estetîkê dûr bikevin.\nRonahiya Şevê: Ronahiyên şîk li ser dîwarên dor û hûrgiliyên tabela ronîkirî avahiyê di dîmena şevê de jî prestîjî dihêlin.\nPeyzaj û Dorhêl: Bi parmaqên hesinî yên nûjen û qadên kesk ên rêkûpêk dorpêçkirî, avahî li navenda bajêr wahayeke aram pêşkêş dike.\nÇima Sadebal Yapî? Ji avahiyekê zêdetir, cîhek jiyanê ye ku mukrî, rehetî û şîkahî tê de dicivin. Bi sîstemên bingehê yên radyeyî yên li gor rêziknameya erdhejê, bi rûkêşên ku îzolasyona germahî û dengê ya bilind peyda dikin, û çareseriyên mîmarî yên jîr, standardên avahiyên paşerojê tîne îro.",
      captions: [
        "Rû — xetên nûjen",
        "Hûrgiliyên balkona camî",
        "Perspektîfa rû",
        "Dergeh û xala ewlehiyê",
        "Ronahiya şevê",
        "Peyzaj û dorhêl",
        "Dîmena giştî ya avahiyê",
        "Hûrgiliya nêz a rû",
        "Perspektîfa cihê",
      ],
    },
  },

  "loca-garden": {
    en: {
      shortSummary:
        "A peaceful garden-living project with a horizontal architecture and a boutique concept, intertwined with nature.",
      description:
        "Loca Garden: A Modern Living Experience at the Heart of Nature. Designed for those who want to get away from the city's chaos without giving up its comfort, Loca Garden brings nature and modern architecture into perfect balance. With the wide green areas it is named after and its boutique living concept, Loca Garden promises not just a home but a life full of peace.",
      longDescription:
        "Horizontal Architecture and Aesthetic Design. Loca Garden stands out with a horizontal architectural concept that puts spaciousness at its centre. Its facade, dominated by modern anthracite and white tones, lends the project timeless elegance, while wide balconies and garden-floor options invite nature into your home.\n\nBoutique and Secure Living: A safe community life with a limited number of blocks and apartments, where neighbourly relations come first.\nModern Facade Details: An exterior architecture enriched with wood-look vertical panels and geometric balcony designs.\nMaximum Daylight: A bright atmosphere in every room with floor-to-ceiling windows and airy interior layouts.\nCombine Garden Enjoyment with Social Life. At Loca Garden, life is not limited to your apartment. The social areas at the heart of the project are equipped with special details where you can spend time as a family and unwind at the end of the day.\n\nPrivate Swimming Pool: A stylish pool area at the centre of the site, surrounded by sun terraces.\nLandscaping and Walking Paths: Garden arrangements surrounded by palm trees and colourful plants, where you can feel every shade of nature.\n24/7 Security: Full protection with an aesthetic entrance gate in harmony with the modern architecture and professional security service.\nWhy Loca Garden? With its ever-appreciating location and high-quality construction standards, Loca Garden is the first choice of those seeking \"quality living.\" In this project where aesthetics meets function, every detail is meticulously planned for your comfort and happiness.",
      captions: [
        "Garden and green area",
        "Facade perspective",
        "Horizontal architecture details",
        "Pool and social area",
        "Landscaping arrangement",
        "General site view",
      ],
    },
    ar: {
      shortSummary:
        "مشروع حياة حديقية هادئ بعمارة أفقية ومفهوم بوتيكي، متداخل مع الطبيعة.",
      description:
        "لوكا غاردن: تجربة معيشة حديثة في قلب الطبيعة. صُمِّم لوكا غاردن لمن يريد الابتعاد عن فوضى المدينة دون التخلي عن راحتها، فيجمع الطبيعة والعمارة الحديثة في توازن مثالي. وبمساحاته الخضراء الواسعة التي يحمل اسمها ومفهوم المعيشة البوتيكي، لا يَعِد لوكا غاردن بمنزل فحسب بل بحياة مفعمة بالسكينة.",
      longDescription:
        "عمارة أفقية وتصميم جمالي. يتميّز لوكا غاردن بمفهوم معماري أفقي يضع الرحابة في صميمه. وتمنح واجهته، التي تهيمن عليها درجات الأنثراسيت والأبيض الحديثة، المشروعَ أناقةً خالدة، بينما تدعو الشرفات الواسعة وخيارات الطابق الحديقي الطبيعةَ إلى داخل منزلك.\n\nمعيشة بوتيكية وآمنة: حياة مجتمعية آمنة بعدد محدود من البلوكات والشقق، حيث تأتي علاقات الجوار أولًا.\nتفاصيل واجهة حديثة: عمارة خارجية غنية بألواح عمودية بمظهر خشبي وتصاميم شرفات هندسية.\nأقصى ضوء نهار: أجواء مشرقة في كل غرفة بنوافذ ممتدة من الأرض إلى السقف ومخططات داخلية رحبة.\nاجمع متعة الحديقة بالحياة الاجتماعية. في لوكا غاردن، لا تقتصر الحياة على شقتك. فالمناطق الاجتماعية في قلب المشروع مجهَّزة بتفاصيل خاصة لتقضي الوقت مع العائلة وتزيل تعب اليوم.\n\nمسبح خاص: منطقة مسبح أنيقة في مركز الموقع، محاطة بتراسات شمسية.\nتنسيق وممرات مشي: ترتيبات حديقية محاطة بأشجار النخيل والنباتات الملوّنة، حيث تشعر بكل ظلال الطبيعة.\nأمن على مدار الساعة: حماية كاملة ببوابة دخول جمالية منسجمة مع العمارة الحديثة وخدمة أمن احترافية.\nلماذا لوكا غاردن؟ بموقعه المتزايد القيمة ومعايير بنائه عالية الجودة، يُعدّ لوكا غاردن الخيار الأول لمن يبحث عن \"المعيشة النوعية\". في هذا المشروع حيث يلتقي الجمال بالوظيفة، خُطِّط لكل تفصيل بعناية من أجل راحتك وسعادتك.",
      captions: [
        "الحديقة والمنطقة الخضراء",
        "منظور الواجهة",
        "تفاصيل العمارة الأفقية",
        "المسبح والمنطقة الاجتماعية",
        "ترتيب التنسيق",
        "منظر عام للموقع",
      ],
    },
    ku: {
      shortSummary:
        "Projeyeke jiyana baxçeyê ya aram bi mîmariyeke berwarî û konsepteke butîk, hev re bi xwezayê.",
      description:
        "Loca Garden: Ezmûneke Jiyana Nûjen li Dilê Xwezayê. Ji bo kesên ku dixwazin ji aloziya bajêr dûr bikevin lê dest ji rehetiya wê bernedin hatiye sêwirandin, Loca Garden xweza û mîmariya nûjen di hevsengiyeke bêkêmasî de tîne. Bi qadên kesk ên fireh ên ku navê wê jê tê û konsepta jiyana butîk, Loca Garden ne tenê malekê, jiyaneke tijî aramî soz dide.",
      longDescription:
        "Mîmariya Berwarî û Sêwirana Estetîk. Loca Garden bi konsepteke mîmarî ya berwarî ya ku firehiyê dixe navenda xwe derdikeve pêş. Rûyê wê, ku bi tonên antrasît û spî yên nûjen serdest e, ji projeyê re şîkahiyeke bêdem dide, dema ku balkonên fireh û vebijarkên qata baxçeyê xwezayê vedixwînin nav mala te.\n\nJiyaneke Butîk û Ewledar: Jiyaneke civakî ya ewledar bi hejmareke sînorkirî ya blok û xaniyan, ku tê de têkiliyên cîranan di rêza pêşîn de ne.\nHûrgiliyên Rûyê Nûjen: Mîmariyeke derve ya dewlemend bi panelên tîk ên bi xuyangê dar û sêwiranên balkonan ên geometrîk.\nRonahiya Rojê ya Herî Zêde: Atmosfereke ronî di her odeyê de bi pencereyên ji erdê heta banî û planên hundir ên fireh.\nKêfa Baxçe bi Jiyana Civakî re bicive. Li Loca Garden, jiyan bi xaniyê te sînordar nabe. Qadên civakî yên li dilê projeyê bi hûrgiliyên taybet hatine amade kirin ku tu dikarî bi malbatê re dem derbas bikî û westiyana rojê ji ser xwe bavêjî.\n\nHewza Avjeniyê ya Taybet: Qada hewzê ya şîk li navenda cihê, bi teraseyên tavê dorpêçkirî.\nPeyzaj û Rêyên Meşê: Sazkirinên baxçeyê yên bi dareyên xurme û nebatên rengîn dorpêçkirî, ku tu dikarî her rengê xwezayê hîs bikî.\nEwlehiya 24/7: Parastineke tam bi dergehê ketinê yê estetîk ê hevaheng bi mîmariya nûjen û xizmeta ewlehiyê ya pîşeyî.\nÇima Loca Garden? Bi cihê xwe yê ku nirxê wê roj bi roj zêde dibe û standardên avahîsaziyê yên bi kalîte, Loca Garden hilbijartina yekem a kesên ku li \"jiyana bi kalîte\" digerin e. Di vê projeyê de ku estetîk bi fonksiyonê re dicive, her hûrgilî bi baldarî ji bo rehetî û bextewariya te hatiye plansazkirin.",
      captions: [
        "Baxçe û qada kesk",
        "Perspektîfa rû",
        "Hûrgiliyên mîmariya berwarî",
        "Hewz û qada civakî",
        "Sazkirina peyzajê",
        "Dîmena giştî ya cihê",
      ],
    },
  },
};

export function localizeProject(p: Project, locale: Locale): Project {
  if (locale === "tr") return p;
  const c = PROJECT_CONTENT[p.slug]?.[locale];
  if (!c) return p;
  return {
    ...p,
    shortSummary: c.shortSummary ?? p.shortSummary,
    description: c.description ?? p.description,
    longDescription: c.longDescription ?? p.longDescription,
    rooms: c.rooms ?? p.rooms,
    constructionProgress:
      c.construction && p.constructionProgress
        ? p.constructionProgress.map((s, i) => ({ ...s, stage: c.construction![i] ?? s.stage }))
        : p.constructionProgress,
    gallery:
      c.captions && p.gallery
        ? p.gallery.map((g, i) => ({ ...g, caption: c.captions![i] ?? g.caption }))
        : p.gallery,
  };
}

// --- Founder title (data/site.json) ---
const FOUNDER_TITLE: Partial<Record<Locale, Record<string, string>>> = {
  en: { "Şirket Kurucusu": "Company Founder" },
  ar: { "Şirket Kurucusu": "مؤسّس الشركة" },
  ku: { "Şirket Kurucusu": "Damezrênerê Pargîdaniyê" },
};

export function localizeFounderTitle(title: string, locale: Locale): string {
  if (locale === "tr") return title;
  return FOUNDER_TITLE[locale]?.[title] ?? title;
}

export function localizeProjects(list: Project[], locale: Locale): Project[] {
  return locale === "tr" ? list : list.map((p) => localizeProject(p, locale));
}

// --- FAQ (data/site.json sırasına göre) ---
const FAQ_CONTENT: Partial<Record<Locale, FaqItem[]>> = {
  en: [
    {
      question: "Do your projects pass earthquake-resistance tests?",
      answer:
        "All our projects are designed in accordance with the current earthquake regulation (TBDY 2018) and go through the required structural calculations, soil surveys and inspection processes. With raft foundation systems and high-strength material choices, we build long-lasting, safe structures.",
    },
    {
      question: "What classes of concrete and steel do you use?",
      answer:
        "As a standard, we use C30/C35 class ready-mixed concrete and B500C ribbed reinforcing steel. Material classes are determined according to each project's structural requirements and the relevant regulations.",
    },
    {
      question: "How do payment plans work?",
      answer:
        "We offer cash payment, bank loan and project-specific instalment options. For ongoing projects, flexible payment plans spread over the construction stages can be arranged. Please contact us for details.",
    },
    {
      question: "How long are delivery times on average?",
      answer:
        "Delivery time varies with the scale of the project, but it averages 18–30 months for our residential projects. Staying true to the delivery date stated in the contract is one of our core priorities.",
    },
    {
      question: "Can I follow the progress during the project?",
      answer:
        "Yes. For our ongoing projects, we publish stage-based progress status on the project detail page of our website. We also regularly share updates and visuals from the site.",
    },
  ],
  ar: [
    {
      question: "هل تجتاز مشاريعكم اختبارات مقاومة الزلازل؟",
      answer:
        "تُصمَّم جميع مشاريعنا وفقًا للائحة الزلازل الحالية (TBDY 2018) وتمرّ بالحسابات الإنشائية ودراسات التربة وعمليات التفتيش اللازمة. وبأنظمة الأساسات اللبشة وخيارات المواد عالية المتانة، نبني مبانيَ آمنة وطويلة العمر.",
    },
    {
      question: "ما فئات الخرسانة والحديد التي تستخدمونها؟",
      answer:
        "نستخدم كمعيار خرسانة جاهزة من فئة C30/C35 وحديد تسليح مضلّع B500C. وتُحدَّد فئات المواد وفق المتطلبات الإنشائية لكل مشروع واللوائح ذات الصلة.",
    },
    {
      question: "كيف تعمل خطط الدفع؟",
      answer:
        "نوفّر خيارات الدفع النقدي والقرض البنكي والتقسيط الخاص بكل مشروع. وفي المشاريع الجارية يمكن ترتيب خطط دفع مرنة موزّعة على مراحل البناء. يُرجى التواصل معنا للتفاصيل.",
    },
    {
      question: "كم تبلغ مدة التسليم في المتوسط؟",
      answer:
        "تتفاوت مدة التسليم بحسب حجم المشروع، لكنها تتراوح في المتوسط بين 18 و30 شهرًا لمشاريعنا السكنية. والالتزام بتاريخ التسليم المنصوص عليه في العقد من أهم أولوياتنا.",
    },
    {
      question: "هل يمكنني متابعة التقدّم أثناء المشروع؟",
      answer:
        "نعم. في مشاريعنا الجارية ننشر حالة التقدّم وفق المراحل على صفحة تفاصيل المشروع في موقعنا. كما نشارك بانتظام تحديثات وصورًا من الموقع.",
    },
  ],
  ku: [
    {
      question: "Ma projeyên we ji testên berxwedana erdhejê derbas dibin?",
      answer:
        "Hemû projeyên me li gor rêziknameya erdhejê ya niha (TBDY 2018) têne sêwirandin û ji hesabên avahiyê, lêkolînên axê û pêvajoyên çavdêriyê yên pêwîst derbas dibin. Bi sîstemên bingehê yên radyeyî û hilbijartinên materyalên bi hêza bilind, em avahiyên ewledar û demdirêj ava dikin.",
    },
    {
      question: "Hûn kîjan çînên beton û hesinî bikar tînin?",
      answer:
        "Wek standard, em betona amade ya çîna C30/C35 û hesinê avahîsaziyê yê nervî B500C bikar tînin. Çînên materyalan li gor pêdiviyên avahiyê yên her projeyê û rêziknameyên têkildar têne diyarkirin.",
    },
    {
      question: "Planên dayînê çawa dixebitin?",
      answer:
        "Em vebijarkên dayîna pêşîn, krediya bankê û taksîtên taybet ên projeyê pêşkêş dikin. Di projeyên domdar de, planên dayînê yên nerm ên li ser qonaxên avahîsaziyê belavbûyî dikarin werin amadekirin. Ji bo hûrgiliyan ji kerema xwe bi me re têkilî daynin.",
    },
    {
      question: "Demên radestkirinê bi navînî çiqas dimînin?",
      answer:
        "Dema radestkirinê li gor mezinahiya projeyê diguhere, lê ji bo projeyên me yên niştecî bi navînî di navbera 18–30 mehan de ye. Sadiqmayîna li dîroka radestkirinê ya di peymanê de ji pêşîniyên me yên bingehîn e.",
    },
    {
      question: "Ma ez dikarim di pêvajoya projeyê de pêşveçûnê bişopînim?",
      answer:
        "Belê. Ji bo projeyên me yên domdar, em rewşa pêşveçûnê ya li ser qonaxan li ser rûpela hûrgiliyên projeyê ya malpera me diweşînin. Em her wiha bi rêkûpêk nûçe û dîmenan ji şantiyeyê parve dikin.",
    },
  ],
};

export function localizeFaq(faq: FaqItem[] | undefined, locale: Locale): FaqItem[] {
  if (!faq) return [];
  if (locale === "tr") return faq;
  const tr = FAQ_CONTENT[locale];
  return faq.map((f, i) => tr?.[i] ?? f);
}

// --- Testimonials (data/site.json sırasına göre) ---
const TESTIMONIAL_CONTENT: Partial<Record<Locale, { name?: string; role?: string; quote: string }[]>> = {
  en: [
    {
      name: "Loca Life Resident",
      role: "Homeowner",
      quote:
        "They stayed true to the promised schedule and kept us informed at every stage of delivery. The workmanship quality exceeded our expectations.",
    },
    {
      name: "Commercial Unit Owner",
      role: "Investor",
      quote:
        "Working with Sadebal Yapı was reassuring. Thanks to a transparent process and clear communication, I made my investment with peace of mind.",
    },
    {
      name: "Zirve House Resident",
      role: "Homeowner",
      quote:
        "The attention given to detail is felt in every corner. The material quality and architectural aesthetics truly make a difference.",
    },
  ],
  ar: [
    {
      name: "أحد سكان لوكا لايف",
      role: "مالك سكن",
      quote:
        "التزموا بالجدول الموعود وأبقَونا على اطّلاع في كل مرحلة من مراحل التسليم. وجودة العمل فاقت توقعاتنا.",
    },
    {
      name: "مالك وحدة تجارية",
      role: "مستثمر",
      quote:
        "كان العمل مع صدبال يapı مطمئنًا. وبفضل العملية الشفافة والتواصل الواضح، أنجزت استثماري براحة بال.",
    },
    {
      name: "أحد سكان زيرفة هاوس",
      role: "مالك سكن",
      quote:
        "الاهتمام بالتفاصيل محسوس في كل ركن. وجودة المواد والجماليات المعمارية تُحدث فرقًا حقيقيًا.",
    },
  ],
  ku: [
    {
      name: "Niştecîhek Loca Life",
      role: "Xwediyê Malê",
      quote:
        "Ew sadiqî bernameya sozdayî man û di her qonaxa radestkirinê de me agahdar kirin. Kalîteya kar ji hêviyên me zêdetir bû.",
    },
    {
      name: "Xwediyê Yekîneya Bazirganî",
      role: "Veberhêner",
      quote:
        "Xebata bi Sadebal Yapî re aram bû. Bi saya pêvajoyeke şefaf û têkiliyeke zelal, min veberhênana xwe bi dilrehetî kir.",
    },
    {
      name: "Niştecîhek Zirve House",
      role: "Xwediyê Malê",
      quote:
        "Baldariya ji bo hûrgiliyan li her quncikê tê hîskirin. Kalîteya materyalan û estetîka mîmarî bi rastî ferqê çêdike.",
    },
  ],
};

export function localizeTestimonials(
  items: Testimonial[] | undefined,
  locale: Locale
): Testimonial[] {
  if (!items) return [];
  if (locale === "tr") return items;
  const tr = TESTIMONIAL_CONTENT[locale];
  return items.map((it, i) => {
    const o = tr?.[i];
    return o ? { ...it, name: o.name ?? it.name, role: o.role ?? it.role, quote: o.quote } : it;
  });
}
