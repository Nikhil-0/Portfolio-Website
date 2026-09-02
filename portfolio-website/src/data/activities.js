// ---------------------------------------------------------------------------
// "Holistic Development" — activities grouped by life stage.
//
// `stages` is an ordered list. Each stage has a label and a list of activities:
//   {
//     org:         string
//     logo:        imported image
//     role?:       string          — optional (shown under the title)
//     award?:      string          — optional highlight badge
//     description: string
//     images?:     [{ src, alt }]  — optional photo gallery (opens in a lightbox)
//   }
// ---------------------------------------------------------------------------
import nccLogo from '../assets/NCC_Logo.png';
import nccImg1 from '../assets/NCC_Image.jpg';
import nccImg2 from '../assets/NCC_Image2.jpg';
import nccImg3 from '../assets/NCC_Image3.jpg';
import tjcLogo from '../assets/TJC_Logo.avif';
import odacImg1 from '../assets/ODAC_Image.jpg';
import odacImg2 from '../assets/ODAC_Image2.jpg';
import odacImg3 from '../assets/ODAC_Image3.jpg';
import cwLogo from '../assets/CommonwealthLogo.png';
import cwCert from '../assets/CommonWealthCertificate.jpg';
import hwnLogo from '../assets/HWN_Logo.webp';
import rsnLogo from '../assets/Republic_of_Singapore_Navy_Crest.svg';
import navyImg1 from '../assets/Navy_Image.jpg';
import navyImg2 from '../assets/Navy_Image2.jpg';
import navyImg3 from '../assets/Navy_Image3.jpg';
import navyImg4 from '../assets/Navy_Image4.jpg';
import choirLogo from '../assets/Choir_Logo.png';
import choirImg1 from '../assets/Choir_Comp.jpg';
import choirImg2 from '../assets/Choir_Comp2.jpg';
import choirImg3 from '../assets/Choir_Comp3.JPG';

export const stages = [
  {
    label: 'Secondary School',
    activities: [
      {
        org: 'National Cadet Corps',
        role: 'Staff Sergeant',
        award: 'Best Unit Award (3 consecutive years)',
        logo: nccLogo,
        description:
          'As a Staff Sergeant I was responsible for the training and guidance of younger cadets, which built my confidence, communication and leadership. Over the years the unit earned the Best Unit Award for three consecutive years and placed 1st runner-up in the annual Precision Drill Squad competition.',
        images: [
          { src: nccImg1, alt: 'NCC activity' },
          { src: nccImg2, alt: 'NCC activity' },
          { src: nccImg3, alt: 'NCC activity' },
        ],
      },
    ],
  },
  {
    label: 'Junior College',
    activities: [
      {
        org: 'Outdoor Adventure Club',
        role: 'Secretary, Executive Committee',
        logo: tjcLogo,
        description:
          'As Secretary on the ExCo I coordinated CCA sessions and managed personnel, training and events. With the committee I worked to make the CCA an enriching experience for all members, and helped plan and run the Temasek Leadership Showdown, an annual national leadership camp TJC organises to develop leadership in younger participants.',
        images: [
          { src: odacImg1, alt: 'Outdoor Adventure Club activity' },
          { src: odacImg2, alt: 'Outdoor Adventure Club activity' },
          { src: odacImg3, alt: 'Outdoor Adventure Club activity' },
        ],
      },
      {
        org: "The Queen's Commonwealth Essay Competition",
        award: 'Silver Award',
        logo: cwLogo,
        description:
          "I took part in The Queen's Commonwealth Essay Competition, the world's oldest international writing competition for schools, using it to express my thoughts on global issues. It sharpened my writing and broadened my understanding of the challenges different communities face and I was awarded the Silver Award bringing recognition to my school on the international stage.",
        images: [{ src: cwCert, alt: 'Commonwealth Essay Competition certificate' }],
      },
      {
        org: 'Heartware Network',
        role: 'Volunteer Tutor',
        logo: hwnLogo,
        description:
          'I volunteered at the Heartware Network as a tutor and mentor to primary school students from less privileged backgrounds. Helping with their studies and seeing their results and their parents’ smiles improve over time was a genuinely fulfilling way to give back to the community.',
      },
    ],
  },
  {
    label: 'National Service',
    activities: [
      {
        org: 'Republic of Singapore Navy',
        role: 'Security Trooper',
        logo: rsnLogo,
        description:
          'Posted to the RSN as a Security Trooper responsible for the safety and security of the naval base: staying vigilant for threats, running regular security checks and drills, and responding to incidents. I also handled guardroom logistics, keeping supplies and equipment ready while managing security clearance for the entire base. The role honed my discipline, teamwork, organisation and ability to work under pressure.',
        images: [
          { src: navyImg1, alt: 'Republic of Singapore Navy' },
          { src: navyImg2, alt: 'Republic of Singapore Navy' },
          { src: navyImg3, alt: 'Republic of Singapore Navy' },
          { src: navyImg4, alt: 'Republic of Singapore Navy' },
        ],
      },
    ],
  },
  {
    label: 'University',
    activities: [
      {
        org: 'NTU Choir',
        award: 'Category Champion · Gold VII, Sing Berlin!',
        logo: choirLogo,
        description:
          'A member of the NTU Choir, performing in concerts and events throughout the year. In the summer of my first year we competed at Sing Berlin! in Germany, an incredible chance to immerse in a different culture and gain new perspectives on music and performance. Through hard work and dedication we delivered a performance that won the category champion award in both categories we entered, earning Gold VII diplomas. I’m proud to have represented NTU and Singapore.',
        images: [
          { src: choirImg1, alt: 'NTU Choir competition' },
          { src: choirImg2, alt: 'NTU Choir competition' },
          { src: choirImg3, alt: 'NTU Choir competition' },
        ],
      },
    ],
  },
];
