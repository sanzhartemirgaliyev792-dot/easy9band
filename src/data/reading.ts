import type { ReadingPassage } from './testTypes';

const TFNG_INSTRUCTION =
  "Do the following statements agree with the information given in the passage? Choose TRUE if the statement agrees with the information, FALSE if the statement contradicts the information, or NOT GIVEN if there is no information on this.";
const YNNG_INSTRUCTION =
  "Do the following statements agree with the views of the writer? Choose YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this.";
const GAP_INSTRUCTION = "Complete the sentences. Write NO MORE THAN TWO WORDS from the passage for each answer.";

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "p1",
    title: "Farming Above the City",
    paragraphs: [
      {
        label: "A",
        text: "Across the world's largest cities, flat rooftops that once held nothing more than water tanks and ventilation units are being converted into productive farms. Advocates say the trend, which gathered pace in the 2010s, offers a way of producing fresh vegetables close to the people who eat them, while making use of space that would otherwise be wasted.",
      },
      {
        label: "B",
        text: "The earliest rooftop gardens were small, often tended by volunteers. They grew herbs and salad leaves in wooden boxes filled with soil, which was heavy and required buildings to be strengthened. The shift to lightweight growing media, such as blends of coconut fibre and crushed volcanic rock, changed this. These materials weigh around one third as much as soil when wet, so a wider range of buildings can host a farm without expensive structural work.",
      },
      {
        label: "C",
        text: "Rooftop farms also bring benefits beyond food. A layer of plants and growing medium insulates the building below, reducing the amount of energy needed for heating in winter and cooling in summer. Rainwater is absorbed by the crops rather than rushing into drains, which lowers the risk of flooding during storms. Some operators report that their farms capture around 60 per cent of the rain that falls on them.",
      },
      {
        label: "D",
        text: "Not everyone is convinced. Critics point out that rooftops are exposed to strong wind and intense sun, so crops often need irrigation systems that consume large quantities of water. Moreover, the yields of a typical rooftop farm are small compared with those of a conventional farm; a 2,000-square-metre site might provide several hundred people with vegetables, but it could not supply staple foods such as wheat or rice. Rooftop farms are therefore best understood as a supplement to, rather than a replacement for, rural agriculture.",
      },
      {
        label: "E",
        text: "Economics is a further obstacle. Building owners must pay for waterproofing, safety railings and access stairs before the first seed is planted, and the financial return can take many years. Several cities have responded with incentives. In one northern European city, owners who install a green roof receive a subsidy covering part of the cost, and the number of rooftop farms there roughly doubled within five years of the scheme's launch.",
      },
      {
        label: "F",
        text: "Despite the challenges, many urban planners expect the practice to expand. The most promising model combines farming with community use: restaurants buy produce from the roof directly above their kitchens, schools use farms for science lessons, and residents rent small plots at weekends. Such arrangements spread the costs and give the farm a social purpose as well as a commercial one.",
      },
    ],
    groups: [
      {
        type: "tfng",
        instruction: TFNG_INSTRUCTION,
        questions: [
          { n: 1, text: "Rooftop farming became much more common during the 2010s.", answer: "TRUE" },
          { n: 2, text: "The first rooftop gardens were mostly run by commercial companies.", answer: "FALSE" },
          { n: 3, text: "Lightweight growing media weigh about one third as much as wet soil.", answer: "TRUE" },
          { n: 4, text: "Green roofs have been shown to reduce the price of vegetables in cities.", answer: "NOT GIVEN" },
          { n: 5, text: "Some rooftop farms report capturing more than half of the rain that falls on them.", answer: "TRUE" },
          { n: 6, text: "The writer argues that rooftop farms are likely to replace rural agriculture.", answer: "FALSE" },
          { n: 7, text: "The subsidy scheme was introduced because of complaints from local residents.", answer: "NOT GIVEN" },
        ],
      },
      {
        type: "gap",
        instruction: GAP_INSTRUCTION,
        questions: [
          { n: 8, text: "Because soil is heavy, buildings often had to be _____ before early rooftop gardens could be built.", answer: "strengthened" },
          { n: 9, text: "Lightweight growing media can be made from coconut fibre and crushed _____ rock.", answer: "volcanic" },
          { n: 10, text: "The layer of plants and growing medium _____ the building below, which reduces energy use.", answer: "insulates" },
          { n: 11, text: "Critics say that rooftop crops often need _____ systems that consume large quantities of water.", answer: "irrigation" },
          { n: 12, text: "Rooftop farms could not supply _____ foods such as wheat or rice.", answer: "staple" },
          { n: 13, text: "Before the first seed is planted, owners must pay for waterproofing, safety railings and access _____.", answer: "stairs" },
        ],
      },
    ],
  },
  {
    id: "p2",
    title: "The Science of the Afternoon Nap",
    paragraphs: [
      {
        label: "A",
        text: "In many cultures, the early afternoon is a time for rest. The Spanish siesta is the best-known example, but similar customs exist across Latin America, the Middle East and parts of Asia. For decades, researchers assumed that these habits were simply a response to hot weather. More recent work suggests that the urge to nap may be built into human biology: most people experience a natural dip in alertness between about 1 p.m. and 3 p.m., regardless of what they have eaten or how warm it is.",
      },
      {
        label: "B",
        text: "Sleep scientists divide sleep into stages, and the length of a nap determines which stages it reaches. A nap of around 20 minutes stays in light sleep, from which most people wake easily and feeling refreshed. Longer naps, of 60 minutes or more, include deep sleep. Those who wake from this stage often suffer from 'sleep inertia', a heavy grogginess that can last for half an hour.",
      },
      {
        label: "C",
        text: "The benefits of a short nap have been tested in a variety of settings. In one trial involving 40 hospital night-shift workers, those allowed a 20-minute nap made fewer errors on a standard attention test than colleagues who stayed awake. Similar results have been recorded among drivers and factory staff, leading some employers to provide quiet rooms for rest.",
      },
      {
        label: "D",
        text: "Napping is not helpful for everyone. People who find it hard to fall asleep at night may make their problem worse by sleeping during the day, because a nap reduces the pressure to sleep that builds up over waking hours. Doctors therefore often advise people with insomnia to avoid naps altogether. Moreover, a very long nap late in the afternoon may delay bedtime by an hour or more.",
      },
      {
        label: "E",
        text: "Researchers are also interested in what naps do for memory. In a well-known experiment, students who studied a list of word pairs and then took a 90-minute nap recalled significantly more of them later than students who stayed awake. Scientists believe that during sleep the brain replays recent experiences, strengthening the connections that store them.",
      },
      {
        label: "F",
        text: "Despite this evidence, attitudes to daytime sleep vary. In some countries, napping at work is regarded as a sign of laziness, and employees who are caught asleep may be punished. Elsewhere, however, views are changing: a growing number of companies now offer 'nap pods' as a perk to attract staff. Experts suggest that as the evidence grows, cultural attitudes will continue to shift.",
      },
    ],
    groups: [
      {
        type: "match",
        instruction:
          "The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below. There are more headings than paragraphs, so you will not use them all.",
        choices: [
          { key: "i", label: "Situations in which napping may do harm" },
          { key: "ii", label: "The role of naps in learning" },
          { key: "iii", label: "Why companies ban sleeping at work" },
          { key: "iv", label: "How the length of a nap affects how you feel" },
          { key: "v", label: "Evidence from the workplace" },
          { key: "vi", label: "Changing attitudes towards daytime sleep" },
          { key: "vii", label: "An ancient habit with a biological explanation" },
          { key: "viii", label: "The best time of day to go to bed" },
        ],
        questions: [
          { n: 14, text: "Paragraph A", answer: "vii" },
          { n: 15, text: "Paragraph B", answer: "iv" },
          { n: 16, text: "Paragraph C", answer: "v" },
          { n: 17, text: "Paragraph D", answer: "i" },
          { n: 18, text: "Paragraph E", answer: "ii" },
          { n: 19, text: "Paragraph F", answer: "vi" },
        ],
      },
      {
        type: "mcq",
        instruction: "Choose the correct letter, A, B, C or D.",
        questions: [
          {
            n: 20,
            text: "According to paragraph A, recent research suggests that the afternoon dip in alertness",
            options: ["is caused by hot weather.", "depends on what people have eaten.", "appears to be part of human biology.", "is limited to certain cultures."],
            answer: "C",
          },
          {
            n: 21,
            text: "What is 'sleep inertia'?",
            options: [
              "a feeling of heaviness after waking from deep sleep",
              "a type of deep sleep",
              "the refreshed feeling after a 20-minute nap",
              "a medical condition that affects pilots",
            ],
            answer: "A",
          },
          {
            n: 22,
            text: "Why might naps be a problem for people with insomnia?",
            options: [
              "They cause too much deep sleep at night.",
              "They make people wake up too early.",
              "They raise body temperature.",
              "They reduce the pressure to sleep later on.",
            ],
            answer: "D",
          },
          {
            n: 23,
            text: "What do scientists believe happens in the brain during sleep?",
            options: [
              "It erases unimportant memories.",
              "It replays recent experiences and strengthens memory connections.",
              "It rests completely.",
              "It creates new pairs of words.",
            ],
            answer: "B",
          },
        ],
      },
      {
        type: "gap",
        instruction: GAP_INSTRUCTION,
        questions: [
          { n: 24, text: "A nap of around 20 minutes stays in _____ sleep, so most people wake easily.", answer: "light" },
          { n: 25, text: "In a study of hospital night-shift workers, those who napped made fewer _____ on an attention test.", answer: "errors" },
          { n: 26, text: "Some companies now provide 'nap pods' as a _____ to attract staff.", answer: "perk" },
        ],
      },
    ],
  },
  {
    id: "p3",
    title: "Does Handwriting Still Matter?",
    paragraphs: [
      {
        label: "A",
        text: "When a primary school in a mid-sized town replaced its handwriting lessons with typing classes, parents were divided. Some welcomed the change as a sensible response to a digital world; others feared that children would lose a skill that connects them to centuries of written culture. The debate, repeated in many countries, raises a question that is harder to answer than it first appears: is handwriting merely a method of recording words, or does it shape how we think?",
      },
      {
        label: "B",
        text: "Evidence from brain imaging suggests the latter may have some truth. When people write by hand, they must form each letter from scratch, coordinating the movement of the fingers with visual feedback. Typing, by contrast, requires only that a key be pressed, and every letter involves the same simple action. Researchers who scanned adults learning an unfamiliar alphabet found that those who practised by hand showed stronger activity in regions of the brain linked to reading than those who practised on a keyboard. It would be unwise, however, to conclude from a small number of studies that typing harms learning.",
      },
      {
        label: "C",
        text: "Note-taking has attracted particular attention. A frequently cited study compared students who took notes by hand with others who used laptops during lectures. The laptop users wrote more, but often recorded the lecturer's words almost verbatim, while the handwriters, unable to keep up, were forced to summarise. When tested later, the handwriters performed better on questions that required an understanding of concepts, though not on questions about simple facts. Later attempts to repeat the study produced mixed results, which suggests that the effect may be smaller than first claimed.",
      },
      {
        label: "D",
        text: "Speed is the most obvious advantage of the keyboard. Most adults type at roughly twice the speed at which they write, and a typed document can be edited, searched and shared in seconds. For students with physical difficulties, such as dyspraxia, typing can remove a barrier that has nothing to do with intelligence. Few educators would argue that these students should be denied the technology.",
      },
      {
        label: "E",
        text: "The disappearance of handwriting also has a cultural dimension. Historians rely on the personal letters, diaries and annotated drafts of earlier generations; by comparison, much modern correspondence is stored on servers that may not survive a few decades. A letter written in ink can still be read after three hundred years, whereas files saved in obsolete formats are already difficult to open. Some archivists worry that future historians will have less personal evidence to study than their predecessors did.",
      },
      {
        label: "F",
        text: "Perhaps the most sensible position lies between the extremes. Many teachers now advocate 'both-and' classrooms, in which children learn to write by hand in the early years, when fine motor skills are developing, and add keyboard skills as they grow older. This approach neither romanticises the pen nor treats the keyboard as an enemy. The aim, as one educator put it, is to give children the tools to choose the right medium for the task.",
      },
    ],
    groups: [
      {
        type: "ynng",
        instruction: YNNG_INSTRUCTION,
        questions: [
          { n: 27, text: "The question of whether handwriting matters is easy to answer.", answer: "NO" },
          { n: 28, text: "A few brain-imaging studies prove that typing is harmful to learning.", answer: "NO" },
          { n: 29, text: "The findings of the note-taking study may have been exaggerated.", answer: "YES" },
          { n: 30, text: "Students with physical difficulties should be discouraged from typing.", answer: "NO" },
          { n: 31, text: "Handwriting will return to widespread everyday use.", answer: "NOT GIVEN" },
        ],
      },
      {
        type: "mcq",
        instruction: "Choose the correct letter, A, B, C or D.",
        questions: [
          {
            n: 32,
            text: "What is the main point of paragraph A?",
            options: [
              "Parents should decide how schools teach writing.",
              "Typing classes are more useful than handwriting lessons.",
              "Digital skills are essential for all children.",
              "A school's decision raised a wider question about handwriting.",
            ],
            answer: "D",
          },
          {
            n: 33,
            text: "In the brain-imaging study, adults who practised an unfamiliar alphabet by hand",
            options: [
              "showed more activity in areas of the brain related to reading.",
              "learned the letters more quickly than keyboard users.",
              "found the letters harder to recognise.",
              "were more motivated than keyboard users.",
            ],
            answer: "A",
          },
          {
            n: 34,
            text: "Why did the handwriters do better on conceptual questions in the note-taking study?",
            options: [
              "They had more time to study.",
              "They wrote more than the laptop users.",
              "They had to summarise the lecture rather than copy it.",
              "They attended more lectures.",
            ],
            answer: "C",
          },
          {
            n: 35,
            text: "What concern do some archivists have?",
            options: [
              "Handwritten letters are being destroyed.",
              "Digital records may not last long enough to be read in the future.",
              "Historians no longer value personal letters.",
              "Servers are too expensive to maintain.",
            ],
            answer: "B",
          },
          {
            n: 36,
            text: "What does the writer say about 'both-and' classrooms?",
            options: [
              "They introduce handwriting first and keyboard skills later.",
              "They treat the keyboard as an enemy.",
              "They teach typing before handwriting.",
              "They have been shown to improve test scores.",
            ],
            answer: "A",
          },
        ],
      },
      {
        type: "gap",
        instruction: GAP_INSTRUCTION,
        questions: [
          { n: 37, text: "When writing by hand, people coordinate the movement of their _____ with visual feedback.", answer: "fingers" },
          { n: 38, text: "In the note-taking study, laptop users often recorded the lecturer's words almost _____.", answer: "verbatim" },
          { n: 39, text: "Most adults type at roughly _____ the speed at which they write.", answer: "twice", accept: ["two times", "2 times"] },
          { n: 40, text: "A letter written in _____ can still be read after three hundred years.", answer: "ink" },
        ],
      },
    ],
  },
];
