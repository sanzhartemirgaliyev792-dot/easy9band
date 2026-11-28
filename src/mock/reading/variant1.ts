import type { Option, ReadingVariant } from './types';

const TFNG: Option[] = ['TRUE', 'FALSE', 'NOT GIVEN'].map((v) => ({ value: v, label: v }));
const YNNG: Option[] = ['YES', 'NO', 'NOT GIVEN'].map((v) => ({ value: v, label: v }));
const letters = (from: string, to: string): Option[] => {
  const out: Option[] = [];
  for (let c = from.charCodeAt(0); c <= to.charCodeAt(0); c++) {
    const l = String.fromCharCode(c);
    out.push({ value: l, label: l });
  }
  return out;
};
const abcd = (a: string, b: string, c: string, d: string): Option[] => [
  { value: 'A', label: a },
  { value: 'B', label: b },
  { value: 'C', label: c },
  { value: 'D', label: d },
];

export const VARIANT_1: ReadingVariant = {
  id: 'v1',
  title: 'Academic Reading — Variant 1',
  durationMinutes: 60,
  parts: [
    /* ===================== PART 1 ===================== */
    {
      passage: {
        title: 'The History of Woodlands in Britain',
        paragraphs: [
          {
            text: `The climate in Britain has been arctic for the last several million years, punctuated by relatively warm timespans, or interglacials of thousands of years, one of which we are in as of now. Since the last glaciation, British woodland history is considered quite short in terms of geological time spans, and is also closely related to the human civilization developing.`,
          },
          {
            text: `At the peak of the last glaciation (100,000 – 12,000 BC), the majority of Britain would have had no trees. Birch and willow scrub may have grown along the lower reaches of the ice, with pine in some areas. It's possible that remnants of pre-glacial flora were sheltered along the western bays of Great Britain and Ireland's coasts, but as far as the southern parts of England, the ice kept any land barren. Information regarding the development of Britain's flora following glaciation can be found by studying the deposits of pollen and seed in peat, as well as by the use of radiocarbon dating. Tundra and moorland followed the retreating ice, which lead to phases of different tree species spreading from the south. First came birch, aspen and sallow, followed by pine and hazel continuing to spread north as of 8500 BC, replacing birch to make it less commonly found for the next few thousand years. Oak and alder came after pine, then lime, elm, beech, and maple, all spreading northwards one after the other. From the moment lime arrived, in about 7300, to about 4500 BC the climate remained stable for a length of time known as the Atlantic Period, a time in which numerous species grew to form a series of wildwood or wilderness types.`,
          },
          {
            text: `What did the wilderness or wildwood look like, before man started interfering with it? One theory holds that Britain and Western Europe in Palaeolithic times was covered from coast to coast in a wildwood of continuous trees. However, a modern theory proposed by Francis Vera holds that Western Europe wilderness was a combination of grassland, scrub, and clusters or groves of trees. It was not a dense, impassable wildwood, but instead, an area similar to a park, kept up by wild herbivores eating the plants and grass. Throughout earlier interglacial periods, this may also have been the case in Britain, as creatures of the Palaeolithic era needed to roam large areas of grassland to survive. A variety of grassland plants continued to live there in the last interglacial, as according to pollen records. However, since the last glaciation, the bison, elk and other large herbivores which persisted on mainland Europe were extinct in Britain, so Vera's theory may not apply so well to Britain.`,
          },
          {
            text: `Meanwhile, throughout the period since it's spread northwards after the last glaciation, the sustained growth of oak in Britain demonstrates that the wildwood was not as continual as once believed. Oak is a pioneer species, which requires vacant space to generate more of itself. Grazing animals are also present to keep areas open, so Oak regenerates in the thorny brush as a protective measure from their grazing. Archaeological evidence indicates that red deer, who graze on grass as well as browse from trees, were essential to the economy in Mesolithic Britain, with people utilizing them for meat, skins, antlers and bones.`,
          },
          {
            text: `As the Mesolithic (10,000-3000 BC) era ended, evidence of the beginnings of agriculture emerges. Agricultural weeds, such as plantain and stinging nettle, were also increasing in number. Nearly all the wildwood was cut down as the population increased rapidly. However, the falling elm population around 4,000 BC all across Europe has been attributed not to the clearing of trees, but to what's referred to as Elm disease.`,
          },
          {
            text: `Throughout the Bronze Age (2400-750 BC), people were cutting down trees more than ever before, until the prevalence of the practice "coppicing" peaked, likely at some point during the early Iron Age. Oliver Rackham (1990) theorizes that nearly 50% of land throughout England was no longer wildwood by 500 BC. The regrowth from a stump grows more readily than the original tree, and Neolithic man had discovered this practice, known as coppicing. Much of the remaining woods were maintained by way of this method during the Bronze Age.`,
          },
          {
            text: `The Celtic peoples living in the Iron Age were able to master woodworking as an artform. Today, Celtic woodworking can be seen in houses, boats, wheels and other artifacts of the time. Coppicing as a means to manage woodland was of massive importance throughout two millennia that followed. Buildings, roads, fences, carts, and the fuel for heating, cooking, metalworking and pottery were all made possible due to wood materials gained from the vital practice of coppicing.`,
          },
          {
            text: `A clear divide has existed between wooded and non-wooded regions of Britain since the time of the Romans. As evidenced by The Domesday Book (1086), all the wood in England had an economic value and was the property of either an individual or community owner. Woods were the territories, or 'exclaves' of communities who lived some miles away. Even though it had to be transported over long distances, the materials which woodlands produced were of obvious value, and their ownership was long before established. Merely around 15% of land in England was represented by woodland or wood-pasture in the year 1086.`,
          },
          {
            text: `English woodlands produced mostly underwood used as fuel along with other things, with small oaks being used to construct buildings. The average wood-framed houses of the Medieval era mostly used oaks shorter than 18" in diameter. Longer pieces of timber were hard to come by, and kept only for elaborate buildings intended for the Church. Imported boards of thin oak or wainscot from Central Europe were brought in for the purpose of domestic building. Woodland cover was as low as 15% in 1086, and continued to decline as a result of an ever-growing population to 10% by 1350. This stopped suddenly with the plague of the Black Death of 1349 wiping out some of the human population. Woods which had persisted up to 1350 mostly prospered over the next 500 years.`,
          },
        ],
      },
      groups: [
        {
          title: 'Questions 1–6',
          instruction: `Do the following statements agree with the information given in Reading Passage 1? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, NOT GIVEN if there is no information on this.`,
          input: 'tfng',
          options: TFNG,
          questions: [
            { n: 1, text: 'Southern England was completely free of ice during the peak of the last glaciation.', answer: ['FALSE'] },
            { n: 2, text: 'Evidence of post-glacial plant development in Britain comes from peat deposits and radiocarbon dating.', answer: ['TRUE'] },
            { n: 3, text: 'Pine and hazel began spreading northwards in Britain around 8500 BC, gradually replacing birch.', answer: ['TRUE'] },
            { n: 4, text: "Francis Vera's theory of open woodland fits Britain after the last glaciation because large wild herbivores like bison and elk remained abundant there.", answer: ['FALSE'] },
            { n: 5, text: 'Red deer were used by people in Mesolithic Britain for several practical materials, including bones and antlers.', answer: ['TRUE'] },
            { n: 6, text: 'The decline of elm populations in Europe around 4000 BC was caused mainly by farmers clearing land for crops.', answer: ['FALSE'] },
          ],
        },
        {
          title: 'Questions 7–13',
          instruction: `Complete the notes below. Choose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.`,
          input: 'text',
          questions: [
            { n: 7, text: 'Coppicing: remained crucial for two millennia for building materials and fuel (heating, cooking, pottery, and ________).', answer: ['metalworking'] },
            { n: 8, text: 'Domesday Book (1086): woodland and wood-pasture covered roughly ________ of England.', answer: ['15%', '15 %', '15 percent', '15'] },
            { n: 9, text: 'Medieval timber: small oaks were used for ordinary wood-framed houses, typically under ________ in diameter.', answer: ['18"', '18', '18 inches', '18in'] },
            { n: 10, text: 'Long timber was reserved for major ________ buildings.', answer: ['Church'] },
            { n: 11, text: 'Thin oak boards called ________ were imported from Central Europe for domestic construction.', answer: ['wainscot'] },
            { n: 12, text: '14th-century shift: woodland cover fell to ________ by 1350 due to population growth.', answer: ['10%', '10 %', '10 percent', '10'] },
            { n: 13, text: 'The ________ of 1349 sharply reduced the population and allowed surviving woods to flourish for 500 years.', answer: ['Black Death'] },
          ],
        },
      ],
    },

    /* ===================== PART 2 ===================== */
    {
      passage: {
        title: 'The Return of Life to Bare Ground',
        paragraphs: [
          {
            label: 'A',
            text: `When a glacier withdraws from a valley, or a lava flow cools and hardens, the surface left behind is almost entirely without life. There is no soil to speak of, only broken mineral fragments, and the first seasons are harsh: the ground is exposed to wind, scorching sun and long spells without moisture. Yet the bareness rarely lasts. Within a few years, small patches of colour begin to appear on the rock, within a few decades the same place may carry shrubs, and in time it may be covered by trees. Ecologists call this sequence of change succession, and the question of what drives it, and how far its course can be predicted, has occupied the discipline for well over a century.`,
          },
          {
            label: 'B',
            text: `The earliest arrivals are almost never the plants that most people picture when they think of a landscape. Lichens, which are partnerships between a fungus and an alga, and a handful of mosses reach the bare surface as spores or fragments carried on the wind, and they can survive conditions that most other organisms could not tolerate. Because they need very little, they are described as pioneer species. Their significance, however, lies less in their own survival than in what they do to the surface beneath them. Acids produced by lichens slowly loosen the minerals of the rock, and as generation after generation dies and decays, a thin layer of organic matter accumulates in cracks and hollows. This is the beginning of soil.`,
          },
          {
            label: 'C',
            text: `Fresh mineral material is poor in nitrogen, an element that every plant needs in order to build proteins, and the supply in the air is of no direct use to them. A small number of plants have found a way round this limit. Their roots shelter bacteria that convert nitrogen from the air into a form the plant can absorb, and when the leaves and roots of these plants die, the nitrogen they have gathered passes into the ground. Alder trees and lupins are commonly cited examples. Where such plants take hold, the soil changes noticeably: it darkens, holds more water and becomes capable of supporting species that could not have survived there at the start.`,
          },
          {
            label: 'D',
            text: `For much of the twentieth century, this chain of events was taken as the model of how communities develop. Early ecologists argued that each group of species alters the surroundings in ways that suit its successors, and that the changes continue until a stable community, usually called the climax, is reached and then maintains itself. Under this view, a bare surface passes inevitably through a fixed series of stages, much as a child grows into an adult. The comparison was persuasive because the examples that had been studied, such as the plants colonising dunes or newly exposed lake shores, seemed to fit it neatly. Textbooks repeated the account for decades, and few people thought to question it.`,
          },
          {
            label: 'E',
            text: `Later fieldwork complicated the picture. Which species arrive first on a cleared surface depends heavily on chance: on the direction of the prevailing wind, on how far the nearest seed source lies, and on whether animals happen to pass through. Birds, for instance, perch on isolated rocks and posts, and the seeds in their droppings give rise to small islands of shrubs from which colonisation then spreads outward. Two apparently identical sites, only a short distance apart, can therefore develop quite different communities simply because different seeds reached them in the first few seasons. Such accidents of arrival could not be fitted into any fixed series of stages.`,
          },
          {
            label: 'F',
            text: `Relations between species also turned out to be less cooperative than the original account implied. Early occupants do not always prepare the ground for their successors; sometimes they obstruct them. A dense mat of grass, once established, can shade the soil and compete so effectively for water that tree seedlings fail to take root, and a site may remain grassland for far longer than the standard sequence would predict. In other cases the species already present neither help nor hinder those that follow, and later arrivals simply tolerate whatever conditions they find. What emerges is not a ladder in which each step is cleared for the next but a contest whose outcome depends on timing, tolerance and competition.`,
          },
          {
            label: 'G',
            text: `Disturbance adds a further layer of complexity. Fire, storm, flood and grazing can set a community back to an earlier stage, or to a quite different one, at almost any point in its development. Succession that begins on abandoned farmland or after a forest fire, where soil and buried seeds are still present, generally proceeds far faster than succession on newly exposed rock, because the slow work of building soil has already been done. A typical landscape is therefore a patchwork of areas at different stages, each recovering from a different event, and many ecologists now doubt that any single stable end point exists at all.`,
          },
          {
            label: 'H',
            text: `None of this has made the study of succession obsolete. Those who restore land damaged by quarrying or mining draw on it constantly: planting nitrogen-gathering species can speed the recovery of poor ground, while controlling the grasses that block tree growth can prevent a site from stalling. Yet the more cautious view of the process has changed what restorers promise. They tend to speak of encouraging a range of likely outcomes rather than of delivering a particular end point, and they accept that the result will depend on conditions and events no one can fully foresee. The sequence that early ecologists described is still visible on many sites, but it is better understood as a common tendency than as a rule.`,
          },
        ],
      },
      groups: [
        {
          title: 'Questions 14–19',
          instruction: `Reading Passage 2 has eight paragraphs, A–H. Which paragraph contains the following information? Choose the correct letter, A–H.`,
          input: 'letter',
          options: letters('A', 'H'),
          questions: [
            { n: 14, text: 'Examples of how ecological concepts are applied today when restoring damaged land.', answer: ['H'] },
            { n: 15, text: 'A comparison between ecological development and human growth from childhood to adulthood.', answer: ['D'] },
            { n: 16, text: 'How chance events and animals spreading seeds can make nearby sites develop differently.', answer: ['E'] },
            { n: 17, text: 'A description of how early organisms help start soil formation on rock.', answer: ['B'] },
            { n: 18, text: 'Why succession on land that already has soil and seeds happens quicker than on bare rock.', answer: ['G'] },
            { n: 19, text: 'How existing plants can block or slow down later species instead of helping them.', answer: ['F'] },
          ],
        },
        {
          title: 'Questions 20–23',
          instruction: `Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.`,
          input: 'text',
          questions: [
            { n: 20, text: 'New mineral surfaces lack ________, which plants need to make proteins.', answer: ['nitrogen'] },
            { n: 21, text: 'Certain plants, such as ________ and lupins, host bacteria in their roots.', answer: ['alder'] },
            { n: 22, text: 'These plants host ________ in their roots that turn atmospheric nitrogen into a usable form.', answer: ['bacteria'] },
            { n: 23, text: 'As plant material decays and enriches the ground, the soil becomes darker, retains more ________, and can support more demanding species.', answer: ['water'] },
          ],
        },
        {
          title: 'Questions 24–26',
          instruction: `Choose the correct letter, A, B, C or D.`,
          input: 'mcq',
          mcqOptions: {
            24: abcd(
              'Pioneer species always prepare ideal conditions for trees.',
              'Species interactions are often competitive rather than purely cooperative.',
              'Grasses usually prevent shrubs from growing on bare rock.',
              'Ecologists now agree that every site reaches the same climax community.',
            ),
            25: abcd(
              'They permanently stop succession from continuing.',
              'They only occur after a climax community has formed.',
              'They can push a community back or shift it onto a different path.',
              'They remove all seeds buried in the ground.',
            ),
            26: abcd(
              'They guarantee a single fixed ecological outcome.',
              'They avoid using nitrogen-fixing plants.',
              'They aim to support probable outcomes while accepting uncertainty.',
              'They treat succession as a strict law with no exceptions.',
            ),
          },
          questions: [
            { n: 24, text: 'What is the main point of Paragraph F regarding interactions between species?', answer: ['B'] },
            { n: 25, text: 'According to Paragraph G, what effect do disturbances like fire, storms, or grazing have?', answer: ['C'] },
            { n: 26, text: 'How do land restorers described in Paragraph H approach their work today?', answer: ['C'] },
          ],
        },
      ],
    },

    /* ===================== PART 3 ===================== */
    {
      passage: {
        title: 'The persistence and peril of misinformation',
        intro: 'Brian Southwell looks at how human brains verify information and discusses some of the challenges of battling widespread falsehoods.',
        paragraphs: [
          {
            label: 'A',
            text: `Misinformation – both deliberately promoted and accidentally shared – is perhaps an inevitable part of the world in which we live, but it is not a new problem. People likely have lied to one another for roughly as long as verbal communication has existed. Deceiving others can offer an apparent opportunity to gain strategic advantage, to motivate others to action, or even to protect interpersonal bonds. Moreover, people inadvertently have been sharing inaccurate information with one another for thousands of years.`,
          },
          {
            label: 'B',
            text: `However, we currently live in an era in which technology enables information to reach large audiences distributed across the globe, and thus the potential for immediate and widespread effects from misinformation now looms larger than in the past. Yet the means to correct misinformation might, over time, be found in those same patterns of mass communication and of the facilitated spread of information.`,
          },
          {
            label: 'C',
            text: `The main worry regarding misinformation is its potential to unduly influence attitudes and behavior, leading people to think and act differently than they would if they were correctly informed, as suggested by the research teams of Stephan Lewandowsky of the University of Bristol and Elizabeth Marsh of Duke University, among others. In other words, we worry that misinformation might lead people to hold misperceptions (or false beliefs) and that these misperceptions, especially when they occur among large groups of people, may have detrimental, downstream consequences for health, social harmony, and the political climate.`,
          },
          {
            label: 'D',
            text: `At least three observations related to misinformation in the contemporary mass-media environment warrant the attention of researchers, policy makers, and really everyone who watches television, listens to the radio, or reads information online. First of all, people who encounter misinformation tend to believe it, at least initially. Secondly, electronic and print media often do not block many types of misinformation before it appears in content available to large audiences. Thirdly, countering misinformation once it has enjoyed wide exposure can be a resource-intensive effort.`,
          },
          {
            label: 'E',
            text: `Knowing what happens when people initially encounter misinformation holds tremendous importance for estimating the potential for subsequent problems. Although it is fairly routine for individuals to come across information that is false, the question of exactly how – and when – we mentally label information as true or false has garnered philosophical debate. The dilemma is neatly summarized by a contrast between how the 17th-century philosophers René Descartes and Baruch Spinoza described human information engagement, with conflicting predictions that only recently have been empirically tested in robust ways. Descartes argued that a person only accepts or rejects information after considering its truth or falsehood; Spinoza argued that people accept all encountered information (or misinformation) by default and then subsequently verify or reject it through a separate cognitive process. In recent decades, empirical evidence from the research teams of Erik Asp of the University of Chicago and Daniel Gilbert at Harvard University, among others, has supported Spinoza's account: people appear to encode all new information as if it were true, even if only momentarily, and later tag the information as being either true or false, a pattern that seems consistent with the observation that mental resources for skepticism physically reside in a different part of the brain than the resources used in perceiving and encoding.`,
          },
          {
            label: 'F',
            text: `What about our second observation that misinformation often can appear in electronic or print media without being preemptively blocked? In support of this, one might consider the nature of regulatory structures in the United States: regulatory agencies here tend to focus on post hoc detection of broadcast information. Organizations such as the Food and Drug Administration (FDA) offer considerable monitoring and notification functions, but these roles typically do not involve preemptive censoring. The FDA oversees direct-to-consumer prescription drug advertising, for example, and has developed mechanisms such as the 'Bad Ad' program, through which people can report advertising in apparent violation of FDA guidelines on drug risks. Such programs, although laudable and useful, do not keep false advertising off the airwaves. In addition, even misinformation that is successfully corrected can continue to affect attitudes.`,
          },
          {
            label: 'G',
            text: `This leads us to our third observation: a campaign to correct misinformation, even if rhetorically compelling, requires resources and planning to accomplish necessary reach and frequency. For corrective campaigns to be persuasive, audiences need to be able to comprehend them, which requires either effort to frame messages in ways that are accessible or effort to educate and sensitize audiences to the possibility of misinformation. That some audiences might be unaware of the potential for misinformation also suggests the utility of media literacy efforts as early as elementary school. Even with journalists and scholars pointing to the phenomenon of 'fake news', people do not distinguish between demonstrably false stories and those based in fact when scanning and processing written information.`,
          },
          {
            label: 'H',
            text: `We live at a time when widespread misinformation is common. Yet at this time many people also are passionately developing potential solutions and remedies. The journey forward undoubtedly will be a long and arduous one. Future remedies will require not only continued theoretical consideration but also the development and maintenance of consistent monitoring tools – and a recognition among fellow members of society that claims which find prominence in the media that are insufficiently based in scientific consensus and social reality should be countered. Misinformation arises as a result of human fallibility and human information needs. To overcome the worst effects of the phenomenon, we will need coordinated efforts over time, rather than any singular one-time panacea we could hope to offer.`,
          },
        ],
      },
      groups: [
        {
          title: 'Questions 27–31',
          instruction: `Do the following statements agree with the claims of the writer in Reading Passage 3? Choose YES if the statement agrees with the claims of the writer, NO if the statement contradicts the claims of the writer, NOT GIVEN if it is impossible to say what the writer thinks about this.`,
          input: 'tfng',
          options: YNNG,
          questions: [
            { n: 27, text: 'Deliberate deception and accidental inaccuracy have existed in human communication for a very long time.', answer: ['YES'] },
            { n: 28, text: 'Modern communication technology makes rapid, wide-reaching effects of misinformation more likely than in earlier eras.', answer: ['YES'] },
            { n: 29, text: "Research by Erik Asp and Daniel Gilbert supports Descartes's view over Spinoza's.", answer: ['NO'] },
            { n: 30, text: 'US regulatory bodies like the FDA primarily focus on checking/responding after information appears rather than blocking false claims in advance.', answer: ['YES'] },
            { n: 31, text: 'Teaching media literacy should wait until university level rather than starting early.', answer: ['NO'] },
          ],
        },
        {
          title: 'Questions 32–36',
          instruction: `Complete each sentence with the correct ending, A–G, from the box below.`,
          box: [
            'A  physical resources for skepticism in the brain.',
            'B  health, social harmony, and politics.',
            'C  sustained, coordinated efforts rather than a single quick fix.',
            'D  influence people’s attitudes.',
            'E  sufficient reach and frequency.',
            'F  factual reporting from clearly false claims.',
            'G  bans on all prescription drug advertising.',
          ],
          input: 'letter',
          options: letters('A', 'G'),
          questions: [
            { n: 32, text: 'Large-scale false beliefs among the public can negatively affect', answer: ['B'] },
            { n: 33, text: 'Even after misinformation is corrected, it can still', answer: ['D'] },
            { n: 34, text: 'Persuasive correction campaigns require careful planning and resources to achieve', answer: ['E'] },
            { n: 35, text: 'When people quickly scan written stories, they often fail to separate', answer: ['F'] },
            { n: 36, text: 'Tackling widespread misinformation in the long run will depend on', answer: ['C'] },
          ],
        },
        {
          title: 'Questions 37–40',
          instruction: `Choose the correct letter, A, B, C or D.`,
          input: 'mcq',
          mcqOptions: {
            37: abcd(
              'Only to harm political rivals.',
              'For strategic advantage, to prompt action, or to protect social bonds.',
              'Because they cannot tell truth from fiction.',
              'Mainly due to modern mass media.',
            ),
            38: abcd(
              'People immediately reject claims until they prove them false.',
              'Humans temporarily treat new information as true before verifying or rejecting it.',
              'Skepticism and perception use the exact same brain region.',
              'Philosophical debates on this topic ended in the 17th century.',
            ),
            39: abcd(
              'It prevents all misleading ads from ever being broadcast.',
              'It allows people to report ads that appear to break drug-risk rules.',
              'It replaces scientific monitoring tools.',
              'It is run by universities rather than regulators.',
            ),
            40: abcd(
              'Monitoring tools and broader societal pushback against unsupported claims are needed.',
              'A single technological breakthrough will solve the problem soon.',
              'Misinformation is unrelated to human information needs.',
              'Efforts to counter misinformation should be abandoned as too slow.',
            ),
          },
          questions: [
            { n: 37, text: 'According to Paragraph A, why might people lie to others?', answer: ['B'] },
            { n: 38, text: 'What does Paragraph E say about how humans process new information?', answer: ['B'] },
            { n: 39, text: 'What is mentioned in Paragraph F about the FDA’s ‘Bad Ad’ program?', answer: ['B'] },
            { n: 40, text: 'In Paragraph H, what does the writer conclude about future solutions to misinformation?', answer: ['A'] },
          ],
        },
      ],
    },
  ],
};
