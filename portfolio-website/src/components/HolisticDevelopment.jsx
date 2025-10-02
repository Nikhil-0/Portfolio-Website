import React from 'react';
import NCC_Logo from '../assets/NCC_Logo.png';
import NCC_Image_1 from '../assets/NCC_Image.jpg';
import NCC_Image_2 from '../assets/NCC_Image2.jpg';
import NCC_Image3 from '../assets/NCC_Image3.jpg';
import TJC from '../assets/TJC_Logo.avif';
import ODAC_Image from '../assets/ODAC_Image.jpg';
import ODAC_Image2 from '../assets/ODAC_Image2.jpg';
import ODAC_Image3 from '../assets/ODAC_Image3.jpg';
import CW_Logo from '../assets/CommonWealthLogo.png';
import CW_Certificate from '../assets/CommonWealthCertificate.jpg';
import HWN from '../assets/HWN_Logo.webp';
import RSN from '../assets/Republic_of_Singapore_Navy_Crest.svg';
import Navy_Image from '../assets/Navy_Image.jpg';
import Navy_Image2 from '../assets/Navy_Image2.jpg';
import Navy_Image3 from '../assets/Navy_Image3.jpg';
import Navy_Image4 from '../assets/Navy_Image4.jpg';
import Choir_Logo from '../assets/Choir_Logo.png';
import Choir_Image1 from '../assets/Choir_Comp.jpg';
import Choir_Image2 from '../assets/Choir_Comp2.jpg';
import Choir_Image3 from '../assets/Choir_Comp3.jpg';
import '../styles/HolisticDevelopment.css';

export default function HolisticDevelopment() {
  return (
    <section className="holistic-development-section">
      <h2 className="life-stage-heading">Secondary School</h2>
      <div className="activity-entry">
        <img src={NCC_Logo} className="activity-logo" />
        <div className="activity-content">
          <h3>National Cadet Corps</h3>
          <p>I was once a Staff Sergeant in NCC, where I developed leadership and teamwork skills. I was responsible and accountable for the training and guidance of younger cadets, which helped me build confidence and communication abilities. Throughout the years, I had contributed to several accolades such as the Best Unit Award for 3 consecutive years and the 1st runner-up award for the annual Precision Drill Squad competition.</p>
          <div className="activity-images">
            <img src={NCC_Image_1} className="activity-image" />
            <img src={NCC_Image_2} className="activity-image" />
            <img src={NCC_Image3} className="activity-image" />
          </div>
        </div>
      </div>

      <h2 className="life-stage-heading">Junior College</h2>
      <div className="activity-entry">
        <img src={TJC} className="activity-logo" />
        <div className="activity-content">
          <h3>Outdoor Adventure Club</h3>
          <p>I was a member of the executive committee in the Outdoor Adventure Club of Temasek Junior College with the position of Secretary, where I was responsible for the overall coordination of CCA session and managed the personnel, training sessions and events held. Together with the rest of the committee, we managed to make the CCA an enriching experience for all members through effective planning and execution of various events and training sessions. We also participated in the planning and execution of the Temasek Leadership Showdown, an annual, national leadership camp that TJC organises to bring out effective leaders in the younger student participants.</p>
          <div className="activity-images">
            <img src={ODAC_Image} className="activity-image" />
            <img src={ODAC_Image2} className="activity-image" />
            <img src={ODAC_Image3} className="activity-image" />
          </div>
        </div>
      </div>
      <div className="activity-entry">
        <img src={CW_Logo} className="activity-logo" />
        <div className="activity-content">
          <h3>The Queen's Commonwealth Essay Competition</h3>
          <p>I participated in The Queen's Commonwealth Essay Competition,the world's oldest international writing competition for schools, where I had the opportunity to express my thoughts and ideas on important global issues through writing. This experience helped me improve my writing skills and gain a deeper understanding of the challenges faced by different communities around the world, and I am proud to have been awarded the silver award and bringing recognition to my school on the international stage.</p>
          <div className="activity-images">
            <img src={CW_Certificate} className="activity-image" />
          </div>
        </div>
      </div>
      <div className="activity-entry">
        <img src={HWN} className="activity-logo" />
        <div className="activity-content">
          <h3>Volunteering Work</h3>
          <p>I was a volunteer at the Heartware Network, where I worked as a tutor to primary school students from less privileged backgrounds. Helping them with their studies and providing mentorship to them was a fulfilling experience, as I was able to make a positive impact on their lives and contribute to their personal growth. It was fulfilling to see the smiles on the faces of their parents as their academic results improved over time, knowing that I was able to make a positive impact on the community.</p>
        </div>
      </div>

      <h2 className="life-stage-heading">National Service</h2>
      <div className="activity-entry">
        <img src={RSN} className="activity-logo" />
        <div className="activity-content">
          <h3>Republic of Singapore Navy</h3>
          <p>I was posted to the RSN as a Security Trooper, where I was responsible for maintaining the safety and security of the naval base. This role required me to be vigilant and proactive in identifying potential threats, as well as responding effectively to any incidents that arose. My time in the RSN taught me the importance of discipline, teamwork, and leadership, as I worked closely with my fellow servicemen to ensure the safety and smooth operation of the base. I was also responsible for conducting regular security checks and drills, which helped to reinforce the importance of preparedness and attention to detail. On top of that, I also was responsible for handling logistics for the guardroom, ensuring that all necessary supplies and equipment were available and in good working order. Concurrently, I also had to manage the security clearance for the entire base, validating who has access to the base and for how long. This experience honed my organizational skills and ability to work under pressure, as well as my ability to adapt quickly to changing situations.</p>
          <div className="activity-images">
            <img src={Navy_Image} className="activity-image" />
            <img src={Navy_Image2} className="activity-image" />
            <img src={Navy_Image3} className="activity-image" />
            <img src={Navy_Image4} className="activity-image" />
          </div>
        </div>
      </div>

      <h2 className="life-stage-heading">University</h2>
      <div className="activity-entry">
        <img src={Choir_Logo} className="activity-logo" />
        <div className="activity-content">
          <h3>NTU Choir</h3>
          <p>I was a member of the NTU Choir, where I had the opportunity to perform in various concerts and events, showcasing our talent and hard work. Being part of the choir allowed me to develop my musical skills and work collaboratively with others who share the same passion for music. I had the opportunity to participate in the Sing Berlin! competition, held in Berlin, Germany over the summer break of the 1st year. This experience was invaluable, as it allowed me to immerse myself in a different culture and gain new perspectives on music and performance. Through extensive hardwork, collaboration, and dedication, we were able to deliver a memorable performance that resonated with the audience that cinched us the category champion awards for the 2 categories that we competed in, receiving the Gold VII diplomas for our performances in both categories. I am proud to have represented NTU and Singapore, and contributed to our success in this prestigious competition.</p>
          <div className="activity-images">
            <img src={Choir_Image1} className="activity-image" />
            <img src={Choir_Image2} className="activity-image" />
            <img src={Choir_Image3} className="activity-image" />
          </div>
        </div>
      </div>
    </section>
  );
}
