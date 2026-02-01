import "../styles/ContactMe.css";
import "../styles/AboutMe.css";

import { Link } from "react-router-dom";

export default function AboutMe() {

  const FAQs = [
    {
      question: "What is your favorite place to SCUBA dive?",
      answer: "From my time living in Hawaii, I am biased to say Maunalua Bay just off of Kalaniana'ole Hwy on Oahu. Such an incredibly diverse and rich ecosystem!. An easy second place is the Caribbean, beautiful clear water and vibrant marine life.",
    },
    {
      question: "What does you SCUBA setup look like?",
      answer: "I use a 12L aluminum tank mounted on a backplate and wings with a 5ft primary regulator and a short backup octopus reg in case of emergencies. I'm not a gear snob, but I do like to keep things simple and reliable. DIR. Do. It. Right.",
    },
    {
    question: "What tech do you use most?",
      answer: "While my area of expertise is largely backend, I have experience with Full Stack development. React + TypeScript on the frontend, plus APIs (Node/.NET/Java), databases (SQL/MongoDB), and AWS when hosting.",
    },
    {
      question: "Where are you located?",
      answer: "I am currently based in NY/NJ, but I am open to remote opportunities and relocation as well. This world is too vast to stay in one place!",
    },
    {
      question: "Are you open to freelance / contract work?",
      answer: "Yes — especially for projects where quality and UX matter. While I'm primarily looking for full-time roles, I enjoy contributing to projects that are a good fit for me.",
    },
    {
      question: "What do you like building?",
      answer: "Apps that work. Clean, simple, reliable products that solve real problems. I've worked on tax solutions, clinical decision support APIs, and research data management apps for the federal government. While not the most flashy or cutting edge, I enjoy building systems that are designed to help people get their work done effectively.",
    },
    {
      question: "What do you like doing when you're not coding?",
      answer: "I enjoy SCUBA diving, reading, cooking, and playing tennis. Exercise for the body and exercise for the soul. And as much as I seem like a homebody, I am a glut for traveling as much as I can, and love exploring new places and cultures.",
    },
    {
      question: "What is your favorite dish to cook?",
      answer: "I love to make a mean Bulgogi Gumbo over rice with a side of Mac salad. A fusion of my Korean heritage and my experience living in both in the boot (Louisiana) and Hawaii. These dishes aren't fancy haute cuisine, instead born out of necessity and resourcefulness. I think it speaks to my personality, a scrappy underdog fighter who will do whatever it takes to get the job done.",
    },
    {
      question: "What's your dream job?",
      answer: "To be sipping a Mai Tai on a beach in Hawaii. Just kidding (sort of). To be honest, any role where I can build meaningful products that help people, while working with a talented and driven team. I see myself as a big picture person who enjoys both the technical and human sides of software development, so an ideal environment would be one where I can contribute on multiple levels.",
    }
  ];

  const scrollToNext = () => {
    const element = document.getElementById("aboutHeroText");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <main className="container">
      {/* Header */}
      <section className="aboutHero">
        <div className = "aboutHeroInner">
          {/* Left column */}
          <div className="aboutHeroMedia">
            <div className="aboutMyImageWrapper">
              <img
                src= "/Dan_Hong_Crab.jpg"
                alt="MEMEMEMEME"
                className="aboutMyImage"
                onClick={scrollToNext}
              />
              {/* <div optional splash/accent layer */}
            </div>

          </div>

          {/* Right column */}
          <div id="aboutHeroText" className = "aboutHeroText">
            <h1 className = "h1" style={{marginBottom: "75px", textAlign: "left"}}>
              Who is this guy?
            </h1>

            <div className = "aboutLead" style={{textAlign: "left", marginBottom: "24px"}}>
              Daniel Hong is a pragmatic backend engineer with full-stack experience, quickly diving into the world of AI. He’s most at home untangling complex problems, designing systems that make sense a month later, and aiming for software that’s boring for all the right reasons.
            </div>

            <div className = "aboutLead" style={{textAlign: "left"}}>
              And the latest trends cutting edge technology is not the only thing he dives into. When he’s not writing code, he’s likely underwater as a PADI-certified rescue SCUBA diver, experimenting in the kitchen, or up in the air flying a bug smasher. He tends to approach software the same way he approaches everything else: plan ahead, stay curious, and keep a steady hand when things get interesting.
            </div>

            <div className = "aboutTldr">
              TLDR: Turns chaos into something that works, usually on purpose.
            </div>

            {/* CTAs */}
            <div className="aboutCtas">
              <Link className="btn" to="/projects">
                Come look at my portfolio!
              </Link>
              <Link className="btn" to="/technicalme">
                My Tech Skills
              </Link>
              <a className  = "btn btnPrimary" href="files/Daniel_Hong_Resume.pdf">
                View Resume
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className = "container pageBody">
        <div className = "aboutFAQs" style = {{marginLeft: "140px"}}>
          <h1 className = "h1 aboutFAQsTitle"> FAQs</h1>

          <div className="faqList">
            {FAQs.map((item) => (
              <details key={item.question} className="faqItem">
                <summary className="faqSummary">
                  <span className="faqQuestion">{item.question}</span>
                </summary>

                <div className="faqAnswer subhead">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>


        </div>
      </section>

      {/* Contact me Section */}
      {/* TODO justify text left */}
      <section className = "contactMe">
        <h2 className = "h2 contactMeTitle">Still have questions? Want to get in touch?</h2>
        <Link className="btn btnPrimary contactMeCta" to="/contact">
          Contact Me
        </Link>
      </section>

    </main>
  );
}
