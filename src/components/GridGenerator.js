import React, { useState } from 'react';
// components
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PureModal from 'react-pure-modal';
import LazyImage from './LazyImage';
import 'react-pure-modal/dist/react-pure-modal.min.css';
// css
import './grid.css';
import './fireworks.css';   // for fireworks on hover

const placeholderUrl = (item) => `https://api.dicebear.com/7.x/thumbs/svg?mouth=variant1,variant2,variant3,variant4&seed=${item.name}&faceOffsetX=0&eyes=variant2W10,variant2W12,variant2W14,variant2W16,variant3W10,variant3W12,variant3W14,variant3W16,variant4W10,variant4W12,variant4W14,variant4W16,variant5W10,variant5W12,variant5W14,variant5W16,variant6W10,variant6W12,variant6W14,variant6W16,variant7W10,variant7W12,variant7W14,variant7W16,variant8W10,variant8W12,variant8W14,variant8W16,variant9W10,variant9W12,variant9W14,variant9W16`;

const GridGenerator = ({ jsonData, setHoverStatus, currentMarkdown }) => {
  const [modal, setModal] = useState(false);
  const [modalHeader, setModalHeader] = useState('');
  const [modalContent, setModalContent] = useState('');
  var isClassMarkdown = currentMarkdown.includes("department/Extras/Classes");

  const openModal = (header, content) => {
    setModalHeader(header); 
    setModalContent(content);
    setModal(true);
  };

  function studentProfileModalHeader(person) {
    return (
      (<div>
        <img style={{ display: 'inline-block', height: '150px' }} className="student-profile" src={person.image.length > 0 ? person.image : placeholderUrl(person)} alt={person.name} />
        <h2>{person.name}</h2>
        <h4>{person.title}</h4>
        </div>)
    )
  }

  function studentProfileModalContent(person) {
    return (
      <div className="modal-body">
        <p>
          <strong>Current Position:</strong> {person.current_position != null ? person.current_position : "N/A"}
        </p>
        {person.top_skills != null && (
          <div>
            <p>
              <strong>Top Skills:</strong>
            </p>
            <div className="skills-container">
              {person.top_skills.split(",").map((skill, index) => (
                <span key={index} className="skill-oval">
                  {skill}
                </span>
              ))}
            </div>
          </div>)
        }
        <p>
          <ReactMarkdown children={person.markdown.replace("[LinkedIn]()", "[LinkedIn]("+person.linkedin_url+")")} remarkPlugins={[remarkGfm]} />
        </p>
      </div>
    );
  }

  const renderItems = (items) => {
    return items.map((item, index) => (
      <div className={isClassMarkdown && item.current_position == null ? "course-circle student-unknown-position" : "course-circle"}
        key={index} onClick={() => { if(isClassMarkdown){
          openModal(studentProfileModalHeader(item), studentProfileModalContent(item))
        } else {
          openModal(jsonData[0].markdown_title, item.markdown)
        } }} onMouseEnter={() => { setHoverStatus(true) }} onMouseLeave={() => { setHoverStatus(false) }}> {
          isClassMarkdown ?
            <LazyImage alt={item.name} imageUrl={item.image} placeholderUrl={placeholderUrl(item)} ></LazyImage>
            : <img style={{ display: 'inline-block', height: '150px' }} src={item.image.length > 0 ? item.image : placeholderUrl(item)} alt={item.name} />
        }
        <p id="p">{item.name}</p>
        { isClassMarkdown && item.title && <h5 id="p">{item.title}</h5>}
      </div>
    ));
  };

  const renderSections = () => {
    return jsonData.map((section, index) => (
      <section key={index}>
        <h1>{section.title}</h1>
        <ReactMarkdown children={section.description} remarkPlugins={[remarkGfm]} />
        {section.items.map((item, itemIndex) => (
          <div key={itemIndex}>
            <h2>{item.title}</h2>
            <ReactMarkdown children={item.description} remarkPlugins={[remarkGfm]} />
            <div className="wrapped-circles">{renderItems(item.items)}</div>
          </div>
        ))}
      </section>
    ));
  };
  return (
    <div>
      {renderSections()}
      <PureModal
        header={modalHeader}
        isOpen={modal}
        onClose={() => {
          setModal(false);
          setModalHeader(jsonData[0].markdown_title);
          setModalContent('');
        }}
        width={'800px'}
      >
        {isClassMarkdown ? modalContent :
          <ReactMarkdown children={modalContent} remarkPlugins={[remarkGfm]} />}
      </PureModal >
    </div>
  );
};
export default GridGenerator;


